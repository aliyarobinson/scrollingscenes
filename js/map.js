/* **********************  Google Maps Code ***************************** */

var map;
var filmsArr = [];
var currentFilmArr = [];
var markersArray = [
	{'title': 'Working Girl', 'lat':40.682330, 'lng': -74.035749},
	{'title': 'Wall Street', 'lat':40.706050, 'lng': -74.010563},
	{'title': 'Six Degrees of Separation', 'lat':40.771506, 'lng': -73.969042},
	{'title': 'Taxi Driver', 'lat':40.731999, 'lng': -73.988200},
];
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

function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.730885, -73.997383);
	var latlng_s1 = new google.maps.LatLng(40.682330346391097, -74.035749435424805);
	var mapOptions = {
	zoom: 13,
	scrollwheel: false,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer;
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	directionsDisplay.setMap(map);

	$(document).on('click', '.directions', function(){
		console.log('clicked for directions');
		var lat = $(this).attr('data-lat');
		var lng = $(this).attr('data-lng');
		calcRoute(lat, lng);
	});

	$(document).on('click', '.decades button', function(){
		var decade = $(this).attr('data-decade');
		console.log('clicked for decadeBtn: ', decade);
	});

	function getFilms(){
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
	   
	}
	getFilms();


	var marker;
	var infowindow;
	var contentString;

	for (marker in markersArray){

		var thisLat = markersArray[marker].lat;
		var thisLng = markersArray[marker].lng;
		var thisLoc = new google.maps.LatLng(thisLat, thisLng);

		contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">'+ markersArray[marker].title +'</h1>'+
		'<button class="directions" data-lat="'+ thisLat +'" data-lng="'+ thisLng +'">Get Directions</button>'
		'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		marker = new google.maps.Marker({
			position: thisLoc,
			map: map
		});

		

		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}

	
	function calculateAndDisplayRoute(directionsService, directionsDisplay) {
		directionsService.route({
			origin: document.getElementById('start').value,
			destination: latlng_s1,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
			  directionsDisplay.setDirections(response);
			} else {
			  window.alert('Directions request failed due to ' + status);
			}
		});
	}

	function calcRoute(lat, lng) {			    
		$this = $(this);
		if(navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);		
												
			//get and set movie location
			var lat = lat;
			var lng = lng;
			// var movieLoc = new google.maps.LatLng(40.682330, -74.035749);					
			var movieLoc = new google.maps.LatLng(40.730885, -73.997383);					
			
			var start = pos;
			var end = movieLoc;
			var request = {
				origin:start,
				destination: end,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

				  console.log('movieLoc: ', movieLoc);

			map.setCenter(pos);
			directionsService.route(request, function(response, status) {
			  if (status == google.maps.DirectionsStatus.OK) {
				  console.log('directions okay');
				directionsDisplay.setDirections(response);
			  }	else {
			  	console.log('dir not okay');
			  }			
			});
		  }, function() {
			handleNoGeolocation(true);
		  });
		} else {
		  // Browser doesn't support Geolocation
		  handleNoGeolocation(false);
		}
	}

	// Set Map Style
	map.setOptions({styles: styleDark}); 
}

google.maps.event.addDomListener(window, 'load', initialize);

/* **********************  End Google Maps Code ***************************** */ 