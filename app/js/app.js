$( document ).ready(function() {

	var photoArr = [];

	var flickr = new Flickr({
	  api_key: "a5e95177da353f58113fd60296e1d250",
	});

	flickr.people.getPublicPhotos({
		user_id: "24662369@N07",
		extras: "description",
		per_page: 150
	}, function(err, result) {
		parseJSON(result);
	});


	//selecting sort options from the dropdown
	$("#sortDropdown").on("click", "li a", function() {
		var value = $(this).text();
		$("#dropdownValue").html(value);

		//show loading icon
		$('.sk-three-bounce').show();

		sortAndSearch({'sortValue': value});
	});

	//search through the images
	$('#searchBttn').on('click', function(){
		var value = $('#searchInput').val();

		//show loading icon
		$('.sk-three-bounce').show();
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
			per_page: 150,
			text: obj.searchValue !== undefined ? obj.searchValue : "",
			sort: obj.sortValue !== undefined ? obj.sortValue : ""
		}, function(err, result){
			parseJSON(result);
		});

	};

	//parse the json and updated the photo grid
	function parseJSON(response){
		var allPhotos = response.photos.photo;

		//hide loading icon
		$('.sk-three-bounce').hide();

		//parse the json response
		allPhotos.forEach(function(photo){
			photoArr.push({
				"farm": photo.farm,
				"id": photo.id,
				"server": photo.server,
				"secret": photo.secret,
				"urlDefault": 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg',
				"description": photo.description._content,
				"title": photo.title
			});
		});

		//get each photo and append to the html page
		photoArr.forEach(function(photo, index){
			$(".photoGrid").append("<a href='#' data-image=" + photo.id + "><img src="+ photo.urlDefault +"></a>");
		});
	};  

	//when someone clicks on the smaller image, make a call to get the larger image
	$(".photoGrid").on("click", "a", function(){
		var photoID = $(this).data('image');

		//get info for that specific image
		flickr.photos.getInfo({
			photo_id: photoID
		}, function(err, result){
			var photo = result.photo;
			var urlDefault = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
			$("#largerImage .modal-title").text(photo.title._content);
			$("#largerImage .modal-body").empty().append("<img src="+ urlDefault +">");
			$("#largerImage").modal('toggle');
		});
	});

});