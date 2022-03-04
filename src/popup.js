// Khoi tao popup
var $signlog = $('#signlogin'),
  $lostpass = $('#lostpass'),
  $qsvpopup = $('#qsvpopup');
$signlog.modal({ show: false });
$lostpass.modal({ show: false });
$qsvpopup.modal({ show: false });


// Mo popup tu URL
function OpenPopup (url, param, name, id) {
  var method = 'post';
  if (typeof (param) == 'undefined') {
    method = 'get';
    param = {};
  }
  if (typeof (id) == 'undefined') id = 'qsvbody';

  ViewPopup(name);
  $.ajax({
    url: url,
    type: method,
    data: param,
    dataType: "html",
  }).done(function (data) {
    $('#' + id).html(data);
  }).fail(function (jqXHR, status) {
    $('#' + id).html("Request failed: " + status);
  });

  return false;
}

// Mo cua so popup
function ViewPopup (name) {
  if (typeof (name) == 'undefined') name = '';
  $('#qsvname').html(name);
  $('#qsvbody').html('<p class="loading"><i class="fas fa-spinner fa-pulse"></i> Đang xử lý thông tin ...</p>');

  $qsvpopup.modal('show');
  $signlog.modal('hide');
  $lostpass.modal('hide');
}

function ClosePopup () {
  $signlog.modal('hide');
  $lostpass.modal('hide');
  $qsvpopup.modal('hide');
}


// Yeu cau tu van
function SendRequest (id) {
  var frm = $('#' + id),
    ok = true, err = '';

  if (frm.find('*[name=name]').val() == "") {
    frm.find('*[name=name]').focus();
    ok = false;
    err += "Bạn chưa nhập họ tên!\n";
  }

  if (frm.find('*[name=tel]').val() == "") {
    frm.find('*[name=tel]').focus();
    ok = false;
    err += "Bạn chưa nhập số điện thoại!\n";
  }

  var email = frm.find('*[name=email]').val();
  if (email != '' && !ValidEmail(email)) {
    frm.find('*[name=email]').focus();
    ok = false;
    err += "Địa chỉ email không hợp lệ!\n";
  }

  if (err != '') {
    alert(err);
    return false;
  }

  if (ok) {
    var $btn = frm.find('button'),
      $proc = $btn.next();
    $btn.hide();
    $proc.show();

    $.ajax({
      type: frm.attr('method'),
      url: frm.attr('action'),
      data: frm.serialize(),
      dataType: 'json'
    }).done(function (data) {
      var msg = "Gửi yêu cầu thất bại. Vui lòng thử lại sau!";
      if (data.success) {
        msg = "Gửi yêu cầu thành công. Cám ơn bạn!";

        // Reset form
        frm[0].reset();
        ClosePopup();
      }
      alert(msg);
    }).always(function (data) {
      //console.log("Complete: ",data);
      $btn.show();
      $proc.hide();
    }).fail(function (xhr, status) {
      console.log("Request failed: ", status);
    });
  }

  return false;
}


$('a[rel="qsvpopup"]').click(function () {
  var url = $(this).attr('href'),
    name = $(this).html(),
    title = $(this).attr('title');
  if (title != null && title != '') name = title;
  OpenPopup(url, { a: 1 }, name);
  return false;
});


// Export object Popup
window.Popup = {
  Open: OpenPopup,
  View: ViewPopup,
  Close: ClosePopup,
  Request: SendRequest
}


$(".lp-voucher").ready(function() {
  $('.select2x').select2();
});

function MakeContact(id){
  var frm = $('#'+id),
      ok = true, err = '';

  if (frm.find('*[name=name]').val() == "") {
    frm.find('*[name=name]').focus();
    ok = false;
    err += "Bạn chưa nhập họ tên!\n";
  }

  if (frm.find('*[name=tel]').val() == "") {
    frm.find('*[name=tel]').focus();
    ok = false;
    err += "Bạn chưa nhập điện thoại!\n";
  }

  if (frm.find('*[name=note]').val() == "") {
    frm.find('*[name=note]').focus();
    ok = false;
    err += "Bạn chưa chọn Voucher!\n";
  }

  if (err != '') {
    alert(err);
    return false;
  }

  if(ok) {
    let $btn = frm.find('button');
    $btn.hide();
    $btn.next().show();

    // Thong tin san pham
    let param = $opts.find('select,input').serialize();
    frm.attr('action', "/lead");
    frm.submit();
  }
  
  return false;
}

$(".genesys-contact-show-popup").on("click", function () {
  $(".popup-goto-facebook").show();
  $(".popupNew").show();
});

// Xu ly popup
$(".close-popup-send").on("click", function () {
  $(".popup-goto-facebook").hide("300");
  $(".filter-mobile").hide("300");
});


$(".show-list-cata").on("click", function () {
  $(".filter-mobile-fil").show();
});

$(".show-filter-mobile").on("click", function () {
  $(".test-filter").show();
});


$(".close-popup").on("click", function () {
  $(".genesys-popup-product").hide();
  $(".popup-goto-facebook").hide();
  $(".popupNew").hide();
});

$(document).on("click", function (e) {
  if ((e.target.id === 'popupSend')) {
    $(".popup-goto-facebook").hide("300");
    $(".popupNew").hide();
  }
});

$(document).on("click", function (e) {
  if ((e.target.id === 'popup')) {
    $(".filter-mobile").hide("300");
  }
});

$(document).on("click", function (e) {
  if ((e.target.id === 'popupDM')) {
    $(".filter-mobile").hide("300");
  }
});


// var $modal = $('#popupSend');
// if ($modal.length > 0) {
//   setTimeout(function () { $modal.show() }, 30000);
// }
