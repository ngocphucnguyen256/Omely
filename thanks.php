<?
$tracking = false;

// Xu ly dat lich hen
if(!empty($_POST['name']) && !empty($_POST['tel'])){
  // Luu thong tin
  $prod = json_decode($_POST['data'],true);
  $rq = [
    'name'    => safe($_POST['name']),
    'tel'     => safe($_POST['tel']),
    'demand'  => safe($_POST['demand']),
    'note'    => safe($_POST['note']),
    'date'    => safe($_POST['date']),
    'time'    => safe($_POST['time']),
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

  if(count($rq['demand'])>0) {
    $desc .= '<strong>Nhu cầu:</strong><ul>';
    foreach($rq['demand'] as $dm) $desc .= '<li>'.$dm.'</li>';
    $desc .= '</ul>';
  }

  if($rq['note']!='') $desc .= '<strong>Ghi chú:</strong> '.nl2br($rq['note']).' <br>';
  if($rq['date']!='') $desc .= '<strong>Ngày hẹn:</strong> '.$rq['date'].' <br>';
  if($rq['time']!='') $desc .= '<strong>Giờ hẹn:</strong> '.$rq['time'].' <br>';
  //echo "Message: $desc<br>";

  // Them khach hang vao he thong
  $memID = 0; //AddCustomer( $rq['email'], $rq['name'], $rq['address'], $rq['tel']);

  // Luu yeu cau vao he thong
  $reqID = FirstID($dx,'reqID',PREFIX_NAME.'request'.SUPFIX_NAME);
  $s = "INSERT INTO ".PREFIX_NAME.'request'.SUPFIX_NAME."(`reqID`, `Name`, `Phone`,
              `Note`, `Form`, `Data`, `UpTime`, `proID`, `memID`) 
        VALUES('$reqID', '".$rq['name']."', '".$rq['tel']."', '".safeHTML($desc)."',
              'dathen', '".safe(json_encode($rq))."', NOW(), '".$prod['id']."', '$memID')";
  //echo "Query: $s<br>";
  if($dx->query($s)) {
    $tracking = true;

    // Gui email thong bao
    $subject = 'Thông tin đặt lịch hẹn của '.$rq['name'];
    $message = 'Thông tin đặt lịch hẹn từ '.MAIN_DOMAIN.'<br>
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
</head>
<body>
  <? include_once('_menu.php')?>

  <section class="page-thanks">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-12" >
          <img src="https://ductrimusic.vn/files/500x/41-vf30AaeynR.jpeg" alt="Đức Trí">
        </div>
        <div class="col-md-6 col-12">
          <h3>Trân trọng!</h3>
          <p>Cảm ơn quý khách đã tin tưởng và lựa chọn Đức Trí Music. Chúng tôi sẽ phản hồi lại trong thời gian gần nhất.</p>
          <div class="decord-kc"></div>
          <h4>Để nhận tư vấn ngay, xin vui lòng liên hệ:</h4>
          <p>Hotline: <?=$web['hotline']?></p>
          <p>Địa chỉ: <?=Html2Text($web['contact'])?></p>
          <p>
            <a href="https://www.facebook.com/ductrimusic" class="primary-btn">Liên hệ qua Fanpage</a>
          </p>
        </div>
      </div>
    </div>
  </section>

  <?
  include_once('_footer.php');

  if($tracking) {
    echo "<script>gtag('event', 'click', {'event_category':'post','non_interaction':true})</script>";
  }
  ?>
</body>
</html>