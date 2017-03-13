<p class="lead">
	Enter your product details here, including the price (<strong>in cents</strong>) and a short description.
</p>
<form role="form">
	<div class="row">
		<div class="col-sm-4">
			<div class="form-group">
				<label for="name">Product Name</label>
				<input class="form-control" type="text" name="name" id="name" />
			</div>
		</div>
		<div class="col-sm-4">
			<div class="form-group">
				<label for="type">Product Type</label>
				<select id="type" name="type" class="form-control">
					<option value="ticket">Event Ticket</option>
				</select>
			</div>
		</div>
		<div class="col-sm-4">
			<div class="form-group">
				<label for="price">Price (in cents)</label>
				<input type="number" class="form-control" name="price" id="price" />
			</div>
		</div>
	</div>
	<div class="form-group">
		<label for="description">Product Description</label>
		<input type="text" class="form-control" name="description" id="description" />
	</div>
</form>