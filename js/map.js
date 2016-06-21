/* **********************  Google Maps Code ***************************** */

'use strict';
	
var mapApp = mapApp || {};

(function($){


	var map;
	var filmsArr = [];
	var currentFilmArr = [];
	var geocoder;
	var infowindow = new google.maps.InfoWindow();
	var marker;  
	var omdbKey = '9d7a5cd9';
	var styleDark = [
		{"featureType": "road.local", "stylers": [{ "visibility": "on" }, { "color": "#8a8280" }]},
		{"featureType": "water", "stylers": [{ "color": "#405c80" }, { "saturation": -78 },{ "lightness": 4 }]},
		{"elementType": "labels.text.fill", "stylers": [{ "color": "#808080" }, { "lightness": 69 }, { "saturation": 11 }, { "gamma": 2.29 }]},
		{"elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ]},
		{"featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }]},
		{"featureType": "landscape.man_made", "stylers": [{ "color": "#b37d80" }, { "saturation": -100 }, { "lightness": -64 }]},
		{"featureType": "road.highway", "stylers": [{ "color": "#a76380" }, { "saturation": -100 }, { "lightness": -47 }]},
		{"featureType": "poi", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ]},
		{"featureType": "road.arterial", "stylers": [{ "saturation": -8 }, { "gamma": 1.13 }, { "color": "#788080" }, { "lightness": -68 }]},
		{"featureType": "poi", "stylers": [{ "color": "#997f80" }, { "saturation": -49 }, { "lightness": -100 }]},
		{"elementType": "labels.text.fill", "stylers": [{ "color": "#808080" }, { "saturation": -39 }, { "lightness": 51 }]}
	];

	mapApp = {

		currDecade: 0,
		currFilms: [],
		currMarkers: [],
		contentString: 'afadfa',

		mainLatLng: new google.maps.LatLng(40.730885, -73.997383),

		init: function(){
			mapApp.getFilms();

			// var latlng = new google.maps.LatLng(40.730885, -73.997383);
		  
			var mapOptions = {
				zoom: 15,
				center: mapApp.mainLatLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        	map.setOptions({styles: styleDark}); 

    		$(document).on('click', '.decades button', function(){
				mapApp.currDecade = $(this).attr('data-decade').replace('d', '');
				mapApp.currFilms = $.grep(filmsArr, function( n, i ) {
					var filmYear = n.year.split('')[2];
				  	return ( filmYear === mapApp.currDecade );
				});
				console.log('currFilms: ', mapApp.currFilms);

				mapApp.plotFilms(mapApp.currFilms);
			});

		},

		getFilms: function(){
			// Get Films.xml
			$.ajax({
			  type: "GET",
			  url: "Films.xml",
			  dataType: "xml",
			  success: function(xml) {
				// List film names in DOM
				$(xml).find('Film').each(function(){
				  var titleStr = $(this).find('Cell').eq(0).text();
				  var title = $.trim(titleStr);
				  var filmYearStr = $(this).find('Cell').eq(1).text();
				  var filmYear = $.trim(filmYearStr);
				  var lngStr = $(this).find('Cell').eq(10).text();
				  var lng = $.trim(lngStr);
				  var latStr = $(this).find('Cell').eq(9).text();
				  var lat = $.trim(latStr);
				  var filmBoroughStr = $(this).find('Cell').eq(11).text();
				  var filmBorough = $.trim(filmBoroughStr);	
				  var idStrArr = $(this).find('Cell').eq(15).text().split('/');
				  var idStr = idStrArr[idStrArr.length - 2];
				  var id = $.trim(idStr);
				  
				  filmsArr.push({'title':title, 'year': filmYear, 'id': id, 'lng': lng, 'lat': lat, 'borough':filmBorough});
				});
			  },
			  error : function(){console.log('error in parsing film info.');}	  
			});// End Get Films.xml
		},

		plotFilms: function(films){

			mapApp.removeFilms();

			for (var film in films){
				var latlng = new google.maps.LatLng(films[film].lat, films[film].lng);
				map.setZoom(14);

				marker = new google.maps.Marker({
				  position: latlng,
				  map: map
				});

				mapApp.currMarkers.push(marker);
				map.setCenter(mapApp.mainLatLng);

				(function(marker, film){

					// var contentString = '';

					$.ajax({
						type: "GET",
						url: "http://www.omdbapi.com/?r=xml",
						data:{'i':film.id},
						dataType: "xml",
						success: function(xmlIMDB) {
							console.log('success');

							// Get IMDB info
							$(xmlIMDB).find('movie').each(function(){
								var imdb_title = $(this).attr('title');
								var imdb_filmYear = $(this).attr('year');
								var imdb_director = $(this).attr('director');
								var imdb_plot = $(this).attr('plot');
								var imdb_rating = $(this).attr('imdbRating');
								var imdb_votes = $(this).attr('imdbVotes');
								var imdb_img = $(this).attr('poster');

					 			var contentString = '<div class="film-info"><header class="film-info_header"><h3 class="film-title">Title: '+film.title+'</h3></header><section class="image-block"><img src="'+ imdb_img +'" /></section><button class="cta">Directions</button></div>';
					 			
					 			var infowindow = new google.maps.InfoWindow({
									content: contentString
								});

								console.log('marker: ', marker);

								marker.addListener('click', function() {
									mapApp.removeInfoWindows();
									infowindow.open(map, marker);
								});

					 			// console.log('contentString: ', contentString);
								// console.log('.overlayContent .title: ', imdb_title);
								// console.log('.overlayContent .dir .value: ', imdb_director);
								// console.log('.overlayContent .rating .value: ', imdb_rating);
								// console.log('.overlayContent .votes .value: ', imdb_votes);
								// console.log('.overlayContent .plot .value: ', imdb_plot);
								// console.log('imdbImg: ', imdb_img);
							});

						}
					}); // End Get imdb

					// var contentString = '<div class="film-info"><header class="film-info_header"><h3 class="film-title">Title: '+film.title+'</h3></header><section class="image-block"><img src="'+ imdb_img +'" /></section><button class="cta">Directions</button></div>';

	    //             var infowindow = new google.maps.InfoWindow({
					// 	content: mapApp.contentString
					// });

					// marker.addListener('click', function() {
					// 	mapApp.removeInfoWindows();
					// 	infowindow.open(map, marker);
					// });

				})(marker, films[film])
			}

		},

		removeFilms: function(){
			for (var i = 0; i < mapApp.currMarkers.length; i++) {
			    mapApp.currMarkers[i].setMap(null);
			  }
		},

		removeInfoWindows: function(){
			var closeBtn = $('.gm-style-iw + div');
			closeBtn.trigger('click');
		},

		mapRecenter: function(latlng,offsetx,offsety) {
			var point1 = map.getProjection().fromLatLngToPoint(
				(latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
			);
			var point2 = new google.maps.Point(
				( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
				( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
			);  
			map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
				point1.x - point2.x,
				point1.y + point2.y
			)));
		}
	} // end mapApp

})(jQuery);

google.maps.event.addDomListener(window, 'load', mapApp.init);

/* **********************  End Google Maps Code ***************************** */ 