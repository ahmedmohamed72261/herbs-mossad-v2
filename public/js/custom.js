$(document).ready(function(){

	$('.slider-div').owlCarousel({
	   loop: true,
	   margin:0,
	   autoplay:true,
	   nav:false,
	   dots:true,
	   responsive: {
		   0: {
			   items:1
		   },
		   600: {
			   items:1
		   },
		   667: {
			 items:1
		   },
		   1000: {
			   items:1
		   },
		   1200: {
			items:1
		   }
	   }
	})

	$('.profile-slider01').owlCarousel({
		loop: true,
		margin:30,
		autoplay:true,
		nav:false,
		dots:true,
		responsive: {
			0: {
				items:1
			},
			600: {
				items:1
			},
			667: {
			  items:2
			},
			768: {
				items:4
			},
			1000: {
				items:5
			},
			1200: {
			 items:6
			}
		}
	 })

	$('.revides-slider').owlCarousel({
		loop: true,
		margin:30,
		autoplay:true,
		nav:false,
		dots:true,
		responsive: {
			0: {
				items:1
			},
			600: {
				items:1
			},
			768: {
			  items:2
			},
			1000: {
				items:3
			},
			1200: {
			 items:3
			}
		}
	 })


	 $('.clients-slider').owlCarousel({
		loop: true,
		margin:40,
		autoplay:true,
		nav:false,
		dots:true,
		responsive: {
			0: {
				items:1
			},
			600: {
				items:1
			},
			667: {
			  items:2
			},
			1000: {
				items:3
			},
			1200: {
			 items:6
			}
		}
	 })


	 $('.comon-slider01').owlCarousel({
		loop: true,
		margin:40,
		autoplay:true,
		nav:false,
		dots:true,
		responsive: {
			0: {
				items:1
			},
			600: {
				items:1
			},
			667: {
			  items:2
			},
			1000: {
				items:3
			},
			1200: {
			 items:4
			}
		}
	 })

	 

	 


});

$(document).ready(function() {
    window.addEventListener('load', async () => {
      let video = document.querySelector('video[muted][autoplay]');
      try {
        await video.play();
      } catch (err) {
        video.controls = true;
      }
});
});

$(document).ready(function() {
    $( window ).scroll(function() {
          var height = $(window).scrollTop();
          if(height >= 100) {
              $('header').addClass('fixed-menu');
          } else {
              $('header').removeClass('fixed-menu');
          }
      });
  });

  



  // products list grid js
$(document).ready(function() {
	$('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
	$('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
	$('#list').click(function(event){event.preventDefault();$('#products .item').removeClass('grid-group-item');});
  });
  
  $(document).ready(function(){
  $('.listed-bn ul li a').click(function(){
	$('.listed-bn li a').removeClass("active");
	$(this).addClass("active");
  });
});


  //-----JS for Price Range slider-----

  function getVals(){
    // Get slider values
    let parent = this.parentNode;
    let slides = parent.getElementsByTagName("input");
      let slide1 = parseFloat( slides[0].value );
      let slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){ let tmp = slide2; slide2 = slide1; slide1 = tmp; }
    
    let displayElement = parent.getElementsByClassName("rangeValues")[0];
        displayElement.innerHTML = "$" + slide1 + " - $" + slide2;
  }
  
  window.onload = function(){
    // Initialize Sliders
    let sliderSections = document.getElementsByClassName("range-slider");
        for( let x = 0; x < sliderSections.length; x++ ){
          let sliders = sliderSections[x].getElementsByTagName("input");
          for( let y = 0; y < sliders.length; y++ ){
            if( sliders[y].type ==="range" ){
              sliders[y].oninput = getVals;
              // Manually trigger event first time to display values
              sliders[y].oninput();
            }
          }
        }
  }



// product js

$(document).ready(function(){

	var thumbs = $('.img-selection').find('img');
	
	thumbs.click(function(){
	  var src = $(this).attr('src');
	  var dp = $('.display-img');
	  var img = $('.zoom');
	  dp.attr('src', src);
	  img.attr('src', src);
	});
	
	$(".img-thumbnail").click(function(){
	  $('.img-thumbnail').removeClass('selected');
	  $(this).addClass('selected');
	});
	
	var zoom = $('.big-img').find('img').attr('src');
	$('.big-img').append('<img class="zoom" src="'+zoom+'">');
	$('.big-img').mouseenter(function(){
	  $(this).mousemove(function(event){
		var offset = $(this).offset();
		var left = event.pageX - offset.left;
		var top = event.pageY - offset.top;
		
		$(this).find('.zoom').css({
		  width: '200%',
		  opacity: 1,
		  left: -left,
		  top: -top,
		});
	  });
	});
	
	$('.big-img').mouseleave(function(){
	  $(this).find('.zoom').css({
		width: '100%',
		opacity: 0,
		left: 0,
		top: 0,
	  });
	});
});


$(document).ready(function(){
	$("#customRadio1").click(function(){
	  $("#ac-2").hide();
	});
	$("#customRadio1").click(function(){
	  $("#ac-1").show();
	});
	 $("#customRadio2").click(function(){
	  $("#ac-1").hide();
	});
	$("#customRadio2").click(function(){
	  $("#ac-2").show();
	});

	$('.sub').click(function () {
		if ($(this).next().val() > 1) {
    	if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
		}
    });
	$('.add').click(function () {
		if ($(this).prev().val() < 10) {
    	$(this).prev().val(+$(this).prev().val() + 1);
		}
    });

});

$(document).ready(function () {
	var selector = '.sixe-menu-q li';
	
	  $(selector).on('click', function(){
		  $(selector).removeClass('active');
		  $(this).addClass('active');
	  });
});

// mixit up
$(document).ready(function() {
	var mixer = mixitup('.bd-part');
 });