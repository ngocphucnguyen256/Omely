<?

$listItem=[];
if(!empty($_GET['id'])){
  $query  = explode('&', $_SERVER['QUERY_STRING']);
  $params = array();

  foreach( $query as $param )
  {
  
    if (strpos($param, '=') === false) $param += '=';

    list($name, $value) = explode('=', $param, 2);
    $params[urldecode($name)][] = urldecode($value);
  }
  $listItem=$params;
  

    
}
// echo '<pre>';print_r($listItem);echo '</pre>';

if(count($listItem['id'])!=count($listItem['amount'])){
  Page404();
}

$prodList=[];
// Thong tin san pham
if(count($listItem['id'])>0){
       for($i=0;$i<count($listItem['id']);$i++){
          $id=$listItem['id'][$i];
          $s = "SELECT * FROM ".PREFIX_NAME."product".SUPFIX_NAME." WHERE proID='$id'";
          $r = $dx->get_row($s);
          $prodList []= [
            'id'    => $r->proID,
            'name'  => stripslashes($r->Ten),
            'image'	=> ThumbImage($r->Anh,1200),
            'brief'	=> Html2Text($r->Tomtat,150),
            'price' => lg('Contact'),
            'promo' => 0,
            'amount' => $listItem['amount'][$i]
          ];
      }
          
       
    
}
  





// Image tag for SEO
if($r->Anh!='') {
  $prod['image'] = ThumbImage($r->Anh,800);
  $web['webimg'] = ThumbImage($r->Anh,450);
}

// Title tag for SEO
$seot = stripslashes($r->TagTitle);
if(empty($seot)) $seot = $prod['name'].' | '.$web['title'];
if(!empty($seot)) $web['title'] = $seot;

// Description tag for SEO
$seod = stripslashes($r->TagDesc);
if(empty($seod)) $seod = Html2Text($prod['brief']);
if(!empty($seod)) $web['description'] = $seod;

// Thuoc tinh gia
$featr = [];
if(!empty($_GET['f'])) $featr = safe($_GET['f']);


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
  $prod['price'] = format_money($rs[0]->Gia,'??',lg('Contact'));
  $prod['promo'] = format_money($rs[0]->GiaKM,'??',0);
}


// Cac thuoc tinh
$list = [];
$list[] = [
  'name' => 'M?? s???n ph???m',
  'value' => stripslashes($r->SKU)
];

if(!empty($_GET['clr'])) {
  $clr = safe($_GET['clr']);
  $list[] = [
    'name' => 'M??u kim lo???i',
    'value' => GetField($dx,PREFIX_NAME.'product_color'.SUPFIX_NAME,"colorID='$clr'",'Ten')
  ];
}


if(empty($_GET['o'])) $opts = $featr;
else $opts = safe($_GET['o']) + $featr;

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
  'name' => 'Gi?? ?????c t??nh',
  'value' => $prod['price']
];
if($prod['promo']!=0) {
  $list[] = [
    'name' => 'Gi?? khuy???n m??i',
    'value' => $prod['promo']
  ];
}

$prod['opts'] = $list;
//echo "Product: <pre>".print_r($prod,true)."</pre>";
?>
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Product">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu.php');
  ?>
  <section class="request-page">
    <div class="container compact">
      <h2>S???N PH???M B???N QUAN T??M</h2>
      <?foreach ($prodList as $p){?>
        <div class="row box-request-product">
          <div class="col-md-3 col-5"><img src="<?=$p['image']?>" alt="<?=$p['name']?>"></div>
          <div class="col-md-9 col-7">
            <h3><?=$p['name']?></h3>
            <div class="row">
              <div class="col-md-6"><?=$p['name']?></div>
              <div class="col-md-6">S??? l?????ng: <?=$p['amount']?></div>
            </div>
          </div>
        </div>
      <?}

      ?>
      <h2>Th??ng tin c???a b???n</h2>
      <form id="frmRequest" action="/lead" method="post">
        <input type="hidden" name="data" value='<?=json_encode($prodList)?>'>
        <div class="row filed-input">
          <div class="col-md-2 col-12">
            <p>H??? v?? t??n</p>
          </div>
          <div class="col-md-10 col-12">
            <input type="text" name="name" required placeholder="Vui l??ng nh???p h??? v?? t??n">
          </div>
        </div>
        <div class="row filed-input">
          <div class="col-md-2 col-12">
            <p>S??? ??i???n tho???i</p>
          </div>
          <div class="col-md-10 col-12">
            <input type="text" name="tel" required placeholder="Vui l??ng nh???p s??? ??i???n tho???i">
          </div>
        </div>
        <div class="row filed-input">
          <div class="col-md-2 col-12">
            <p>Email</p>
          </div>
          <div class="col-md-10 col-12">
            <input type="text" name="mail" required placeholder="Vui l??ng nh???p Email">
          </div>
        </div>
        <!-- <div class="row filed-input">
          <div class="col-12">
            <p>Nhu c???u ch???n trang s???c</p>
          </div>
          <div class="col-md-4 col-6 choose-ring">
            <label><input type="checkbox" name="demand[]" value="????nh h??n"> ????nh h??n</label>
          </div>
          <div class="col-md-4 col-6 choose-ring">
            <label><input type="checkbox" name="demand[]" value="C?????i"> C?????i</label>
          </div>
          <div class="col-md-4 col-6 choose-ring">
            <label><input type="checkbox" name="demand[]" value="K??? ni???m"> K??? ni???m</label>
          </div>
          <div class="col-md-4 col-6 choose-ring">
            <label><input type="checkbox" name="demand[]" value="Th???i trang"> Th???i trang</label>
          </div>
          <div class="col-md-4 col-6 choose-ring">
            <label><input type="checkbox" name="demand[]" value="L??m qu??"> L??m qu??</label>
          </div>
          <div class="col-md-4 col-6 choose-ring">
            <label><input type="checkbox" name="demand[]" value="Kh??c"> Kh??c</label>
          </div>
        </div> -->
        <div class="row filed-input">
          <div class="col-md-2 col-12">
            <p>Ghi ch??</p>
          </div>
          <div class="col-md-10 col-12">
            <input type="text" name="note">
          </div>
        </div>
        <div class="submit-form">
          <button class="primary-btn" onclick="return MakeDate('frmRequest')">G???I Y??U C???U</button>
          <div class="secondary-btn" style="display:none">??ang g???i y??u c???u ....</div>
        </div>
      </form>
    </div>
  </section>
  
  <section class="breadcrumb">
    <ul>
      <li>
        <a href="<?=URL_Rewrite('')?>">Trang ch???</a>
      </li>
      <li>
        <span>Y??u c???u t?? v???n</span>
      </li>
    </ul>
  </section>

  <? include_once('_footer.php')?>
  <script>
  function MakeDate(id){
    var frm = $('#'+id),
        ok = true, err = '';

    if (frm.find('*[name=name]').val() == "") {
      frm.find('*[name=name]').focus();
      ok = false;
      err += "B???n ch??a nh???p h??? t??n!\n";
    }

    if (frm.find('*[name=tel]').val() == "") {
      frm.find('*[name=tel]').focus();
      ok = false;
      err += "B???n ch??a nh???p ??i???n tho???i!\n";
    }

    if (err != '') {
      alert(err);
      return false;
    }

    if(ok) {
      let $btn = frm.find('button');
      $btn.hide();
      $btn.next().show();
      frm[0].submit():
    }
    
    return false;
  }




  </script>
</body>
</html>