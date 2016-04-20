$( document ).ready(function() {
	var photoArr = [];

	var flickr = new Flickr({
	  api_key: "a5e95177da353f58113fd60296e1d250",
	});

	flickr.people.getPhotos({
		api_key: "a5e95177da353f58113fd60296e1d250",
		user_id: "24662369@N07"
	}, function(err, result) {
		var allPhotos = result.photos.photo;

		//parse the json response
		allPhotos.forEach(function(photo){
			photoArr.push({
				"farm": photo.farm,
				"id": photo.id,
				"server": photo.server,
				"secret": photo.secret
			});
		});

		//get each photo and append to the html page
		photoArr.forEach(function(photo){
			var urlDefault = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
			$(".photoGrid").append("<img src="+ urlDefault +">");
		})

	});
});