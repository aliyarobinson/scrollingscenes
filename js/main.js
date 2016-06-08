/*!
* Project - Object Info
*/

  var city = (function ($) {
    // Variables 
    // -------------------------------------------------------------------
   
    
    
    // Init 
    // -------------------------------------------------------------------
    var init = function () {
      	  
	  $('.overlayContent').on('click','.visClose', function(e){$('.overlayContent').fadeOut(500);});
		 $('.navigation ul li').on('click','.soon', function(e){e.preventDefault()});
		 $('.navigation ul li').on('mouseover','.soon', 
		 	function(e){
		 		soonContent = $(this).attr('data-name');
		 		$(this).html('coming soon'); 
		 		console.log('hover over');
		 		console.log('soonContent - over: '+soonContent);
			 });

		  $('.navigation ul li').on('mouseout','.soon', 
		 	function(e){
		 		console.log('hover out');
		 		console.log('soonContent - out: '+soonContent);
			 	$(this).html(soonContent);  
			 });
		
    /* **********************  End Overlay Code ***************************** */ 
	
			    
    };
    
    // FUNCTIONS
    // ===================================================================
    
    // Public Functions
    // -------------------------------------------------------------------

    // Private Functions
    // -------------------------------------------------------------------
    $(window).resize(function() {
		  if ($(window).width() >= 768){
			return;
		  }
			$('.mToggle, .mToggleItem').hover(
			function(){$('.mToggleItem').show();},
			function(){$('.mToggleItem').hide();});		  
		});
 
    // Return
    // -------------------------------------------------------------------
    return {
      init              : init	  
    };
  })(jQuery);


$(document).ready(function () {    city.init();    });



