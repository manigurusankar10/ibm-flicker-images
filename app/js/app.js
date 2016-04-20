$( document ).ready(function() {

	var photoArr = [];

	var flickr = new Flickr({
	  api_key: "a5e95177da353f58113fd60296e1d250",
	});

	flickr.people.getPhotos({
		user_id: "24662369@N07",
		extras: "description"
	}, function(err, result) {
		var allPhotos = result.photos.photo;

		//parse the json response
		allPhotos.forEach(function(photo){
			photoArr.push({
				"farm": photo.farm,
				"id": photo.id,
				"server": photo.server,
				"secret": photo.secret,
				"urlDefault": 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg',
				"description": photo.description._content,
				"title": photo.title
			});
		});

		//get each photo and append to the html page
		photoArr.forEach(function(photo, index){
			if(index%3 ===0){
				$(".photoGrid").append("<div class='row'><div class='col-md-4'><h3>"+photo.title +"</h3><a href='#' class='thumbnail'><img src="+ photo.urlDefault +"></a><p>"/*+ photo.description*/ +"</p></div></div>");
			} else {
				$(".photoGrid .row:last").append("<div class='col-md-4'><h3>"+photo.title +"</h3><a href='#' class='thumbnail'><img src="+ photo.urlDefault +"></a><p>"/*+ photo.description */+"</p></div>");
			}
		});
	});
});