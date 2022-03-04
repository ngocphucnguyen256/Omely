<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu-blog.php');

  // View thong tin
  if(!empty($_GET['name'])){
    $pageURL = safe($_GET['name']);
    $s = "SELECT * FROM ".PREFIX_NAME."article".SUPFIX_NAME." WHERE URL='$pageURL'";
    $r = $dx->get_row($s);
  }
  if(empty($r->artID)) Page404();


  // Chi tiet tin
  $article = [
    'name' => stripslashes($r->Ten),
    'brief' => stripslashes($r->Tomtat),
    'content' => stripslashes($r->Chitiet),
    'date' => format_date($r->NgayCN),
    'other' => preg_split("/[#,]/",$r->Lienquan,-1,PREG_SPLIT_NO_EMPTY)
  ];

  // Auto resize images
  $article['content'] = OptimizeImage($article['content'],800);

  // Image tag for SEO
  if($r->Anh!='') {
    $article['image'] = ThumbImage($r->Anh,800);
    $web['webimg'] = ThumbImage($r->Anh,450);
  }

  // Title tag for SEO
  $seot = stripslashes($r->TagTitle);
  if(empty($seot)) $seot = $article['name'].' | '.$web['title'];
  if(!empty($seot)) $web['title'] = $seot;

  // Description tag for SEO
  $seod = stripslashes($r->TagDesc);
  if(empty($seod)) $seod = Html2Text($article['brief']);
  if(!empty($seod)) $web['description'] = $seod;
  ?>
  <section class="genesys-content-blog gene-blog-article">
    <div class="container compact">
      <h2><?=$article['name']?></h2>
      <p class="author"><span>  <?=lg('Date')?> <?=$article['date']?></span></p>
      <p><?=$article['brief']?></p>
      <p><?=$article['content']?></p>
    </div>
  </section>

  <?
  // Báo chí
  $wh = lw();
  $wh .= ($wh==''?'':'AND')."(artID IN ('".join("','",$article['other'])."'))";
  $wh .= ($wh==''?'':'AND')."(typeID='".TYPE_PRESS."')";
	$wh .= ($wh==''?'':'AND')."(Active='1')";
	$wh = ($wh==''?'':'WHERE').$wh;
	
	// Danh sach bai viet
	$s = "SELECT * FROM ".PREFIX_NAME."article".SUPFIX_NAME." $wh
		    ORDER BY NgayCN DESC LIMIT 4";
	$list = [];
	if($rs = $dx->get_results($s)){
	  foreach($rs as $r){
      $list[] = [
        'name'		=> stripslashes($r->Ten),
        'image'		=> ThumbImage($r->Anh,300),
        'thumb'		=> ThumbImage($r->Anh,150),
        'rias'		=> ThumbImage($r->Anh,'{width}'),
        'brief'		=> CutString($r->Tomtat,150),
        'link'		=> URL_Rewrite('kien-thuc',$r->URL),
        'date'		=> format_date($r->NgayCN)
      ];
	  }
  }
  
  if(count($list)>0) {
  ?>
    <section class="news-home gene-relate">
      <div class="container compact">
        <h2><?=lg('Maybe')?></h2>
        <div class="row page-content-news">
          <? foreach($list as $a){?>
            <div class="col-md-4 col-6">
              <a href="<?=$a['link']?>" title="<?=$a['name']?>">
                <div class="box-img-content-news">
                  <img src="<?=$a['thumb']?>" data-src="<?=$a['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload" alt="<?=$a['name']?>">
                  <h3><?=$a['name']?></h3>
                  <!-- <p><?=$a['brief']?></p> -->
                </div>
              </a>
            </div>
          <? } ?>
        </div>
      </div>
    </section>
  <? }?>
  
  <?
    $s = "SELECT * FROM ".PREFIX_NAME."article".SUPFIX_NAME." WHERE artID='$r->artID'";
    // echo "$s";
    $list = [];
    if($rs = $dx->get_results($s)){
      foreach($rs as $r){
        $list[] = [
          'name'		=> stripslashes($r->Ten),
        ];
      }
    }
  ?>
  <section class="breadcrumb gene-blog">
    <ul>
      <li>
        <a href="<?=URL_Rewrite('')?>"><?=lg('Home')?></a>
      <li class="decord">
      <? foreach($list as $n){?>
        <span><?=$n['name']?></span>
      <?}?>
      </li>
    </ul>
  </section>

  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
</body>
</html>