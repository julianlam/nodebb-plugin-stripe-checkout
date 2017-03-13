"use strict";

$(document).ready(function () {
	// Sideload Stripe Checkout Javascript
	var scriptEl = document.createElement('script');
	scriptEl.src = 'https://checkout.stripe.com/checkout.js';
	scriptEl.async = 'async';
	document.body.appendChild(scriptEl);
});