<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
  <link href="fonts/svn-gotham&uvfassassin.css" rel="stylesheet">
</head>
<body>
  <?
  // View thong tin
  if(!empty($_GET['name'])){
    $pageURL = safe($_GET['name']);
    $s = "SELECT * FROM ".PREFIX_NAME.'fullpage'.SUPFIX_NAME." WHERE URL='$pageURL'";
    $q = mysql_query($s);
    $fpg = mysql_fetch_assoc($q);
  }
  if(empty($fpg['fpgID'])) Page404();


  // Tieu de landing page
  $title = stripslashes($fpg["Tuade"]);

  // Image tag for SEO
  if($fpg['Anh']!='') {
    $web['webimg'] = ThumbImage($fpg['Anh'],450);
  }

  // Title tag for SEO
  $seot = stripslashes($fpg['TagTitle']);
  if(empty($seot)) $seot = $title.' | '.$web['title'];
  if(!empty($seot)) $web['title'] = $seot;

  // Description tag for SEO
  $seod = stripslashes($fpg['TagDesc']);
  if(empty($seod)) $seod = Html2Text($fpg['Tomtat']);
  if(!empty($seod)) $web['description'] = $seod;

  if($fpg['Header']==1) include_once('_menu.php');
  ?>
  <main><?=stripslashes($fpg['Noidung'])?></main>
  <?
  if($fpg['Footer']==1) include_once('_footer.php');
  else {
  ?>
  <!-- jQuery -->
  <script src="//code.jquery.com/jquery-3.3.1.js"></script>
  <script>window.jQuery || document.write('<script src="ext/jquery/jquery.min.js"><\/script>')</script>

  <!-- Scripts -->
  <script src="dist/bundle.js"></script>
  <? }?>
  <script>
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
  </script>
</body>
</html>