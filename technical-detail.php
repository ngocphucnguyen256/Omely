<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu.php');

  // View thong tin
  if(!empty($_GET['name2'])){
    $cateURL = safe($_GET['name2']);
    $s = "SELECT * FROM ".PREFIX_NAME."article_catalog".SUPFIX_NAME." WHERE URL='$cateURL'";
    $r = $dx->get_row($s);
  }
  if(empty($r->acatID)) Page404();

  $typeURL = safe($_GET['name1']);
  $acatID = $r->acatID;
  
  // Image tag for SEO
  if($r->Anh!='') {
    $web['webimg'] = ThumbImage($r->Anh,450);
  }

  // Title tag for SEO
  $seot = stripslashes($r->TagTitle);
  if(empty($seot)) $seot = stripslashes($r->Ten).' | '.$web['title'];
  if(!empty($seot)) $web['title'] = $seot;

  // Description tag for SEO
  $seod = stripslashes($r->TagDesc);
  if(!empty($seod)) $web['description'] = $seod;


  // Danh muc bai viet
  $wh = lw();
  $wh = ($wh==''?'':'WHERE').$wh;
 
	$pcs = "SELECT * FROM ".PREFIX_NAME."article_catalog".SUPFIX_NAME." $wh";
  $artype = [];
  if($rs = $dx->get_results($pcs)){
    foreach($rs as $r){
      $artype[] = [
        'name'		=> stripslashes($r->Ten),
        'link'		=> URL_Rewrite($typeURL,$r->URL),
        'checkLink'	=>  $_GET['name2'] === explode("/",URL_Rewrite($typeURL,$r->URL))[2] ? true : false
      ];
    }
  }
  if(count($artype)>0) {
  ?>
  <section class="tag-pagenews catalog-tag">
    <div class="container compact">
      <div class="tab-container">
        <ul class="slider-tab">
          <? foreach($artype as $a){?>
            <li class="<?=$a['checkLink'] === true ? 'active' : ''?>">
              <a href="<?=$a['link']?>"><?=$a['name']?></a>
            </li>
          <?}?>
        </ul>
        <i class="material-icons prev">chevron_left</i>
        <i class="material-icons next">chevron_right</i>
      </div>
    </div>
  </section>
  <?
  }
  
  // Danh sach bai viet
  $wh = lw();
  $wh .= ($wh==''?'':'AND')."(typeID='".TYPE_TECHNICAL."')";
  $wh .= ($wh==''?'':'AND')."(acatID='$acatID')";
  $wh .= ($wh==''?'':'AND')."(Active='1')";
  $wh = ($wh==''?'':'WHERE').$wh;
  
  $sc = "SELECT * FROM ".PREFIX_NAME."article".SUPFIX_NAME." $wh ORDER BY NgayCN DESC";
  // echo "$sc";    
  $list = [];
  if($rs = $dx->get_results($sc)){
    foreach($rs as $rr){
      // Auto resize images
      $content = stripslashes($rr->Chitiet);
      $content = OptimizeImage($content);

      $list[] = [
        'id'		  => $rr->artID,
        'name'		=> stripslashes($rr->Ten),
        'link'		=> URL_Rewrite($typeURL,$rr->URL),
        'date'		=> format_date($rr->NgayCN),
        'content'	=> $content
      ];
    }
  }
  
  if(count($list)>0) {
  ?>
    <section id="floatbar" class="tag-pagenews article-tag">
      <nav>
        <div class="container compact">
          <div class="tab-container">
            <ul class="slider-tab menu-tab-silde">
              <? foreach($list as $idx=>$a){?>
              <li data-index="<?=$idx?>">
                <a href="#art<?=$a['id']?>"><?=$a['name']?></a>
              </li>
              <?}?>
            </ul>
            <i class="material-icons prev">chevron_left</i>
            <i class="material-icons next">chevron_right</i>
          </div>
        </div>
      </nav>
    </section>
    <? foreach($list as $a){?>
      <section class="genesys-content-blog" id="art<?=$a['id']?>">
        <div class="container compact">
          <article>
            <div class="title">
              <!-- <a href="<?=URL_Rewrite($cateURL)?>"><h1><?=$cateName?></h1></a> -->
              <h2><?=$a['name']?></h2>
            </div>
            <p class="author"><span> <?=lg('Date')?> <?=$a['date']?></span></p>
            <div class="content"><?=$a['content']?></div>
          </article>
        </div>
      </section>
      <? }
    }?>
  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
</body>
</html>
