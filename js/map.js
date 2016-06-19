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
				  
				  filmsArr.push({'title':title, 'year': filmYear, 'lng': lng, 'lat': lat, 'borough':filmBorough});
				  // console.log('filmsArr: ', filmsArr);
				  
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

					var contentString = '<div><p class="infoItem">Title: '+film.title+'</p></div>';

	                var infowindow = new google.maps.InfoWindow({
						content: contentString
					});

					marker.addListener('click', function() {
						mapApp.removeInfoWindows();
						infowindow.open(map, marker);
					});

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