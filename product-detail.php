<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Product">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu.php');

  // View thong tin
  if(!empty($_GET['name'])){
    $pageURL = safe($_GET['name']);
    $s = "SELECT * FROM ".PREFIX_NAME."product".SUPFIX_NAME." WHERE URL='$pageURL'";
    if($r = $dx->get_row($s)) {
      // Da ngon ngu
      if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
        $ss = "SELECT * FROM ".PREFIX_NAME."product_lg".SUPFIX_NAME."
               WHERE lgID='".$r->proID."' ".lw('AND');
        if($rr = $dx->get_row($ss)){
          foreach(['Ten','Tomtat','Mota','Note','Noteprice','TagTitle','TagDesc'] as $key) {
            $r->$key = $rr->$key;
          }
        }
      }
    }
  }
  if(empty($r->proID)) Page404();

  // Chi tiet san pham
  $prod = [
    'id'    => $r->proID,
    'name'  => stripslashes($r->Ten),
    'sku'   => stripslashes($r->SKU),
    'image'	=> ThumbImage($r->Anh,1200),
    'price' => format_money($r->Giaban,'đ',lg('Contact')),
    'promo' => format_money($r->GiaKM,'đ',0),
    'brief'	=> Html2Text($r->Tomtat,150),
    'desc'	=> stripslashes($r->Mota),
    'note'	=> stripslashes($r->Noteprice),
    'cate'  => preg_split("/[#,]/",$r->Danhmuc,-1,PREG_SPLIT_NO_EMPTY),
    'other' => preg_split("/[#,]/",$r->Lienquan,-1,PREG_SPLIT_NO_EMPTY)
  ];

  // Image tag for SEO
  if($r->Anh!='') {
    $prod['image'] = ThumbImage($r->Anh,960);
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

  // Danh sach hinh
	$slider = [];
	$list = preg_split("/[#,]/",$r->Slide,-1,PREG_SPLIT_NO_EMPTY);
	foreach($list as $i=>$img) {
		$slider[] = [
			'thumb' => ThumbImage($img,150,150),
      'large' => ThumbImage($img),
      'rias'	=> ThumbImage($img,'{width}'),
		];
  }
  if(count($slider)==0) {
    $slider[] = [
			'thumb' => ThumbImage($r->Anh,150,150),
      'large' => ThumbImage($r->Anh),
      'rias'	=> ThumbImage($r->Anh,'{width}'),
		];
  }
  $prod['slider'] = $slider;

  // Danh sach filter
  $s = "SELECT * FROM ".PREFIX_NAME."product_feature".SUPFIX_NAME." AS PF JOIN
                      ".PREFIX_NAME.'feature'.SUPFIX_NAME." AS FT
        ON PF.feaID=FT.feaID WHERE PF.proID='".$r->proID."' ORDER BY PF.Thutu";
  $list = [];
  if($rs = $dx->get_results($s)){
    foreach($rs as $r){
      // Da ngon ngu
      if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
        $ss = "SELECT * FROM ".PREFIX_NAME."feature_lg".SUPFIX_NAME."
               WHERE lgID='".$r->feaID."' ".lw('AND');
        if($rr = $dx->get_row($ss)) $r->Ten = $rr->Ten;
      }
      
      // Gia tri filter
      $ss = "SELECT * FROM ".PREFIX_NAME."product_feature_value".SUPFIX_NAME." AS PFV JOIN
                           ".PREFIX_NAME.'feature_item'.SUPFIX_NAME." AS FIT
             ON PFV.fitID=FIT.fitID WHERE PFV.pftID='".$r->pftID."' ORDER BY PFV.Thutu";
      $item = [];
      if($rrs = $dx->get_results($ss)){
        foreach($rrs as $rr){
          if(empty($rr->Giatri)) continue;

          // Da ngon ngu
          if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
            $ls = "SELECT * FROM ".PREFIX_NAME."feature_item_lg".SUPFIX_NAME."
                    WHERE lgID='".$rr->fitID."' ".lw('AND');
            if($lr = $dx->get_row($ls)) $rr->Giatri = $lr->Giatri;
          }

          $item[] = [
            'id'    => $rr->fitID,
            'value' => stripslashes($rr->Giatri),
            'mark'	=> isset($_GET['f'][$r->feaID]) && $_GET['f'][$r->feaID]==$rr->fitID
          ];
        }
        if(!isset($_GET['f'][$r->feaID]) || empty($_GET['f'][$r->feaID])) {
          $item[0]['mark'] = true;
          $_GET['f'][$r->feaID] = $item[0]['id'];
        }
      }

      // Thuoc tinh co gia
      $isprice = false;
      if(count($item)>0) {
        $fitID = $item[0]['id'];
        $isprice = CheckField($dx,PREFIX_NAME.'price_option'.SUPFIX_NAME,
          "feaID='".$r->feaID."' AND fitID='$fitID'"
        );
      }

      $list[] = [
        'id'    => $r->feaID,
        'name'  => stripslashes($r->Ten),
        'item'  => $item,
        'price' => $isprice
      ];
    }
  }
  $prod['feature'] = $list;
  //echo '<pre>'.print_r($prod,true).'</pre>';
  
  // Danh sach mau
  $prod['color'] = [];
  if(count($prod['cate'])>0) {
    $wh = '';
    foreach($prod['cate'] as $cid) {
      $wh .= ($wh==''?'':'OR')."(Danhmuc LIKE '%#$cid#%')";
    }
    $wh = ($wh==''?'':'WHERE').$wh;

    $s = "SELECT * FROM ".PREFIX_NAME."product_color".SUPFIX_NAME." $wh ORDER BY Thutu";
    //echo "SQL: $s<br>";
    $list = [];
    if($rs = $dx->get_results($s)){
      foreach($rs as $r){
        // Da ngon ngu
        $name = $r->Ten;
        if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
          $name = GetField($dx,PREFIX_NAME.'product_color_lg'.SUPFIX_NAME,"lgID='".$r->colorID."' ".lw('AND'),'Ten');
        }

        $list[] = [
          'id'    => $r->colorID,
          'name'  => stripslashes($name),
          'color' => $r->Mamau,
          'mark'	=> isset($_GET['clr']) && $_GET['clr']==$r->colorID
        ];
      }
      if(!isset($_GET['clr']) || empty($_GET['clr'])) {
        $list[0]['mark'] = true;
        $_GET['clr'] = $list[0]['id'];
      }
    }


    $prod['color'] = $list;

    if(isset($_POST['btn-add-cart'])){


        $listCart = [
          'id'    => $_POST['id'],
          'name'  => $_POST['name'],
          'amount' => $_POST['amount'],
          'icon' => $_POST['icon'],
          'price' => $_POST['price'],          
        ];

        
      $_SESSION['listCart'][] =  $listCart ;
  
      echo "<script>window.location.href='/san-pham/$pageURL';</script>";
    }

    // echo '<pre>'.print_r($_SESSION['listCart']).'</pre>';
  }
  ?>
  <section class="product">
    <div data-id="<?=$prod['id']?>" class="container .prod-item ">
      <div class="row">
      <div id="slider" class="col-md-4 col-12 vertical-slider ga-vertical-gallery">
          <section class="services-slider">
            <div class="main-container">
              <div class="slider slider-main">
                <? foreach($prod['slider'] as $no=>$slr){?>
                <div>
                  <img src="<?=$slr['large']?>" data-src="<?=$slr['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload">
                </div>
                <? }?>
              </div>
            </div>
            <div class="nav-container">
              <!-- <i class="material-icons next">expand_less</i> -->
              <div class="slider-nav">
                <? foreach($prod['slider'] as $no=>$slr){?>
                <div><img src="<?=$slr['thumb']?>"></div>
                <? }?>
              </div>
              <!-- <i class="material-icons prev">expand_more</i> -->
            </div>
          </section>
        </div>
        <div id="product"  class="col-md-5 col-12">
          <form method="post" action="" id="">
          <input type="hidden" name="id" value="<?=$prod['id']?>">
          <input type="hidden" name="name" value="<?=$prod['name']?>">
          <input type="hidden" name="icon" value="<?=$prod['slider'][0]['thumb']?>">          
          <input type="hidden" name="price" value="<?=$prod['price']?>">  
       
                  
          <h1><?=$prod['name']?></h1>
          <p id="price" class="product-price"><?=$prod['price']?></p>
          <!-- <p class="product-price"><?=lg('Contact')?></p> -->
          <div class="row content-product-detail">
            <div class="col-6"><?=lg('SKU')?></div>
            <div class="col-6"><?=$prod['sku']?></div>
            <? foreach($prod['feature'] as $featr){
              if(!$featr['price']){?>
            <div class="col-6"><?=$featr['name']?></div>
            <div class="col-6">
              <span><?=$featr['item'][0]['value']?></span>
              <input type="hidden" name="o[<?=$featr['id']?>]" value="<?=$featr['item'][0]['id']?>">
            </div>
            <? }
            }
            if(count($prod['color'])>0){?>
            <div class="col-6" style="display: none;"><?=lg('colorKL')?></div>
            <div class="col-6" style="display: none;">
            <input type="hidden" name="o[<?=$prod['color']?>"></input>
              <div id="pcolor">
                <? foreach($prod['color'] as $clr){?>
                <p data-id="<?=$clr['id']?>" class="product-color <?=$clr['mark']?'active':''?>" title="<?=$clr['name']?>" style="background:<?=$clr['color']?>">
                  <img src="img/hinh-color.png" alt="<?=$clr['color']?>">
                </p>
                <?}?>
                <input type="hidden" name="clr" value="<?=isset($_GET['clr'])?$_GET['clr']:0?>">
              </div>
              <!--select id="ftrColor" name="clr">
                <? foreach($prod['color'] as $clr){?>
                <option value="<?=$clr['id']?>" <?=$clr['mark']?'selected':''?>><?=$clr['name']?></option>
                <?}?>
              </select-->
            </div>
            <?
            }
            foreach($prod['feature'] as $filtr){
              if($filtr['price']){?>
            <div class="col-6"><?=$filtr['name']?></div>
            <div class="col-6">
              <? if(count($filtr['item'])>1){?>
              <select id="ftr<?=$filtr['id']?>" name="f[<?=$filtr['id']?>]" class="select2x">
                <? foreach($filtr['item'] as $itm){?>
                <option value="<?=$itm['id']?>" <?=$itm['mark']?'selected':''?>><?=$itm['value']?></option>
                <?}?>
              </select>
              <? }else{?>
              <span><?=$filtr['item'][0]['value']?></span>
              <input type="hidden" name="f[<?=$filtr['id']?>]" value="<?=$filtr['item'][0]['id']?>">
              <? }?>
            </div>
            <? }
            }?>
          </div>
          <div class="product-amount">
            <label for="name">Số lưọng</label>
               <div class="dec button-amount">-</div>
              <input type="text" name="amount" id="product-amount" value="1">
              <div class="inc  button-amount">+</div>
          </div>
          <div class="button-wrapper">
             <button name="btn-add-cart" type="submit" class="primary-btn button-add" >Thêm vào giỏ hàng</button>
             <button class="primary-btn" onclick="PlaceOrder()">Mua ngay</button>
             <!-- <button class="primary-btn" onclick="PlaceOrder()"><?=lg('Booking')?></button> -->
            </form>
          </div>
          <p class="note-product-detail">
            <?=$prod['note']?>
          </p>
        
        
        
          
        </div>
        <div class="col-md-3 disclaimer">
          <img src="img/voucher.jpg">
          <p class="red-badge">Tổng đài hỗ trợ (8:00 - 17:00)</p>
          <p>Hot line: <?=$web['hotline']?></p>
        </div>
      </div>
    </div>
  </section>
  <section class="product-brief">
    <div class="container compact">
      <p><?=$prod['desc']?></p>
    </div>
  </section>
  <?
    $wh = '';//lw();
    // $wh .= ($wh==''?'':'AND')."(Hot='1')";
    $wh .= ($wh==''?'':'AND')."(pgID='2')";
    $wh = ($wh==''?'':'WHERE').$wh;

    $pa = "SELECT * FROM ".PREFIX_NAME."pages".SUPFIX_NAME." $wh";
    // echo "$pa<br/>";
    $page = [];
    if($pas = $dx->get_results($pa)){
      foreach($pas as $pr){
        $page[] = [
          'name'		=> stripslashes($pr->Ten),
          'content' => stripslashes($pr->Noidung),
        ];
      }
    }
    if(count($page)>0) {
    ?>
    <section class="genesys-group-intro page-prodcut-detail">
      <div class="container">
        <? foreach($page as $a){?>      
          <?=$a['content']?>
        <?}?>
      </div>
    </section>
  <?
  }

  // San pham lien quan
  $wh = '';// lw();
  $wh .= ($wh==''?'':'AND')."(proID IN ('".join("','",$prod['other'])."'))";
  $wh .= ($wh==''?'':'AND')."(proID!='".$prod['id']."')";
  $wh .= ($wh==''?'':'AND')."(Active='1')";
  $wh = ($wh==''?'':'WHERE').$wh;

  $ps = "SELECT * FROM ".PREFIX_NAME."product".SUPFIX_NAME." $wh
         ORDER BY NgayCN DESC LIMIT 8";
  //echo "SQL: $ps";
  $list = [];
  if($ps = $dx->get_results($ps)){
    foreach($ps as $pr){
      $info = [
        'name'		=> CutString($pr->Ten,55),
        'image'		=> ThumbImage($pr->Anh,500),
        'thumb'		=> ThumbImage($pr->Anh,150),
        'rias'		=> ThumbImage($pr->Anh,'{width}'),
        'price'   => format_money($pr->Giaban,'đ',lg('Contact')),
        'promo'   => format_money($pr->GiaKM,'đ',0),
        'brief'		=> CutString($pr->Tomtat,150),
        'link'		=> URL_Rewrite('san-pham',$pr->URL)
      ];

      // Da ngon ngu
      if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
        $ss = "SELECT * FROM ".PREFIX_NAME."product_lg".SUPFIX_NAME."
               WHERE lgID='".$pr->proID."' ".lw('AND');
        if($rr = $dx->get_row($ss)){
          $info['name'] = stripslashes($rr->Ten);
          $info['brief'] = CutString($rr->Tomtat,150);
        }
      }

      $list[] = $info;
    }
  }
  if(count($list)>0) {
  ?>
  <section class="genesys-product-hot">
    <div class="container">
      <h2><?=lg('Maybe')?></h2>
      <div class="row">
        <? foreach($list as $p){?>
          <div class="col-md-3 col-6">
            <a href="<?=$p['link']?>">
              <div class="box-content-product">
                <div class="box-img-product">
                  <img src="<?=$p['thumb']?>" data-src="<?=$p['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload" alt="<?=$p['name']?>">
                </div>
                <h3 style="font-weight: 500;"><?=$p['name']?></h3>
                <p><? if($p['promo']!=0) {?>
                  <?=$p['promo']?> <small style="text-decoration:line-through"><?=$p['price']?></small>
                <? }else echo $p['price']?></p>
                <span><?=lg('SeeMore')?></span>
              </div>
            </a>
          </div>
        <?}?>
      </div>
    </div>
  </section>
  <?}?>

  <?
  // Bo suu tap
  $wh = lw();
	$wh .= ($wh==''?'':'AND')."(Active='1')";
	$wh = ($wh==''?'':'WHERE').$wh;
	
	// Danh sach bst
	$s = "SELECT * FROM ".PREFIX_NAME."collection".SUPFIX_NAME." $wh
		    ORDER BY Thutu,NgayCN DESC LIMIT 3";
	$list = [];
	if($rs = $dx->get_results($s)){
	  foreach($rs as $r){
      $list[] = [
        'name'		=> stripslashes($r->Ten),
        'image'		=> ThumbImage($r->Anh, 640),
        'brief'		=> CutString($r->Tomtat,150),
        'link'		=> URL_Rewrite('collection',$r->URL)
      ];
	  }
  }
  
  if(count($list)>0) {
	?>
  <section class="news-home" >
    <h2><?=lg('Collection')?></h2>
    <div class="row">
      <? foreach($list as $a){?>
        <div class="col-md-4 col-6">
          <a href="<?=$a['link']?>" title="<?=$a['name']?>">
            <div class="box-img-content-news">
              <img src="<?=$a['image']?>" alt="<?=$a['name']?>">
              <h3><?=$a['name']?></h3>
              <p><?=$a['brief']?></p>
            </div>
          </a>
        </div>
      <? } ?>
    </div>
  </section>
  <? }?>
  <?
  $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
        WHERE catID IN ('".join("','",$prod['cate'])."')";
  $list = [];
  if($rs = $dx->get_results($s)){
    foreach($rs as $r){
      $info = [
        'name'  => stripslashes($r->Ten),
        'link'  => URL_Rewrite($r->URL)
      ];
      
      // Da ngon ngu
      if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
        $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
               WHERE lgID='".$r->catID."' ".lw('AND');
        if($rr = $dx->get_row($ss)){
          $info['name'] = stripslashes($rr->Ten);
        }
      }

      $list[] = $info;
    }
  }
  ?>
  <section class="breadcrumb">
    <ul>
      <li>
        <a href="<?=URL_Rewrite('')?>"><?=lg('Home')?></a>
      </li>
      <? foreach($list as $n){?>
      <li class="decord">
        <a href="<?=$n['link']?>"><?=$n['name']?></a>
      </li>
      <?}?>
      <li class="decord">
        <span><?=$prod['name']?></span>
      </li>
    </ul>
  </section>

  <!-- <section class="genesys-contact-show-popup">
    <p><img src="img/icon-contact.png"></p>
    <p><?=lg('Contact')?></p>
  </section> -->
  <?
  
  // Popup san pham
  $wh = lw();
  $wh .= ($wh==''?'':'AND')."(Active='1')";
  $wh .= ($wh==''?'':'AND')."(Loai='1')";
  $wh = ($wh==''?'':'WHERE').$wh;
  
  $s = "SELECT * FROM ".PREFIX_NAME."popup".SUPFIX_NAME." $wh
        ORDER BY Thutu LIMIT 1";
        // echo "$s<br/>";
  $list = [];
  if($rs = $dx->get_results($s)){
    foreach($rs as $r){
      $list[] = [
        'name'		=> stripslashes($r->Ten),
        'image'		=> ThumbImage($r->Anh, 800),
        'imageMB'		=> ThumbImage($r->Anhmobi, 400),
        'content'		=> stripslashes($r->Mota),
        'thumb'		=> ThumbImage($r->Anhmobi, 400),
        'rias'		=> ThumbImage($r->Anhmobi, '{width}'),
        'link'		=> stripslashes($r->Link)
      ];
    }
  }
  
  if(count($list)>0) {?>
    <seciton class="genesys-popup-product" id="popupSend">
      <p class="close-popup">X</p>
      <div class="genesys-content-popup">
        <div class="container">
          <div class="form-content">
            <? foreach($list as $a){?>
              <h2><?=$a['name']?></h2>
              <?=$a['content']?>
              <img src="<?=$a['thumb']?>" data-src="<?=$a['rias']?>" data-widths="[480,640]" data-optimumx="1.6" data-sizes="auto" class="lazyload">
            <?}?>
            <p style="margin-top: 10px; text-align: center; font-size: 14px;"><?=lg('CTA')?></p>        
            <form id="frmContact" action="" method="post">
              <input type="text" name="name" required placeholder="<?=lg('Name')?>">
              <input type="text" name="tel" required placeholder="<?=lg('Phone')?>">
              <div class="action">
                <button class="primary-btn" onclick="return MakeContact('frmContact')"><?=lg('Subpop')?></button>
                <div class="secondary-btn" style="display:none"><?=lg('Sending request')?>....</div>
              </div>
            </form>
          </div>
          <ul>
            <li>
            <img src="img/i-fb.png" alt="">
              <a href="fb.com/genesys">
                 fb.com/genesys
              </a>
            </li>
            <li>
              <img src="img/i-zl.png" alt="">
              <a href="https://zalo.me/0938256545">
                 zalo.me/0938256545
              </a>
            </li>
            <li>
            <img src="img/i-hl.png" alt="">
              <a href="tel:0938256545">
                 0938 256 545
              </a>
            </li>
          </ul>
        </div>
      </div>
    </seciton>
  
  <?}?>
  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
  <style>
    .select2.select2-container.select2-container--default{
      width: 134px!important;
    }
    .select2-container--default.select2-selection--single{
      border: none!important;
    }
  </style>
  <script>


  myStorage = window.localStorage;

  // function AddToCart(ProID) {
  //   // Thong tin san pham
  //   let param = $opts.find(":input[value!='']")
  //   console.log(ProID);
  //   localStorage.setItem('cart', param);
  //   console.log(localStorage.getItem('cart'));
    
  //   // let url = "/request?" + param;
  //   // location.href = url;
  // }



  function ChangeLink(param) {
    /*
    let url = location.pathname+'?'+param;
    history.pushState($opts.serializeArray(), document.title, url);
    */
  }

  function PriceCalc() {
    let param = $opts.find(":input[value!='']").serialize();
    console.log('Options: '+param);

    // Goi ham tinh gia tren server
    $price.html('Đang tính giá ...');
    $.get('/process/price.php', param, function(total) {
      $price.html(total);

      // Change location
      ChangeLink(param);
    });
  }

  // Chon mau sac
  let $color = $('#pcolor');
  if($color.length>0) {
    $color.find('.product-color').click(function(){
      $color.find('input').val($(this).data('id'));
      $color.find('.product-color').removeClass('active');
      $(this).addClass('active');

      // Change location
      let param = $opts.find(":input[value!='']").serialize();
      ChangeLink(param);
    });
  }

  $opts.find('select,input').change(function(){
    PriceCalc();  // Change price & location
  });
  PriceCalc();


  // Yeu cau tu van
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
      err += "<?=lg('Bạn chưa nhập điện thoại!')?>\n";
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
      let param = $opts.find(":input[value!='']").serialize();
      frm.attr('action', "/contact?"+param);
      frm.submit();
    }
    
    return false;
  }

  //product_amount
  $(".button-amount").on("click", function() {

      var $button = $(this);
      var oldValue = $("#product-amount").val();

      if ($button.text() == "+") {
        var newVal = parseFloat(oldValue) + 1;
      } else {
      // Don't allow decrementing below zero
        if (oldValue > 0) {
          var newVal = parseFloat(oldValue) - 1;
        } else {
          newVal = 0;
        }
      }

      $("#product-amount").val(newVal);

      });
  </script>
</body>
</html>