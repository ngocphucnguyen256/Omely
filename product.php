<?
$title = 'Sản phẩm';
$pageURL = 'product';
$catID = 0;
$chID = 0;

// Danh muc san pham
if(!empty($_GET['name'])) {
  $pageURL = safe($_GET['name']);
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
  $coltet = stripslashes($r->colorCat);
  $chID = $r->chID;

  // Image tag for SEO
  if($r->Anh!='') {
    $web['webimg'] = ThumbImage($r->Anh,750);
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
<html itemscope itemtype="http://schema.org/Product">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <? include_once('_menu.php')?>

  <section class="banner-sildeshow gene-banner-product">
    <div class="box-content-banner <?=$coltet?>">
      <div class="container">
        <div class="row">
          <div class="<?=$md?>-lg-8 col-lg-4 col-12">
            <?=$summary?>
          </div>
        </div>
      </div>
    </div>
    <div class="genesys-banner-sildeshow" >
      <img src="<?=$thumb?>" data-src="<?=$rias?>" data-widths="[480,640,800,1280,1600,2560]" data-optimumx="1.6" data-sizes="auto" class="lazyload">
    </div>
    
  </section>



 <!-- ------------------------------------------------------work--------------------------------------------------------------------------------- -->

  <?
  if(!empty($catID)) {
    // Danh mục con
    $catalog = [];

    //danh muc ngang hang
    $samecatalog =[];

    //danh muc cha
    $parentcatalog =[];


    
    
    $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
          WHERE chID='$catID' ORDER BY Hot DESC";
    if($rs = $dx->get_results($s)){
      foreach($rs as $r){
        $info = [
          'id'	  => $r->catID,
          'name'  => stripslashes($r->Ten),
          'link'  => URL_Rewrite($r->URL),

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

    //lay danh muc ngang hang
    $ssame = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
    WHERE chID='$chID' ORDER BY Hot DESC";
    if($rss = $dx->get_results($ssame)){
    foreach($rss as $rr){
      $info2 = [
        'id'	  => $rr->catID,
        'name'  => stripslashes($rr->Ten),
        'link'  => URL_Rewrite($rr->URL),

      ];

      // Da ngon ngu
      if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
        $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
              WHERE lgID='".$rr->catID."' ".lw('AND');
        if($rr = $dx->get_row($ss)){
          $info2['name'] = stripslashes($rr->Ten);
        }
      }

      $samecatalog[] = $info2;
    }
    }

    //lay danh muc cha
    $sparent = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
    WHERE catID='$chID' ORDER BY Hot DESC";
    if($rsparent = $dx->get_results($sparent)){
    foreach($rsparent as $rrparent){
      $infoparent = [
        'name'  => stripslashes($rrparent->Ten),
      ];

      // Da ngon ngu
      if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
        $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
              WHERE lgID='".$rrparent->catID."' ".lw('AND');
        if($rrparent = $dx->get_row($ss)){
          $infoparent['name'] = stripslashes($rrparent->Ten);
        }
      }

      $parentcatalog[] = $infoparent;
    }
    }

    //hiển thị Lọc trên desktop
    $cata = [];
    $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
          WHERE chID='$catID' AND Hot='1' ORDER BY Thutu limit 4";
    if($rs = $dx->get_results($s)){
      foreach($rs as $r){
        $inf = [
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

        $cata[] = $inf;
      }
    }
    //echo 'Catalog:<pre>'.print_r($catalog,true).'</pre>';


    // Danh sach filter
    if(count($catalog)==0) {
      $feature = [];
      $s = "SELECT * FROM ".PREFIX_NAME.'feature'.SUPFIX_NAME."
            WHERE Danhmuc LIKE '%#$catID#%' ORDER BY Ten";
      if($rs = $dx->get_results($s)){
        foreach($rs as $r){
          // Da ngon ngu
          if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
            $ss = "SELECT * FROM ".PREFIX_NAME."feature_lg".SUPFIX_NAME."
                   WHERE lgID='".$r->feaID."' ".lw('AND');
            if($rr = $dx->get_row($ss)) $r->Ten = $rr->Ten;
          }

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
          $ss = "SELECT * FROM ".PREFIX_NAME.'feature_item'.SUPFIX_NAME."
                 WHERE feaID='".$r->feaID."' AND fitID IN('".join("','",$value)."')";
          //echo "SQL: $ss<br>";
          $item = [];
          if($rrs = $dx->get_results($ss)){
            foreach($rrs as $rr){
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

          // Da ngon ngu
          $name = $r->Ten;
          if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
            $name = GetField($dx,PREFIX_NAME.'price_range_lg'.SUPFIX_NAME,"lgID='".$r->praID."' ".lw('AND'),'Ten');
          }

          $prices[] = [
            'id'	  => $id,
            'name'  => stripslashes($name),
            'mark'	=> isset($_GET['pr']) && $_GET['pr']==$id
          ];
        }
      }
      //echo 'Price range:<pre>'.print_r($prices,true).'</pre>';
    }
    ?>



<!-- ------------------------------------------------------popup danh muc khi an xem them tren desktop--------------------------------------------------------------------------------- -->

<div id="popupDM" class="modal-request filter-mobile test-filter" style="z-index: 200;">
    <div class="container compact genesys-product-hot filter-desktop filterDK">
      <div class="close-popup-send">X</div>
        <div class="header-popup">
          <h3>BỘ LỌC SẢN PHẨM</h3>
        </div>
        <div class="content-filter">
          <h4 >
            <?=$title?>
          </h4>
          <? if(count($catalog)>0) {?>
          <ul class="sidebar-list">
            <? foreach($catalog as $c){?>
              <li style="padding-left: 0;"><a href="<?=$c['link']?>"><?=$c['name']?></a></li>
            <?}?>
          </ul>
          <? }else{?>
          <form id="frmFilter" action="<?=URL_Rewrite($pageURL)?>" method="get">
            <ul class="filter-select-section">
              <!-- <li>Lọc theo:</li> -->
              <li id="ftr0" class="select-active" >Theo giá
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
      </div>
    </div>
  </div>


  <section class="filter-desktop mt-4 d-none">
    <div class="container">
      <h3 stle="font-size: 20px;"><?=$title?></h3>
      <? if(count($catalog)>0) {?>
      <section class="tag-catalog">
        <div class="tab-container">
          <ul class="slider">
            <? foreach($catalog as $c){?>
            <li><a href="<?=$c['link']?>"><?=$c['name']?></a></li>
            <?}?>
          </ul>
          <i class="material-icons prev">chevron_left</i>
          <i class="material-icons next">chevron_right</i>
        </div>
      </section>
      <? }else{?>
      <form id="frmFilter" action="<?=URL_Rewrite($pageURL)?>" method="get">
        <ul class="filter-select-section">
          <!-- <li>Lọc theo:</li> -->
          <li id="ftr0" class="select-active" >Theo giá
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
      <button class="filter-btn primary-btn show-filter-mobile">
        Filter
      </button>
    </div>
  </section>

  
<!-- ------------------------------------------------------work--------------------------------------------------------------------------------- -->




<div id="popup" class="modal-request  filter-mobile filter-mobile-fil">
    <div class="container compact filterDK">
      <div class="close-popup-send">X</div>
        <div class="header-popup">
          <h3>DANH MỤC</h3>
        </div>
        <div class="content-filter">
          <!-- <h4>DANH MỤC</h4> -->
 
          <?
          // Danh muc quan trong
          $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                WHERE chID=0 AND loai='1' ORDER BY Thutu";
          $list = [];
          
          if($rs = $dx->get_results($s)){
            foreach($rs as $r){
              $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                WHERE chID='".$r->catID."'ORDER BY Thutu";
                $mega = [];
                if($rz = $dx->get_results($ss)){
                  foreach($rz as $z){
                    $mega[] = [
                      'name' => stripslashes($z->Ten),
                      'link'  => URL_Rewrite($z->URL),
                    ];
                  }
                }
              $info = [
                'name'		=> stripslashes($r->Ten),
                'link'		=> URL_Rewrite($r->URL),
                'mega'    => $mega,
              ];

              // Da ngon ngu
              if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
                $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
                      WHERE lgID='".$r->catID."' ".lw('AND');
                if($rr = $dx->get_row($ss)){
                  $info['name'] = stripslashes($rr->Ten);
                  $info['summary'] = CutString($rr->Tomtat,320);
                  $info['brief'] = CutString($rr->Mota,320);
                }
              }

              $list[] = $info;
            }
          }
          ?>

            <?
          // Danh muc chinh -> hien tat ca danh muc theo hang doc
           if($chID==0) {
             ?>

              <div class="col-md-3 side-bar d-block d-sm-none" >
                  <div class="wapper" id="sidebar">
                    <h3 style="text-transform: uppercase; color:#C79B52;"><?=$title?></h3>
                    <? if(count($cata)>0) {?>
                    <ul class="sub-side-bar-1">
                      <? foreach($cata as $c){?>
                        <li style="padding-left: 0;"><a href="<?=$c['link']?>"><?=$c['name']?></a></li>
                      <?}?>
                      <li>
                        <a class="show-filter-mobile">Xem thêm</a>
                      </li>
                    </ul>
                    <? }else{?>
                    <form id="frmFilter" action="<?=URL_Rewrite($pageURL)?>" method="get">
                      <ul class="filter-select-section">
                        <!-- <li>Lọc theo:</li> -->
                        <li id="ftr0" class="select-active" >Theo giá
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
                    <h3>DANH MỤC</h3>
                    <?
                    // Danh muc quan trong
                    $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                          WHERE chID=0 AND loai='1' ORDER BY Thutu limit 6";
                    $list = [];
                    
                    if($rs = $dx->get_results($s)){
                      foreach($rs as $r){
                        $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                          WHERE chID='".$r->catID."'ORDER BY Thutu";
                          $mega = [];
                          if($rz = $dx->get_results($ss)){
                            foreach($rz as $z){
                              $mega[] = [
                                'name' => stripslashes($z->Ten),
                                'link'  => URL_Rewrite($z->URL),
                              ];
                            }
                          }
                        $info = [
                          'name'		=> stripslashes($r->Ten),
                          'link'		=> URL_Rewrite($r->URL),
                          'mega'    => $mega,
                        ];

                        // Da ngon ngu
                        if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
                          $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
                                WHERE lgID='".$r->catID."' ".lw('AND');
                          if($rr = $dx->get_row($ss)){
                            $info['name'] = stripslashes($rr->Ten);
                            $info['summary'] = CutString($rr->Tomtat,320);
                            $info['brief'] = CutString($rr->Mota,320);
                          }
                        }

                        $list[] = $info;
                      }
                    }
                    ?>
                    <ul class="sidebar-list">
                    <?
                      foreach($list as $catalog){?>
                      <li>
                        <a href="<?=$catalog['link']?>"><?=$catalog['name']?></a>
                        <!-- removed 1-3-2022: subitem list -->
                      </li>
                    <?
                    }
                    ?>
                    </ul>
                  </div>
                </div>


            

          <?}
          // Danh muc con
           elseif(count($catalog)>0) {?>
            <ul class="sidebar-list">
  
              <li>
                <a href="<?=$catalog['link']?>"><?=$title?></a>
                <ul class="sub-fil-mb">
                  <? foreach($catalog as $m){?>
                    <li>
                      <a href="<?=$m['link']?>"><?=$m['name']?></a>
                    </li>
                  <?}?>
                </ul>
              </li>
            <?

            ?>
            </ul>
          <? }else{
            //khong co danh muc con thi hien thi danh muc ngang hang
            ?>
            
            <ul class="sidebar-list">
  
              <li>
                <p><?=$parentcatalog['name']?></p>
                <ul class="sub-fil-mb">
                  <? foreach($samecatalog as $m){?>

                    <? if($catID===$m['id']) {?>
                      <li style="background: #f47621;">
                      <a style="color:white;" href="<?=$m['link']?>"><?=$m['name']?></a>
                    </li>
          <? }else{?>
            <li>
                      <a href="<?=$m['link']?>"><?=$m['name']?></a>
                    </li>
          <? }?>
                   
                  <?}?>
                </ul>
              </li>
            <?

            ?>
            </ul>
          <? }?>

         
          <!-- <h4>HÃNG PIANO</h4>
          <?
          // Danh muc quan trong
          $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                WHERE chID=0 AND loai='2' ORDER BY Thutu";
          $list = [];
          
          if($rs = $dx->get_results($s)){
            foreach($rs as $r){
              $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                WHERE chID='".$r->catID."'ORDER BY Thutu";
                $mega = [];
                if($rz = $dx->get_results($ss)){
                  foreach($rz as $z){
                    $mega[] = [
                      'name' => stripslashes($z->Ten),
                      'link'  => URL_Rewrite($z->URL),
                    ];
                  }
                }
              $info = [
                'name'		=> stripslashes($r->Ten),
                'link'		=> URL_Rewrite($r->URL),
                'mega'    => $mega,
              ];

              // Da ngon ngu
              if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
                $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
                      WHERE lgID='".$r->catID."' ".lw('AND');
                if($rr = $dx->get_row($ss)){
                  $info['name'] = stripslashes($rr->Ten);
                  $info['summary'] = CutString($rr->Tomtat,320);
                  $info['brief'] = CutString($rr->Mota,320);
                }
              }

              $list[] = $info;
            }
          }
          ?>
          <ul class="sidebar-list">
          <?
            foreach($list as $catalog){?>
            <li>
              <a href="<?=$catalog['link']?>"><?=$catalog['name']?></a>
              <ul class="sub-fil-mb">
                <? foreach($catalog['mega'] as $m){?>
                  <li>
                    <a href="<?=$m['link']?>"><?=$m['name']?></a>
                  </li>
                <?}?>
              </ul>
            </li>
          <?
          }
          ?>
          </ul> -->
        </div>
      </div>
    </div>
  </div>
  <?
  }
  ?>

<!-- ------------------------------------------------------work--------------------------------------------------------------------------------- -->
  <section class="filter-btn d-block d-sm-none" style="margin-top: 60px;">
    <div class="container">
      <div class="row no-gutter">
        <div class="col-12">
          <!-- <h1 style="margin-bottom: 40px;font-size: 25px;text-align:center;text-transform: uppercase;"><?=$title?></h1> -->
        </div>
        
        <?
          // Danh muc chinh -> an nut loc
           if($chID==0) {?>
              <div class="col-12">
                <button class="primary-btn show-list-cata" style=''>Danh mục</button>
              </div>
        <?}else{?>
          <div class="col-6">
            <button class="primary-btn show-list-cata" style='background: #f7f7f7;color: #616161;'>Danh mục</button>
          </div>
          <div class="col-6">
            <button class="primary-btn show-filter-mobile ">Lọc</button>
          </div>
        <?}?>
      </div>
    </div>
  </section>
  

          <!--------------------- work-filter moved to top empty catID check  section 1-2-2022---------------------------- -->

  <section class="genesys-product-hot filter-desktop ">
    <div id="diamond" class="container">
      <div class="row">
          <div class="col-md-3 side-bar d-none d-sm-block" >
            <div class="wapper" id="sidebar">
              <h3 style="text-transform: uppercase; color:#C79B52;"><?=$title?></h3>
              <? if(count($cata)>0) {?>
              <ul class="sub-side-bar-1">
                <? foreach($cata as $c){?>
                  <li style="padding-left: 0;"><a href="<?=$c['link']?>"><?=$c['name']?></a></li>
                <?}?>
                <li>
                  <a class="show-filter-mobile">Xem thêm</a>
                </li>
              </ul>
              <? }else{?>
              <form id="frmFilter" action="<?=URL_Rewrite($pageURL)?>" method="get">
                <ul class="filter-select-section">
                  <!-- <li>Lọc theo:</li> -->
                  <li id="ftr0" class="select-active" >Theo giá
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
              <h3>DANH MỤC</h3>
              <?
              // Danh muc quan trong
              $s = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                    WHERE chID=0 AND loai='1' ORDER BY Thutu limit 6";
              $list = [];
              
              if($rs = $dx->get_results($s)){
                foreach($rs as $r){
                  $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog".SUPFIX_NAME."
                    WHERE chID='".$r->catID."'ORDER BY Thutu";
                    $mega = [];
                    if($rz = $dx->get_results($ss)){
                      foreach($rz as $z){
                        $mega[] = [
                          'name' => stripslashes($z->Ten),
                          'link'  => URL_Rewrite($z->URL),
                        ];
                      }
                    }
                  $info = [
                    'name'		=> stripslashes($r->Ten),
                    'link'		=> URL_Rewrite($r->URL),
                    'mega'    => $mega,
                  ];

                  // Da ngon ngu
                  if(MULTI_LANGUAGE && lc()!=DEFAULT_LANGUAGE){
                    $ss = "SELECT * FROM ".PREFIX_NAME."product_catalog_lg".SUPFIX_NAME."
                          WHERE lgID='".$r->catID."' ".lw('AND');
                    if($rr = $dx->get_row($ss)){
                      $info['name'] = stripslashes($rr->Ten);
                      $info['summary'] = CutString($rr->Tomtat,320);
                      $info['brief'] = CutString($rr->Mota,320);
                    }
                  }

                  $list[] = $info;
                }
              }
              ?>
              <ul class="sidebar-list">
              <?
                foreach($list as $catalog){?>
                <li>
                  <a href="<?=$catalog['link']?>"><?=$catalog['name']?></a>
                  <div class="side-mega">
                    <ul class="side-sub">
                      <? foreach($catalog['mega'] as $m){?>
                        <li>
                          <a href="<?=$m['link']?>"><?=$m['name']?></a>
                        </li>
                      <?}?>
                    </ul>
                  </div>
                </li>
              <?
              }
              ?>
              </ul>
            </div>
          </div>
          <?
            // Phan trang
            $rowsPerPage = 20;
            $curPage = isset($_GET['page'])?safe($_GET['page']):1;
            $offset = ($curPage - 1) * $rowsPerPage;


            $wh = '';//lw();

            // Tim san pham
            if(!empty($_GET['q'])) {
              $kw = safe($_GET['q']);
              $wh .= ($wh==''?'':'AND')."(
                  SKU='$kw' OR Ten LIKE '%$kw%' OR
                  Tomtat LIKE '%$kw%' OR Mota LIKE '%$kw%'
                )";
            }

            // Danh muc san pham
            if(!empty($_GET['ctl'])) $catID = safe($_GET['ctl']);
            if(!empty($catID)) {
              $wh .= ($wh==''?'':'AND')."(Danhmuc LIKE '%#$catID#%')";
            }
            // Khong phai ringmen
            $wh .= ($wh==''?'':'AND')."(Danhmuc NOT LIKE '%#".RINGMEN."#%')";

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
                  ORDER BY Status, SKU ASC LIMIT $offset, $rowsPerPage";
            //echo "SQL: $ps";
            $list = [];
            if($ps = $dx->get_results($ps)){
              foreach($ps as $pr){
                $info = [
                  'name'		=> stripslashes($pr->Ten),
                  'image'		=> ThumbImage($pr->Anh,500),
                  'thumb'		=> ThumbImage($pr->Anh,150),
                  'rias'		=> ThumbImage($pr->Anh,'{width}'),
                  'price'   => format_money($pr->Giaban,'đ',lg("Contact")),
                  'promo'   => format_money($pr->GiaKM,'đ',0),
                  'brief'		=> Html2Text($pr->Tomtat,150),
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
            ?>
          <div class="col-md-9">
            <!-- <div class="box-search">
              <form action="">
                <input name="q" type="search" value="<?=$_GET['q']?>" placeholder="Tìm sản phẩm" required> <i class="material-icons">search</i>
              </form>
            </div> -->

            <? if(count($list)>0) {?>
            <div class="row">
              <? foreach($list as $p){?>
                <div class="col-md-6 col-12">
                  <a href="<?=$p['link']?>">
                    <div class="box-content-product">
                      <div class="box-img-product">
                        <img src="<?=$p['thumb']?>" data-src="<?=$p['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload" alt="<?=$p['name']?>">
                      </div>
                      <h3><?=$p['name']?></h3>
                      <p><? if($p['promo']!=0) {?>
                        <?=$p['promo']?> <small style="text-decoration:line-through"><?=$p['price']?></small>
                      <? }else echo $p['price']?></p>
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
          <i>Đang cập nhật</i>
          <?}?>
        </div>
      </div>
    </div>
  </section>

  <section class="content-seo">
  <div class="container compact">
    <?=$brief?>
  </div>
  </section>

  <section class="breadcrumb">
    <ul>
      <li>
        <a href="<?=URL_Rewrite('')?>"><?=lg('Home')?></a>
      </li>
      <li class="decord">
        <span><?=$title?></span>
      </li>
    </ul>
  </section>



  <!-- removedfile- remove-28/2/2022  -->

  
  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
  <script>
  let $filtr = $('#frmFilter');
  $filtr.find('.select-active').each(function(){
    let left = $(this).offset().left-15;
    let $content = $(this).find('.select-content');
    $content.css('margin-left',left+'px');
  });

  function LoadContent(view) {
    let param = $filtr.find(":input[value!='']").serialize(),
        url = $filtr.attr('action')+(param ? '?'+param : '');
    console.log('URL: '+url);

    $(view).load(url+' '+view+'>*', function( resp, status, xhr ){
      console.log('Load product!', xhr);

      var rwurl = xhr.getResponseHeader('Rewrite-URL');
      console.log('Response URL:', rwurl);

      // Change location
      history.pushState($filtr.serializeArray(), document.title, rwurl);
    });
    return false;
  }

  $filtr.find('select,input').change(function(){
    LoadContent('#diamond');
  })
  $(document).ready(function(){
  var heL = $('header').height()+$(".bannerTop").height();
  $(window).scroll(function () {    
   if($(window).scrollTop() > 750) {

      $('#sidebar').css('position','fixed');
      $('#sidebar').css('top','20px'); 
   }
  
   else if ($(window).scrollTop() <= 750) {
      $('#sidebar').css('position','');
      $('#sidebar').css('top','');
   }  
      if ($('#sidebar').offset().top + $("#sidebar").height() > $(".breadcrumb").offset().top) {
          $('#sidebar').css('top',-($("#sidebar").offset().top + $("#sidebar").height() - $(".breadcrumb").offset().top));
      }
  });
});
  </script>
</body>
</html>