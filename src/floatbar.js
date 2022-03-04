// Mobile menu
$('#icon-sidebar').click(function (e) {
  e.stopPropagation();
  $(this).hide();
  $("#icon-stop").show();
  $(".navbar-right-down").addClass("show-mobile");
  $('.lean-overlay').addClass("lean-overlay-sh");
});

$('.lean-overlay,#icon-stop').click(function (e) {
  e.stopPropagation();
  $("#icon-sidebar").show();
  $("#icon-stop").hide();
  $(".navbar-right-down,.level_2").removeClass("show-mobile");
  $('.lean-overlay').removeClass("lean-overlay-sh");
});

$('.three-menu').on("click", function (e) {
  e.stopPropagation();
  $(this).find(" > .level_2").addClass("show-mobile");
});

$('.pre_menu_level2').click(function (e) {
  e.stopPropagation();
  $(this).parent().removeClass("show-mobile");
});
