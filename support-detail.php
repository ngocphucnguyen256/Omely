<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu-blog.php');

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
  <section class="genesys-content-blog gene-blog-article">
    <div class="container compact">
      <h2><?=$article['name']?></h2>
      <p class="author"><span> <?=lg('Date')?> <?=$article['date']?></span></p>
      <p><?=$article['brief']?></p>
      <p><?=$article['content']?></p>
    </div>
  </section>
  <? include_once('_footer.php')?>
</body>
</html>