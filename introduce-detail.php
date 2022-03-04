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
    $pageURL = safe($_GET['name2']);
    $s = "SELECT * FROM ".PREFIX_NAME."article".SUPFIX_NAME." WHERE URL='$pageURL'";
    $r = $dx->get_row($s);
  }
  if(empty($r->artID)) Page404();

  // Loai bai viet
  $cateURL = safe($_GET['name1']);
  $cateName = GetField($dx,PREFIX_NAME.'article_type'.SUPFIX_NAME,"URL='$cateURL'",'Ten');

  // Chi tiet
  $article = [
    'name' => stripslashes($r->Ten),
    'brief' => stripslashes($r->Tomtat),
    'content' => stripslashes($r->Chitiet),
    'date' => format_date($r->NgayCN)
  ];

  // Auto resize images
  $article['content'] = OptimizeImage($article['content'],800);

  // Image tag for SEO
  if($r->Anh!='') {
    $article['image'] = ThumbImage($r->Anh,800);
    $article['thumb']	= ThumbImage($r->Anh,360);
    $article['rias']	= ThumbImage($r->Anh,'{width}');
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
  <section class="page">
    <div class="container">
      <article>
        <div class="title">
          <a href="<?=URL_Rewrite($cateURL)?>"><h1><?=$cateName?></h1></a>
          <h2><?=$article['name']?></h2>
        </div>
        <? if(isset($article['image'])){?>
        <div class="photo">
          <img src="<?=$article['thumb']?>" data-src="<?=$article['rias']?>" data-widths="[480,640,800,1280,1600,2560]" data-optimumx="1.6" data-sizes="auto" class="lazyload" alt="<?=$article['name']?>">
        </div>
        <? }?>
        <div class="content"><?=$article['content']?></div>
      </article>
    </div>
  </section>

  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
</body>
</html>