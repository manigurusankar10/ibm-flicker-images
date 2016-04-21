$( document ).ready(function() {

	this.photoArr = [];
	this.page = 1;
	this.totalPage;
	this.searchValue = "";
	this.sortValue = ""

	//create the flickr API object.
	this.flickr = new Flickr({
	  api_key: "a5e95177da353f58113fd60296e1d250",
	});

	//get all the photos
	this.flickr.people.getPublicPhotos({
		user_id: "24662369@N07",
		extras: "description",
		page: this.page,
		per_page: 150
	}, function(err, result) {
		parseJSON(result);
	});

	//previous page
	$(".previous").on("click", function(){
		if(this.page != 1){
			this.page--;
			$('.sk-three-bounce').show();
			sortAndSearch();
		}
	}.bind(this));

	//next page
	$(".next").on("click", function(){
		if(this.page < this.totalPage){
			this.page++;
			$('.sk-three-bounce').show();
			sortAndSearch();
		}
	}.bind(this));

	//selecting sort options from the dropdown
	$("#sortDropdown").on("click", "li a", function(evt) {
		var value = $(evt.currentTarget).data("value");
		var text = $(evt.currentTarget).text();
		$("#dropdownValue").html(text);

		//show loading icon
		$('.sk-three-bounce').show();

		this.sortValue = value;
		sortAndSearch();
	}.bind(this));

	//search through the images
	$('#searchBttn').on('click', function(){
		var value = $('#searchInput').val();

		//show loading icon
		$('.sk-three-bounce').show();
		this.searchValue = value;
		sortAndSearch();
	}.bind(this));

	//call search endpoint for flickr photos
	var sortAndSearch = function(){
		var value = $('#searchInput').val();
		//empty array
		this.photoArr = [];
		//empty the grid
		$(".photoGrid").empty();

		//call flickr endpoint for search
		this.flickr.photos.search({
			user_id: "24662369@N07",
			extras: "description",
			page: this.page,
			per_page: 150,
			text: this.searchValue !== undefined ? this.searchValue : "",
			sort: this.sortValue !== undefined ? this.sortValue : ""
		}, function(err, result){
			parseJSON(result);
		});
	}.bind(this);

	//parse the json and updated the photo grid
	var parseJSON = function(response){
		var allPhotos = response.photos.photo;
		this.totalPage = response.photos.pages

		//hide loading icon
		$('.sk-three-bounce').hide();

		//check if response has photos
		if(allPhotos.length !== 0) {
			$('.alert-warning').hide();
			$('.next').show();
			$('.previous').show();

			//parse the json response
			allPhotos.forEach(function(photo){
				this.photoArr.push({
					"farm": photo.farm,
					"id": photo.id,
					"server": photo.server,
					"secret": photo.secret,
					"urlDefault": 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg',
					"description": photo.description._content,
					"title": photo.title
				});
			}.bind(this));

			//get each photo and append to the html page
			this.photoArr.forEach(function(photo, index){
				$(".photoGrid").append("<a href='#' data-image=" + photo.id + "><img src="+ photo.urlDefault +"></a>");
			});
		} else {
			$('.alert-warning').show();
			$('.next').hide();
			$('.previous').hide();
		}
	}.bind(this);  

	//when someone clicks on the smaller image, make a call to get the larger image
	$(".photoGrid").on("click", "a", function(evt){
		var photoID = $(evt.currentTarget).data('image');

		//get info for that specific image
		this.flickr.photos.getInfo({
			photo_id: photoID
		}, function(err, result){
			var photo = result.photo;
			var urlDefault = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
			$("#largerImage .modal-title").text(photo.title._content);
			$("#largerImage .modal-body").empty().append("<img src="+ urlDefault +">");
			$("#largerImage").modal('toggle');
		});
	}.bind(this));

});