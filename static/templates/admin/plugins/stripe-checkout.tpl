<form role="form" class="stripe-checkout-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Configuration</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
				Enter your Stripe-provided API keys below.
			</p>
			<div class="form-group">
				<label for="secret">Secret Key</label>
				<input type="text" id="secret" name="secret" title="Secret Key" class="form-control" placeholder="Secret Key">
			</div>
			<div class="form-group">
				<label for="publishable">Publishable Key</label>
				<input type="text" id="publishable" name="publishable" title="Publishable Key" class="form-control" placeholder="Publishable Key">
			</div>
			<div class="form-group">
				<label for="image">Checkout Image</label>
				<input type="text" id="image" name="image" title="Image" class="form-control" placeholder="Image">
				<p class="help-block">
					The Checkout Image is the image shown to users when they check out through your website. Typically a logo would be used here.
				</p>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Products</div>
		<div class="col-sm-10 col-xs-12">
			<!-- IF !products.length -->
			<div class="alert alert-info">
				No products found
			</div>
			<!-- ENDIF !products.length -->
			<!-- BEGIN products -->
			<div class="media">
				<div class="media-body">
					<div class="btn-group pull-right">
						<!-- IF ../enabled -->
						<div class="btn btn-default"><i class="fa fa-circle text-success"></i> Enabled</div>
						<!-- ELSE -->
						<div class="btn btn-default"><i class="fa fa-circle text-danger"></i> Disabled</div>
						<!-- ENDIF ../enabled -->
						<div class="btn btn-danger"><i class="fa fa-trash-o"></i></div>
					</div>
					<h4 class="media-heading">{../name}</h4>
					<p>{../description}</p>
				</div>
			</div>
			<!-- END products -->
		</div>
	</div>
</form>

<div class="floating-button">
	<button id="add" class="success mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
		<i class="material-icons">add</i>
	</button>
	<button id="save" class="primary mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
		<i class="material-icons">save</i>
	</button>
</div>