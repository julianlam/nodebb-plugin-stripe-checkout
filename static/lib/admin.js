'use strict';
/* globals $, app, socket */

define('admin/plugins/stripe-checkout', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('stripe-checkout', $('.stripe-checkout-settings'));

		$('#save').on('click', function () {
			Settings.save('stripe-checkout', $('.stripe-checkout-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'stripe-checkout-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});

		$('#add').on('click', function () {
			app.parseAndTranslate('modals/stripe-add-product', {}, function(html) {
				bootbox.dialog({
					title: 'Add New Product',
					message: html,
					buttons: {
						submit: {
							label: 'Add Product',
							callback: function () {
								var self = this;
								var payload = this.find('form').serializeArray();
								socket.emit('plugins.stripeCheckout.addProduct', {
									payload: payload
								}, function (err) {
									if (err) {
										app.alertError(err.message);
									} else {
										app.alertSuccess('Product Added');
										ajaxify.refresh();
										self.modal('hide');
									}
								});

								return false;
							}
						}
					}
				});
			});
		});
	};

	return ACP;
});