// Select2
import 'select2';

$('#product .select2x').select2({
  theme: 'material',
  minimumResultsForSearch: -1,
  allowClear: false,
  closeOnSelect: true,
  dropdownParent: '#product',
  language: 'vi'
});


// // Vertical gallery slider
// $('.slider-main').slick({
//   slidesToShow: 1,
//   arrows: false,
//   asNavFor: '.slider-nav',
//   vertical: true,
//   autoplay: false,
//   verticalSwiping: true,
//   centerMode: false
// });

// if ($(window).width() > 540) {
//   $('.slider-nav').slick({
//     slidesToShow: 5,
//     arrows: false,
//     asNavFor: '.slider-main',
//     vertical: true,
//     focusOnSelect: true,
//     verticalSwiping: false,
//     autoplay: false,
//     centerMode: false

//   });
// }
// else {
//   $('.slider-nav').slick(
//     {
//       slidesToShow: 4,
//       arrows: false,
//       asNavFor: '.slider-main',
//       vertical: true,
//       focusOnSelect: true,
//       verticalSwiping: false,
//       autoplay: false,
//       centerMode: false
//     });

// }

$('.slider-main').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.slider-nav'
});
if ($(window).width() > 540) {
  $('.slider-nav').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: '.slider-main',
    arrows: false,
    // dots: true,
    // centerMode: true,
    focusOnSelect: true
  });
}else {
  $('.slider-nav').slick({
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-main',
    dots: true,
    centerMode: true,
    focusOnSelect: true
  });
};