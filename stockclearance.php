<?
$title = 'Sản phẩm';
$pageURL = 'stockclearance';
$catID = 0;

$s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME." WHERE URL='$pageURL'";
if($r = $dx->get_row($s)) {
  // Da ngon ngu
  if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
    $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
          WHERE lgID='".$r->catID."' ".lw('AND');
    if($rr = $dx->get_row($ss)){
      foreach(['Ten','Tomtat','Mota','Index','TagTitle','TagDesc'] as $key) {
        $r->$key = $rr->$key;
      }
    }
  }
}

if(empty($r->catID)) {
  $web['title'] = $title.' | '.$web['title'];
}
else {
  $catID = $r->catID;
  $md = $r->Vitri;

  $title = stripslashes($r->Ten);
  $image = ThumbImage($r->Anh,1200);
  $thumb = ThumbImage($r->Anh,300);
  $rias	 = ThumbImage($r->Anh,'{width}');
  $brief = stripslashes($r->Mota);
  $summary = stripslashes($r->Tomtat);

  // Image tag for SEO
  if($r->Anh!='') {
    $web['webimg'] = ThumbImage($r->Anh,450);
  }

  // Title tag for SEO
  $seot = stripslashes($r->TagTitle);
  if(empty($seot)) $seot =  $title.' | '.$web['title'];
  if(!empty($seot)) $web['title'] = $seot;

  // Description tag for SEO
  $seod = stripslashes($r->TagDesc);
  if(empty($seod)) $seod = Html2Text($r->Mota);
  if(!empty($seod)) $web['description'] = $seod;
}
?>
<!DOCTYPE html>
<html itemscope itemtype="https://schema.org/Product">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>STOCK CLEARANCE | genesys DIAMOND</title>
  <meta name="description" content="{$description}">
  <meta name="keywords" content="{$keywords}">
  <meta name="author" content="Trần Ngọc Sơn">
  <meta name="copyright" content="QsvProgram">
  <meta name="robots" content="index, follow">

  <!-- Schema.org markup for Google+ -->
  <meta itemprop="name" content="{$title}">
  <meta itemprop="description" content="{$description}">
  <meta itemprop="image" content="{$webimg}">

  <!-- Open Graph data -->
  <meta property="og:title" content="{$title}">
  <meta property="og:url" content="{$fblink}">
  <meta property="og:image" content="{$webimg}">
  <meta property="og:description" content="{$description}">
  <meta property="og:site_name" content="Genesys">
  <meta property="fb:app_id" content="530272413774430">

  <!-- Twitter Card data -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{$title}">
  <meta name="twitter:image" content="{$webimg}">
  <meta name="twitter:description" content="{$description}">
  <meta name="twitter:site" content="@qsvprogram">
  <meta name="twitter:creator" content="@qsvprogram">

  <!-- Styles -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Cuprum:wght@400;500;600&family=Rosario:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="dist/styles.css" rel="stylesheet">

  <!-- Favicons -->
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="{$shortcut}">
  <link rel="shortcut icon" href="{$shortcut}">
  <!-- Lazyload -->
  <script src="//cdn.jsdelivr.net/g/lazysizes(lazysizes.min.js+plugins/rias/ls.rias.min.js+plugins/optimumx/ls.optimumx.min.js)" async></script>
  <style>
  img[data-sizes="auto"] {
    display: block;
    width: 100%;
  }
  </style>
