<?
$tracking = false;

// Xu ly dat lich hen
if(!empty($_POST['name']) && !empty($_POST['tel'])){
  // Thong tin san pham
  if(!empty($_GET['id'])){
    $id = safe($_GET['id']);
    $s = "SELECT * FROM ".PREFIX_NAME."product".SUPFIX_NAME." WHERE proID='$id'";
    $r = $dx->get_row($s);
  }
  if(empty($r->proID)) {} // ?????

  $prod = [
    'id'    => $r->proID,
    'name'  => stripslashes($r->Ten),
    'image'	=> ThumbImage($r->Anh,1200),
    'brief'	=> Html2Text($r->Tomtat,150),
    'price' => lg('Contact'),
    'promo' => 0
  ];

  // Thuoc tinh gia
  $featr = [];
  if(!empty($_GET['f'])) $featr = safe($_GET['f']);

  /*
  // Tinh gia san pham
  $wh = '';
  foreach($featr as $ftr=>$itm) {
    $wh .= ($wh==''?'':'AND')."(priID IN (
      SELECT priID FROM ".PREFIX_NAME.'price_option'.SUPFIX_NAME."
      WHERE feaID='$ftr' AND fitID='$itm')
    )";
  }

  $wh .= ($wh==''?'':'AND')."(proID='$id')";
  $wh = ($wh==''?'':'WHERE').$wh;

  $s = "SELECT Gia,GiaKM FROM ".PREFIX_NAME.'price'.SUPFIX_NAME." $wh";
  $rs = $dx->get_results($s);
  if($dx->num_rows==1) {
    $prod['price'] = format_money($rs[0]->Gia,'đ',lg('Contact'));
    $prod['promo'] = format_money($rs[0]->GiaKM,'đ',0);
  }
  */

  // Cac thuoc tinh
  $list = [];
  $list[] = [
    'name' => 'Mã sản phẩm',
    'value' => stripslashes($r->SKU)
  ];

  if(!empty($_GET['clr'])) {
    $clr = safe($_GET['clr']);
    $list[] = [
      'name' => 'Màu kim loại',
      'value' => GetField($dx,PREFIX_NAME.'product_color'.SUPFIX_NAME,"colorID='$clr'",'Ten')
    ];
  }

  $opts = safe($_GET['o']) + $featr;
  foreach($opts as $ftr=>$itm) {
    // Da ngon ngu
    if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
      $name = GetField($dx,PREFIX_NAME.'feature_lg'.SUPFIX_NAME,"lgID='$ftr'",'Ten');
      $value = GetField($dx,PREFIX_NAME.'feature_item_lg'.SUPFIX_NAME,"lgID='$itm'",'Giatri');
    }
    else {
      $name = GetField($dx,PREFIX_NAME.'feature'.SUPFIX_NAME,"feaID='$ftr'",'Ten');
      $value = GetField($dx,PREFIX_NAME.'feature_item'.SUPFIX_NAME,"fitID='$itm'",'Giatri');
    }

    $list[] = [
      'name' => stripslashes($name),
      'value' => stripslashes($value)
    ];
  }

  $list[] = [
    'name' => 'Giá ước tính',
    'value' => $prod['price']
  ];
  if($prod['promo']!=0) {
    $list[] = [
      'name' => 'Giá khuyến mãi',
      'value' => $prod['promo']
    ];
  }

  $prod['opts'] = $list;


  // Luu thong tin
  $rq = [
    'name'    => safe($_POST['name']),
    'tel'     => safe($_POST['tel']),
    'prod'    => $prod
  ];
  //echo "Request: <pre>".print_r($rq,true)."</pre>";

  // Noi dung
  $desc = '<strong>Sản phẩm:</strong> '.$prod['name'].'<br>';
  $desc .= '<ul>';
  foreach($prod['opts'] as $opt){
    $desc .= '<li>'.$opt['name'].': '.$opt['value'].'</li>';
  }
  $desc .= '</ul>';
  //echo "Message: $desc<br>";

  // Them khach hang vao he thong
  $memID = 0; //AddCustomer( $rq['email'], $rq['name'], $rq['address'], $rq['tel']);

  // Luu yeu cau vao he thong
  $reqID = FirstID($dx,'reqID',PREFIX_NAME.'request'.SUPFIX_NAME);
  $s = "INSERT INTO ".PREFIX_NAME.'request'.SUPFIX_NAME."(`reqID`, `Name`, `Phone`, 
              `Note`, `Form`, `Data`, `ApTime`, `UpTime`, `proID`, `memID`) 
        VALUES('$reqID', '".$rq['name']."', '".$rq['tel']."', '".safeHTML($desc)."',
               'yctuvan', '".safe(json_encode($rq))."', '".$rq['date']." ".$rq['time']."',
               NOW(), '".$prod['id']."', '$memID')";
  //echo "Query: $s<br>";
  if($dx->query($s)) {
    $tracking = true;

    // Gui email thong bao
    $subject = 'Yêu cầu tư vấn của '.$rq['name'];
    $message = 'Thông tin yêu cầu tư vấn từ '.MAIN_DOMAIN.'<br>
      - Họ tên: '.$rq['name'].'<br>
      - Điện thoại: '.$rq['tel'].'<br>
      - Gửi lúc: '.date('H:i:s d/m/Y').'<br>
      <hr>'.$desc;
    //echo "Msg: $message<br>";
    SendMail('', $subject, $message);
  }
}

// Trang cam on
$web['title'] = 'Cám ơn quý khách | '.$web['title'];
?>
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>

  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-162704093-4"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-162704093-4');
  </script>
</head>
<body>
  <? include_once('_menu.php')?>

  <section class="page-thanks">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-12">
          <img src="img/img-thanks.png" alt="Genesys">
        </div>
        <div class="col-md-6 col-12">
          <h3>Trân trọng!</h3>
          <p>Cảm ơn quý khách đã tin tưởng và lựa chọn Genesys. Chúng tôi sẽ phản hồi lại trong thời gian gần nhất.</p>
          <div class="decord-kc"></div>
          <h4>Để nhận tư vấn ngay, xin vui lòng liên hệ:</h4>
          <p>Hotline: <?=$web['hotline']?></p>
          <p>Địa chỉ: <?=Html2Text($web['contact'])?></p>
          <p>
            <a href="https://www.facebook.com/genesys" class="primary-btn"><?=lg('ContactFB')?></a>
          </p>
        </div>
      </div>
    </div>
  </section>

  <?
  include_once('_footer.php');

  if($tracking) {
    echo "<script>gtag('event', 'click', {'event_category':'post','non_interaction':true})</script>";
    echo "<script>gtag('event', 'click', {'event_category':'contactForm','non_interaction':true})</script>";
  }
  ?>
</body>
</html>