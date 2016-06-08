'use strict';

(function($){

	// Init ScrollMagic Controller
	var scrollMagicController = new ScrollMagic.Controller();

	function scrollToElem(elem) {
		 $('html,body').animate({                                                             
        		scrollTop: $(elem).offset().top
        }, 1000);
	}

	window.onpopstate = function(){
		console.log('hash pop');
		var thisScene = document.location.hash;
		console.log('hash pop - thisScene: ', thisScene);

		if (thisScene === ""){
			scrollToElem('.intro');
		} else {
			$('a[href="'+ thisScene +'"').trigger('click');
		}

	}	

	$(document).on("click", "a[href^='#']", function (e) {
		console.log('clicked nav');
		var id = $(this).attr("href");
		if ($(id).length > 0) {
			e.preventDefault();
			console.log('clicked real nav');

			scrollToElem(id);

			// if supported by the browser we can even update the URL.
			// if (window.history && window.history.pushState) {
			// 	history.pushState("", document.title, id);
			// }
		}
	});

	var tween = TweenMax.to('.scene1 .overlayContent', 0.8, {
	    opacity: 1,
	    right: 0
	});

	var tween2 = TweenMax.to('.scene2 .overlayContent', 0.8, {
	    opacity: 1,
	    right: 0
	});

	var tween3 = TweenMax.to('.scene3 .overlayContent', 0.8, {
	    opacity: 1,
	    right: 0
	});

	var tween4 = TweenMax.to('.scene4 .overlayContent', 0.8, {
	    opacity: 1,
	    right: 0
	});

	var scene = new ScrollMagic.Scene({
	    triggerElement: '.scene1',
	    duration: 300 /* How many pixels to scroll / animate */
	})
	.setTween(tween)
	.addTo(scrollMagicController);

	// Add debug indicators fixed on right side
	// scene.addIndicators();

	var scene2 = new ScrollMagic.Scene({
	    triggerElement: '.scene2',
	    duration: 300 /* How many pixels to scroll / animate */
	})
	.setTween(tween2)
	.addTo(scrollMagicController);

	// Add debug indicators fixed on right side
	// scene2.addIndicators();

	var scene3 = new ScrollMagic.Scene({
	    triggerElement: '.scene3',
	    duration: 300 /* How many pixels to scroll / animate */
	})
	.setTween(tween3)
	.addTo(scrollMagicController);

	// Add debug indicators fixed on right side
	// scene3.addIndicators();
		
	var scene4 = new ScrollMagic.Scene({
	    triggerElement: '.scene4',
	    duration: 300 /* How many pixels to scroll / animate */
	})
	.setTween(tween4)
	.addTo(scrollMagicController);

	// Add debug indicators fixed on right side
	// scene4.addIndicators();

})(jQuery);