</head>
<body >
<?
  include_once('_menu.php');
  
  $wh = lw();
  // $wh .= ($wh==''?'':'AND')."(Hot='1')";
  $wh .= ($wh==''?'':'AND')."(pgID='3')";
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

  if(count($page)>0) {?>
  <section class="genesys-group-intro" style="margin-top: 0;">
      <? foreach($page as $a){?>      
      <?=$a['content']?>
      <?}?>

  </section>
  <?
  }?>
  <section class="genesys-engagement" style="margin-top: 0;">
    <div class="genesys-catalog-index" >
      <!-- <img src="<?=$thumb?>" data-src="<?=$rias?>" data-widths="[480,640,800,1280,1600,2560]" data-optimumx="1.6" data-sizes="auto" class="lazyload"> -->
      <img src="/files/banner-top-price-RK0vosflO8.png" alt="">
      <!-- <div class="content-box marg-top custom-css-engagement">
        <div class="container">
          <div class="row">
            <div class="<?=$md?>-lg-7 col-lg-5 col-12">
              <div class="genesys-box">
                <h2><?=$title?></h2>
                <p class="lm-text"><span><span><?=$summary?></span></p>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
  <?
  if(!empty($catID)) {
    // Danh mục con
    $catalog = [];
    $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
          WHERE chID='$catID' ORDER BY Thutu";
    if($rs = $dx->get_results($s)){
      foreach($rs as $r){
        $info = [
          'id'	  => $r->catID,
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

        $catalog[] = $info;
      }
    }
    //echo 'Catalog:<pre>'.print_r($catalog,true).'</pre>';


    // Danh sach filter
    if(count($catalog)==0) {
      $feature = [];
      $s = "SELECT * FROM ".PREFIX_NAME."feature".SUPFIX_NAME."
            WHERE Danhmuc LIKE '%#$catID#%' ORDER BY Ten";
      if($rs = $dx->get_results($s)){
        foreach($rs as $r){
          $ps = "SELECT DISTINCT fitID FROM ".PREFIX_NAME."product_feature_value".SUPFIX_NAME."
                 WHERE pftID IN (
                    SELECT pftID FROM ".PREFIX_NAME.'product'.SUPFIX_NAME." AS P JOIN 
                                      ".PREFIX_NAME.'product_feature'.SUPFIX_NAME." AS F
                    ON P.proID = F.proID
                    WHERE F.feaID='".$r->feaID."' AND P.Danhmuc LIKE '%#$catID#%'
                 )";
          $value = [];
          if($prs = $dx->get_results($ps)){
            foreach($prs as $pr) $value[] = $pr->fitID;
          }
          //echo 'Feature value:<pre>'.print_r($value,true).'</pre>';

          // Gia tri filter
          $ss = "SELECT * FROM ".PREFIX_NAME."feature_item".SUPFIX_NAME."
                 WHERE feaID='".$r->feaID."' AND fitID IN('".join("','",$value)."')";
          //echo "SQL: $ss<br>";
          $item = [];
          if($rrs = $dx->get_results($ss)){
            foreach($rrs as $rr){
              $item[] = [
                'id'    => $rr->fitID,
                'value' => stripslashes($rr->Giatri),
                'mark'	=> isset($_GET['f'][$r->feaID]) && $_GET['f'][$r->feaID]==$rr->fitID
              ];
            }
          }
          //echo 'Feature item:<pre>'.print_r($item,true).'</pre>';


          $feature[] = [
            'id'    => $r->feaID,
            'name'  => stripslashes($r->Ten),
            'item'  => $item,
            'mark'  => !isset($_GET['f'][$r->feaID]) || empty($_GET['f'][$r->feaID])
          ];
        }
      }

      // Muc gia
      $prices = [];
      $prices[] = [
        'id'	  => '',
        'name'	=> 'Tất cả giá',
        'mark'	=> !isset($_GET['pr']) || empty($_GET['pr'])
      ];

      $s = "SELECT * FROM ".PREFIX_NAME."price_range".SUPFIX_NAME."
            WHERE Danhmuc LIKE '%#$catID#%' ORDER BY Thutu";
      if($rs = $dx->get_results($s)){
        foreach($rs as $r){
          $pf = round($r->Giatu/1000000);
          $pt = round($r->Giaden/1000000);
          $id = "$pf|$pt";

          $prices[] = [
            'id'	  => $id,
            'name'  => stripslashes($r->Ten),
            'mark'	=> isset($_GET['pr']) && $_GET['pr']==$id
          ];
        }
      }
      //echo 'Price range:<pre>'.print_r($prices,true).'</pre>';
    }
    ?>
  <section class="filter-desktop ringmen" style="margin-top: 0;padding-top: 50px;">
    <div class="container">
      <p class="webcrum" style="padding-bottom: 20px;"><a href="/">Trang chủ</a> / <?=$title?></p>
      <? if(count($catalog)>0) {?>
      <section class="tag-catalog">
        <div class="tab-container">
          <ul class="slider">
            <? foreach($catalog as $c){?>
            <li><a href="<?=$c['link']?>"><?=$c['name']?></a></li>
            <?}?>
          </ul>
          <i class="material-icons prev" style="color:white;">chevron_left</i>
          <i class="material-icons next" style="color:white;">chevron_right</i>
        </div>
      </section>
      <? }else{?>
      <form id="frmFilter" action="<?=URL_Rewrite($pageURL)?>" method="get">
        <ul class="filter-select-section">
          <!-- <li>Lọc theo:</li> -->
          <li id="ftr0" class="select-active" style="display:none">Theo giá
            <span class="material-icons">arrow_drop_down</span>
            <div class="box-select-content">
              <div class="select-content">
                <? foreach($prices as $n=>$itm){?>
                <div>
                  <input id="pv<?=$n?>" name="pr" type="radio" value="<?=$itm['id']?>" <?=$itm['mark']?'checked':''?>>
                  <label for="pv<?=$n?>"><?=$itm['name']?></label>
                </div>
                <?}?>
              </div>
            </div>
          </li>
          <? foreach($feature as $filtr){?>
          <li id="ftr<?=$filtr['id']?>" class="select-active"><?=$filtr['name']?>
            <span class="material-icons">arrow_drop_down</span>
            <div class="box-select-content">
              <div class="select-content">
                <div>
                  <input id="fv<?=$filtr['id']?>" name="f[<?=$filtr['id']?>]" type="radio" value="" <?=$filtr['mark']?'checked':''?>>
                  <label for="fv<?=$filtr['id']?>">Tất cả</label>
                </div>
                <? foreach($filtr['item'] as $itm){?>
                <div>
                  <input id="fv<?=$filtr['id'].'i'.$itm['id']?>" name="f[<?=$filtr['id']?>]" type="radio" value="<?=$itm['id']?>" <?=$itm['mark']?'checked':''?>>
                  <label for="fv<?=$filtr['id'].'i'.$itm['id']?>"><?=$itm['value']?></label>
                </div>
                <?}?>
              </div>
            </div>
          </li>
          <? }?>
          <!--li><button type="submit" onclick="return LoadContent('#diamond')">Thực hiện</button></li-->
        </ul>
      </form>
      <? }?>
    </div>
  </section>
  <?
  }

  // Phan trang
  $rowsPerPage = 20;
  $curPage = isset($_GET['page'])?safe($_GET['page']):1;
  $offset = ($curPage - 1) * $rowsPerPage;


  $wh = '';//lw();

  // Danh muc ringmen
  $wh .= ($wh==''?'':'AND')."(Danhmuc LIKE '%#".STOCK."#%')";

  // Khoang gia
	if(!empty($_GET['pr'])) {
		$price = safe($_GET['pr']);
		list($pf,$pt) = explode('|',$price);
    
    if(!empty($pf)){	// Gia tu
      $pf *= 1000000;
			$wh .= ($wh==''?'':'AND')."(Giaban>='{$pf}')";
		}
    if(!empty($pt)){	// Gia den
      $pt *= 1000000;
			$wh .= ($wh==''?'':'AND')."(Giaban<='{$pt}')";
		}
  }

  // Xu ly filter
	if(!empty($_GET['f'])) {
    $filter = safe($_GET['f']);
    //echo 'Filter:<pre>'.print_r($filter,true).'</pre>';

    foreach($filter as $ftr=>$itm) {
      if(empty($ftr) || empty($itm)) continue;
      $wh .= ($wh==''?'':'AND')."(proID IN (SELECT F.proID
        FROM ".PREFIX_NAME.'product_feature'.SUPFIX_NAME." AS F JOIN 
             ".PREFIX_NAME.'product_feature_value'.SUPFIX_NAME." AS V
        ON F.pftID = V.pftID
        WHERE F.feaID='$ftr' AND V.fitID='$itm')
      )";
    }
  }

  $wh .= ($wh==''?'':'AND')."(Active='1')";
  $wh = ($wh==''?'':'WHERE').$wh;

  $ps = "SELECT * FROM ".PREFIX_NAME."product".SUPFIX_NAME." $wh
         ORDER BY SKU ASC LIMIT $offset, $rowsPerPage";
  //echo "SQL: $ps";
  $list = [];
  if($ps = $dx->get_results($ps)){
    foreach($ps as $pr){
      $list[] = [
        'name'		=> stripslashes($pr->Ten),
        'image'		=> ThumbImage($pr->Anh,500),
        'thumb'		=> ThumbImage($pr->Anh,150),
        'rias'		=> ThumbImage($pr->Anh,'{width}'),
        'price'   => format_money($pr->Giaban,'đ',lg("Contact")),
        'promo'   => format_money($pr->GiaKM,'đ',0),
        'brief'		=> Html2Text($pr->Tomtat,150),
        'link'		=> URL_Rewrite($pageURL,$pr->URL)
      ];
    }
  }
  ?>
  <section class="genesys-product-hot " style="margin-bottom: 80px;">
    <div id="diamond" class="container">
      <? if(count($list)>0) {?>
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
                <div class="product-seemore"><span><?=lg('SeeMore')?></span></div>
              </div>
            </a>
          </div>
        <?}?>
      </div>
      <?
      $query = http_build_query(['f'=>$_GET['f']], null, '&', PHP_QUERY_RFC3986);
	    if($query!='') $_SERVER['QUERY_STRING'] = $query;

      $numPages = NumOfPages($dx,PREFIX_NAME.'product'.SUPFIX_NAME,$wh,$rowsPerPage);
      $wview->Pagination($numPages,$curPage,$pageURL);
      ?>
      <?}else{?>
      <i>Sản phẩm đang cập nhật. Vui lòng liên hệ Hotline để được tư vấn chi tiết!</i>
      <?}?>
    </div>
  </section>
  <?
  include_once('_footer.php');
  
?>
  
  <section class="genesys-zalo-cta">
    <a href="https://zalo.me/0938256545">
      <img src="img/zalo-logo.png" alt="">
    </a>
  </section>
  <!-- jQuery -->
  <script src="//code.jquery.com/jquery-3.3.1.js"></script>
  <script>window.jQuery || document.write('<script src="ext/jquery/jquery.min.js"><\/script>')</script>

  <!-- Scripts -->
  <script src="dist/bundle.js"></script>
</body>
</html>