/* **********************  Google Maps Code ***************************** */

	      var directionDisplay;
		  var directionsService = new google.maps.DirectionsService();
		  var map;
		  var currentFilmArr = [];
          var markersArray = [];
          var geocoder;
          var infowindow = new google.maps.InfoWindow();
          var marker;  

      function initialize() {
          geocoder = new google.maps.Geocoder();
		  directionsDisplay = new google.maps.DirectionsRenderer();
          var latlng = new google.maps.LatLng(40.730885, -73.997383);
		  
          //var myloc = new google.maps.LatLng(41.850033, -87.6500523);
		  var mylocAddr = 'brooklyn, ny';
          // var latlng = new google.maps.LatLng(-34.397, 150.644);
          var mapOptions = {
            zoom: 13,
            scrollwheel: false,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var soonContent = "";

          map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
		  //moreInfoBtn = $('.imbdInfo');
		  directionsDisplay.setMap(map);
		 // google.maps.event.addDomListener(moreInfoBtn, 'click', showAlert);
			
        var filmInfo = [];
		function getFilmInfo(){
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
				  $('<span></span>').html('<a href="#" data-lng="'+lng+'" data-lat="'+lat+'" data-title="'+title+'" data-borough="'+filmBorough+'" data-year="'+filmYear+'">' +title+ '</a>').appendTo('.filmNames');			  
				  /*if( filmBorough == "Manhattan" || filmBorough == "manhattan"){				                  
					$('<span></span>').html('<a href="#" data-lng="'+lng+'" data-lat="'+lat+'" data-title="'+title+'" data-borough="'+filmBorough+'" data-year="'+filmYear+'">' +title+ '</a>').appendTo('.filmNames.manhattan');
				  }else if( filmBorough == "Brooklyn" || filmBorough == "brooklyn"){				                  
					$('<span></span>').html('<a href="#" data-lng="'+lng+'" data-lat="'+lat+'" data-title="'+title+'" data-borough="'+filmBorough+'" data-year="'+filmYear+'">' +title+ '</a>').appendTo('.filmNames.brooklyn');
				  }*/
				  
				});
			  },
			  error : function(){console.log('error in parsing omdb info.');}	  
			});// End Get Films.xml
		   
		}
		getFilmInfo();
		
		$('.filmNames span a').live("click", parseLink); // end 'click' .filmNames span a
		
		function parseLink(){
		  thisLat = parseFloat($.trim($(this).attr('data-lat')));
          thisLng = parseFloat($.trim($(this).attr('data-lng')));
          thisYear = parseInt($(this).attr('data-year'));
          thisTitle = $(this).attr('data-title');
          thisBorough = $(this).attr('data-borough');
		  
		  // Get imdb
        $.ajax({
            type: "GET",
		  url: "http://www.omdbapi.com/?r=xml",
		  data:{'t':thisTitle},
          dataType: "xml",
          success: function(xmlIMDB, thisTitle) {
            console.log('success');

            // Get IMDB info
            $(xmlIMDB).find('movie').each(function(){
              var imdb_title = $(this).attr('title');
              var imdb_filmYear = $(this).attr('year');
			  var imdb_director = $(this).attr('director');
              var imdb_plot = $(this).attr('plot');
              var imdb_rating = $(this).attr('imdbRating');
			  var imdb_votes = $(this).attr('imdbVotes');
			  //var imdb_img = $(this).attr('poster');
			  var imdb_imgURI = $(this).attr('poster');
			  var imdb_img = unescape(encodeURIComponent(imdb_imgURI));
			  $('.overlayContent .title').html(imdb_title);
			  $('.overlayContent .dir .value').html(imdb_director);
			  $('.overlayContent .rating .value').html(imdb_rating);
			  $('.overlayContent .votes .value').html(imdb_votes);
			  $('.overlayContent .plot .value').html(imdb_plot);
			  $('.overlayContent .ltSide .imdbImg').attr('src', imdb_img);
            });
          }
        }); // End Get imdb


/*var omdbAPI = "http://www.omdbapi.com?callback=?";
  $.getJSON( omdbAPI, {
    r: "json",
    t:thisTitle
  })
  .done(function( data ) {
    $.each( data.items, function( i, item ) {
      //$( "<img/>" ).attr( "src", item.Poster ).appendTo( "#images" );
      var imdb_imgURI = item.Poster;
	  var imdb_img = unescape(encodeURIComponent(imdb_imgURI));
      $('.overlayContent .ltSide .imdbImg').attr('src', imdb_img);
      if ( i === 3 ) {
        return false;
      }
    });
  });*/ // End Get imdb
		  
		  
		  codeLatLng();
		}		
		
		

       
		
          function codeLatLng() {
			console.log('in codeLatLng');  
            var latlng = new google.maps.LatLng(thisLat, thisLng);
            geocoder.geocode({'latLng': latlng}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                  map.setZoom(17);
                  marker = new google.maps.Marker({
                      position: latlng,
                      map: map
                  });
				  map.setCenter(latlng);
				  //infowindow.setContent('<p class="infoItem">Title: '+thisTitle+'</p><p class="infoItem">Borough: '+thisBorough+'</p><p class="infoItem">Year: '+thisYear+'</p><button class="getDir mapInfoBtn" data-lat="'+thisLat+'" data-lng="'+thisLng+'">Get Directions</button><button class="imdbInfo mapInfoBtn">More Info</button><div class="overlayContent userLoc"><label for="start">Start</label><input type="text" name="start" id="start" value="brooklyn, ny"><button class="userLocation">Go</button></div>');
				  infowindow.setContent('<p class="infoItem">Title: '+thisTitle+'</p><button class="getDir mapInfoBtn" data-lat="'+thisLat+'" data-lng="'+thisLng+'">Get Directions</button><button class="imdbInfo mapInfoBtn">More Info</button><div class="overlayContent userLoc"><label for="start">Start</label><input type="text" name="start" id="start" value="brooklyn, ny"><button class="userLocation">Go</button></div>');
                  infowindow.open(map, marker);
                }
              } else {
                alert("Geocoder failed due to: " + status);
              }
            });
          }     	  
		  
		  
		   function calcRoute() {			    
				    //get and set user location - HTML5 geolocation
					$this = $(this);
					if(navigator.geolocation) {
					  navigator.geolocation.getCurrentPosition(function(position) {
						var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);		
															
						//get and set movie location
						var lat = $this.attr('data-lat');
						var lng = $this.attr('data-lng');
						var movieLoc = new google.maps.LatLng(lat, lng);					
						
						var start = pos;
						var end = movieLoc;
						var request = {
							origin:start,
							destination:end,
							travelMode: google.maps.DirectionsTravelMode.DRIVING
						};
						map.setCenter(pos);
						directionsService.route(request, function(response, status) {
						  if (status == google.maps.DirectionsStatus.OK) {
							  console.log('directions okay');
							directionsDisplay.setDirections(response);
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
				    
			  
			  
			 function handleNoGeolocation(errorFlag) {
						if (errorFlag) {
						  var content = 'Error: The Geolocation service failed.';
						} else {
						  var content = 'Error: Your browser doesn\'t support geolocation.';
						}
				
						var options = {
						  map: map,
						  position: new google.maps.LatLng(60, 105),
						  content: content
						};
				
						var infowindow = new google.maps.InfoWindow(options);
						map.setCenter(options.position);
					  }
			  
			  function showDir(start, end){
				  var request = {
					origin:start,
					destination:end,
					travelMode: google.maps.DirectionsTravelMode.DRIVING
				};
				directionsService.route(request, function(response, status) {
				  if (status == google.maps.DirectionsStatus.OK) {
					  console.log('directions okay');
					directionsDisplay.setDirections(response);
				  }
				});
			  }	
		  
		  
		  function getUserLoc(){
			  userLoc = null;
			  $('.overlayContent.userLoc').fadeIn(600);	
			  $('.userLocation').live("click", function(){
				  userLoc = $(this).siblings('input').attr('value');
				  console.log('go clicked');
				  console.log('location: '+ userLoc);
			  });
			  return userLoc;
			  		  
		  }
		
		  	$('.getDir').live("click", calcRoute); 		  
		  	$('.imdbInfo').live('click', function(){
				$('.overlayContent.imdbContent').fadeIn(600);
			});
		
				
		
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
            ]

        // Set Map Style
        map.setOptions({styles: styleDark}); 
    }
	google.maps.event.addDomListener(window, 'load', initialize);
	
    /* **********************  End Google Maps Code ***************************** */ 