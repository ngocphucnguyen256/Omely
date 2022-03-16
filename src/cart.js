// // Thong tin gio hang
// $('.cartinfo').click(function () {
//   var url = $(this).attr('href');
//   Popup.Open(url, { a: 1 }, 'Giỏ hàng');
//   return false;
// });

// // Cap nhat gio hang
// function UpdateCart (redirect) {
//   $('#redirect').val(redirect);
//   $('#frmCart').submit();
//   return false;
// }

// // Chi tiet gio hang
// function ViewCart (show) {
//   if (show == null) show = false;

//   $.ajax({
//     url: '/process/yourcart.php',
//     type: 'post',
//     data: {},
//     dataType: "json",
//   }).done(function (data) {
//     // So luong san pham
//     var cartno = $('.cart-number'),
//       size = data.size;
//     cartno.html(size);
//     if (size > 0) cartno.show();
//     else cartno.hide();

//     // Thong tin gio hang
//     if (show) {
//       var cart = $('.cartinfo').attr('href');
//       Popup.Open(cart, { a: 1 }, 'Giỏ hàng');
//     }
//   }).fail(function (jqXHR, status) {
//     console.log("Request failed: " + status);
//   });
// }
// ViewCart();

// // Export object Cart
// window.Cart = {
//   View: ViewCart,
//   Update: UpdateCart
// }

const bag =  document.querySelector('.cart');
const cart =  document.querySelector('.cart-hidden');
const closecartBtn = document.querySelector('.closecart');

window.onload = () =>{
  loadEventListeners();
}

function loadEventListeners(){
    bag.addEventListener('click', openCart);
    closecartBtn.addEventListener('click', closecart);
}

//Open cart
function openCart(){
    cart.classList.add('activo');
    console.log("open cart");
}
//Close Cart
function closecart() {
    cart.classList.remove('activo');
    console.log("close cart");

}
