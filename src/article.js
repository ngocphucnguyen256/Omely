$('.slider-tab').slick({
  arrows: false,
  variableWidth: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  loop: false,
});

$('.tag-pagenews').each(function () {
  let $tag = $(this);

  $tag.find('.next').click(function () {
    $tag.find('.slider-tab').slick('slickNext');
  });
  $tag.find('.prev').click(function () {
    $tag.find('.slider-tab').slick('slickPrev');
  });

  $tag.find('.next').click(function () {
    $tag.find('.product-line').slick('slickNext');
  });
  $tag.find('.prev').click(function () {
    $tag.find('.product-line').slick('slickPrev');
  });
});

$('.product-line').slick({
  arrows: false,
  variableWidth: true,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 2,
});


//show alt img
$( '.genesys-content-blog' ).ready(function() {

  $('img').parent().addClass('image-container')
  // Find our gallery container, and the list of image containers within it:
  var imageContainers = $('.genesys-content-blog').find('.image-container');
  
  // Loop through the image containers:
  $.each(imageContainers, function (i) {
      
      // Find the image in each container:
      var image = $(imageContainers[i]).find('img')[0];
      
      // Create a span element - we'll use this to house our caption:
    var caption = document.createElement('span');
      
      // Stick the alt tag from the image we found above into the caption <span>:
      $(caption).html(image.alt);
      
      // Insert the caption <span> into the image container:
      $(imageContainers[i]).append(caption);
  });
  });

// Scroll Monitor
window.scrollr = require("scrollMonitor")

// Floating Tabs
var $floatbar = $('#floatbar nav'),
  $parent = $floatbar.parent();
$parent.height($parent.height());

// Floatbar watcher
var fbWatcher = scrollr.create($floatbar);
fbWatcher.lock();
fbWatcher.stateChange(function () {
  $floatbar.toggleClass('fixed', this.isAboveViewport)
});
if (fbWatcher.isAboveViewport) {
  $floatbar.addClass('fixed');
}

// Tab watcher
$floatbar.find('ul li a').each(function () {
  var tabbtn = $(this),
    tabid = tabbtn.attr('href'),
    fheight = $floatbar.parent().height(),
    tabWatcher = scrollr.create(tabid, {
      top: fheight + 20,
      bottom: -fheight
    });

  // Highlight when scroll
  tabWatcher.stateChange(function () {
    var tabli = tabbtn.parent();
    if (!tabWatcher.isInViewport) {
      tabli.removeClass('active');
    } else if (tabWatcher.isInViewport && tabWatcher.isAboveViewport) {
      tabli.addClass('active');

      // Slide to active tab
      let index = tabli.data("index");
      $floatbar.find('.slider-tab').slick('slickGoTo', index);
    } else {
      tabli.removeClass('active');
    }
  });
});

// Click to scroll
$floatbar.find('ul li a').click(function () {
  var tabid = $(this).attr('href'),
    fheight = $floatbar.parent().height(),
    top = $(tabid).offset().top - (fheight - 30);
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) window.scrollTo(0, top);
  else $("html,body").animate({ scrollTop: top }, 900);
  return false;
});
