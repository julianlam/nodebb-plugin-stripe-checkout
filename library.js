"use strict";

var controllers = require('./lib/controllers');

var db = module.parent.require('./database');
var meta = module.parent.require('./meta');
var winston = module.parent.require('winston');

var async = require('async');
var stripe = require('stripe');

var plugin = {
	_settings: undefined,
	_defaults: {
		ready: false,
		secret: undefined,
		publishable: undefined
	}
};
var app;

/* Websocket Listeners */

var SocketPlugins = require.main.require('./src/socket.io/plugins');
SocketPlugins.stripeCheckout = {};

SocketPlugins.stripeCheckout.addProduct = function(socket, data, callback) {
	var productObj = Object.assign({
		name: 'New Product',
		price: 100,
		description: 'Product Description'
	}, data.payload.reduce(function (memo, cur) {
		memo[cur.name] = cur.value;
		return memo;
	}, {}));

	plugin.products.add(productObj, callback);
};

/* End */

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
	
	app = params.app;
		
	router.get('/admin/plugins/stripe-checkout', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/stripe-checkout', controllers.renderAdminPage);

	meta.settings.get('stripe-checkout', function (err, settings) {
		plugin._settings = Object.assign(plugin._defaults, settings);
		plugin.testCredentials();
	});

	callback();
};

plugin.testCredentials = function () {
	if (plugin._settings.secret) {
		winston.verbose('[plugin/stripe] Testing credentials');
		stripe = stripe(plugin._settings.secret);
		stripe.charges.list({ limit: 1 }, function (err, charges) {
			if (err) {
				winston.error('[plugin/stripe-checkout] Credentials invalid, please double-check your API keys!');
			} else {
				plugin._settings.ready = true;
				winston.verbose('[plugin/stripe-checkout] Credentials OK.');
			}
		});
	} else {
		winston.warn('[plugin/stripe-checkout] No secret key provided, Stripe Checkout disabled.');
	}
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/stripe-checkout',
		icon: 'fa-cc-stripe',
		name: 'Stripe Checkout'
	});

	callback(null, header);
};

plugin.defineWidgets = function (widgets, callback) {
	var widget = {
		widget: "stripeCheckout-buy",
		name: "Buy Button (Stripe Checkout)",
		description: "Renders a Buy button for a product configured via the Stripe Checkout plugin",
		content: 'admin/partials/stripe-buy-configure'
	};

	async.waterfall([
		async.apply(plugin.products.list),
		function (products, next) {
			app.render(widget.content, {
				products: products
			}, function(err, html) {
				widget.content = html;
				next(err);
			});
		}
	], function (err) {
		if (err) {
			return callback(err);
		}

		widgets.push(widget);
		return callback(null, widgets);
	});
};

plugin.renderBuyButton = function (widget, callback) {
	plugin.products.get(widget.data.pid, function (err, product) {
		if (err) {
			return callback(err);
		}

		app.render('widgets/buy', {
			product: product,
			key: plugin._settings.publishable,
			btnClass: widget.data.btnClass
		}, callback);
	});
};

plugin.products = {};

plugin.products.list = function (set, callback) {
	// set is optional
	if (typeof set === 'function' && !callback) {
		callback = set;
		set = 'all';
	}

	async.waterfall([
		async.apply(db.getSortedSetRevRange, 'stripe-checkout:products:' + set, 0, -1),
		function (pids, next) {
			async.map(pids, plugin.products.get, next);
		}
	], callback);
};

plugin.products.get = function (pid, callback) {
	async.parallel({
		base: async.apply(db.getObject.bind(db), 'stripe-checkout:product:' + pid),
		enabled: async.apply(db.isSortedSetMember.bind(db), 'stripe-checkout:products:enabled', pid)
	}, function (err, data) {
		if (err) {
			return callback(err);
		}

		data.base.enabled = data.enabled;
		data.base.price = parseInt(data.base.price, 10);
		data.base.typeCheck = ['ticket'].reduce(function (memo, type) {
			memo[type] = data.base.type === type;
			return memo;
		}, {});

		return callback(null, data.base);
	});
};

plugin.products.add = function (payload, callback) {
	async.waterfall([
		function (next) {
			// Ensure it has the required fields
			var required = ['type', 'name', 'description', 'price'];
			var valuesOk = required.every(function (prop) {
				return payload.hasOwnProperty(prop) && payload[prop];
			});

			if (valuesOk && !isNaN(parseInt(payload.price, 10))) {
				setImmediate(next);
			} else {
				next(new Error('[[error:invalid-data]]'));
			}
		},
		async.apply(db.incrObjectField, 'global', 'stripePid'),
		function (pid, next) {
			payload.pid = pid;

			async.parallel([
				async.apply(db.setObject, 'stripe-checkout:product:' + pid, payload, next),
				async.apply(db.sortedSetAdd, 'stripe-checkout:products:all', Date.now(), pid),
				async.apply(db.sortedSetAdd, 'stripe-checkout:products:enabled', Date.now(), pid)
			], next);
		}
	], callback);
};

module.exports = plugin;