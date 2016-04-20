$( document ).ready(function() {

	var photoArr = [];

	var flickr = new Flickr({
	  api_key: "a5e95177da353f58113fd60296e1d250",
	});

	flickr.people.getPhotos({
		user_id: "24662369@N07",
		extras: "description"
	}, function(err, result) {
		parseJSON(result);
	});


	//selecting sort options from the dropdown
	$("#sortDropdown").on("click", "li a", function() {
		var value = $(this).text();
		$("#dropdownValue").html(value);
		sortAndSearch({'sortValue': value});
	});

	//search through the images
	$('#searchBttn').on('click', function(){
		var value = $('#searchInput').val();
		sortAndSearch({'searchValue': value});
	})

	//call search endpoint for flickr photos
	function sortAndSearch(obj){
		var value = $('#searchInput').val();
		//empty array
		photoArr = [];
		//empty the grid
		$(".photoGrid").empty();

		//call flickr endpoint for search
		flickr.photos.search({
			user_id: "24662369@N07",
			extras: "description",
			text: obj.searchValue !== undefined ? obj.searchValue : "",
			sort: obj.sortValue !== undefined ? obj.sortValue : ""
		}, function(err, result){
			parseJSON(result);
		});

	};

	//parse the json and updated the photo grid
	function parseJSON(response){
		var allPhotos = response.photos.photo;

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
	};    
});