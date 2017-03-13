'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	var plugin = require('../library');

	plugin.products.list(function (err, products) {
		if (err) {
			return next(err);
		}

		res.render('admin/plugins/stripe-checkout', {
			products: products
		});
	});
};

module.exports = Controllers;