<form role="form" id="stripeCheckout-{product.pid}">
	<!-- IF product.typeCheck.ticket -->
	<div class="form-group">
		<label for="numTickets">Number of Tickets</label>
		<input type="number" class="form-control" id="numTickets" name="numTickets" />
	</div>
	<!-- ENDIF product.typeCheck.ticket -->
	<button class="btn btn-primary<!-- IF btnClass --> {btnClass}<!-- ENDIF btnClass -->">Buy</button>
</form>

<script>
	$(document).ready(function () {
		var formEl = $('#stripeCheckout-{product.pid}');
		var load = function () {
			if (!window.hasOwnProperty('StripeCheckout')) {
				console.log('no más');
				return setTimeout(load, 500);
			}

			var handler = StripeCheckout.configure({
				key: '{key}',
				image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
				locale: 'auto',
				billingAddress: true,
				token: function(token) {
					console.log(token);
					// socket.emit('plugins.stripeCheckout.buy', {
					// 	token: token.id
					// })
				}
			});

			formEl.find('button').on('click', function(e) {
				// Calculate price based on form options
				var price = 0;
				<!-- IF product.typeCheck.ticket -->
				console.log(formEl.find('#numTickets'));
				console.log(formEl.find('#numTickets').val());
				console.log('{product.price}');
				console.log(parseInt('{product.price}', 10));
				price = formEl.find('#numTickets').val() * parseInt('{product.price}', 10);
				<!-- ENDIF product.typeCheck.ticket -->
				console.log('price is', price);

				// Open Checkout with further options:
				handler.open({
					name: '{product.name}',
					description: '{product.description}',
					zipCode: true,
					currency: 'cad',
					amount: price
				});
				e.preventDefault();
			});

			// Close Checkout on page navigation:
			window.addEventListener('popstate', function() {
				handler.close();
			});
		}

		load();
	});
</script>