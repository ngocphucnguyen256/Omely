// Plugins
//window.swal = require('sweetalert2');
//window.perfect = require('perfect-scrollbar');

// Validate email
window.ValidEmail = function (mail) {
  var pattern = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(mail);
}

/*
// Back to top
var $gotop = $('#gotop');
if ($(window).width() < 768) $gotop.hide();
else {
  $gotop.find('a').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
    return false;
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() >= 200) $gotop.fadeIn(200);
    else $gotop.fadeOut(200);
  });
}
*/

// Slick gallery
import 'slick-carousel';

// Slick center slider
$(".discover .slider").slick({
  arrows: true,
  infinite: true,
  centerMode: true,
  slidesToShow: 1,
  slidesToScroll: 3,
  centerPadding: '330px',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        centerPadding: '50px',
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        centerPadding: '5px',
        slidesToScroll: 1
      }
    }
  ]
});

// Slick center slider
$(".banner-sales-home .slider").slick({
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  centerMode: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToScroll: 1
      }
    }
  ]
});
