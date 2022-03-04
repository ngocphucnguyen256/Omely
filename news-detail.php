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
    $s = "SELECT * FROM ".PREFIX_NAME."news".SUPFIX_NAME." WHERE URL='$pageURL'";
    $r = $dx->get_row($s);
  }
  if(empty($r->newsID)) Page404();


  // Chi tiet tin
  $news = [
    'id' => stripslashes($r->newsID),
    'name' => stripslashes($r->Ten),
    'brief' => stripslashes($r->Tomtat),
    'content' => stripslashes($r->Chitiet),
    'date' => format_date($r->NgayCN),
    'other' => preg_split("/[#,]/",$r->Lienquan,-1,PREG_SPLIT_NO_EMPTY)
  ];

  // Auto resize images
  $news['content'] = OptimizeImage($news['content'],800);

  // Image tag for SEO
  if($r->Anh!='') {
    $news['image'] = ThumbImage($r->Anh,800);
    $web['webimg'] = ThumbImage($r->Anh,450);
  }

  // Title tag for SEO
  $seot = stripslashes($r->TagTitle);
  if(empty($seot)) $seot = $news['name'].' | '.$web['title'];
  if(!empty($seot)) $web['title'] = $seot;

  // Description tag for SEO
  $seod = stripslashes($r->TagDesc);
  if(empty($seod)) $seod = Html2Text($news['brief']);
  if(!empty($seod)) $web['description'] = $seod;
  ?>
  <section class="genesys-content-blog gene-blog-article">
    <div class="container compact">
      <h2><?=$news['name']?></h2>
      <p class="author"><span> <?=lg('Date')?> <?=$news['date']?></span></p>
      <p><?=$news['brief']?></p>
      <p><?=$news['content']?></p>
    </div>
  </section>

  <?
  // Tin tuc
  $wh = lw();
  $wh .= ($wh==''?'':'AND')."(newsID IN ('".join("','",$news['other'])."'))";
  $wh .= ($wh==''?'':'AND')."(newsID!='".$news['id']."')";
	$wh .= ($wh==''?'':'AND')."(Active='1')";
	$wh = ($wh==''?'':'WHERE').$wh;
	
	// Danh sach bai viet
	$s = "SELECT * FROM ".PREFIX_NAME."news".SUPFIX_NAME." $wh
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
        'link'		=> URL_Rewrite('kinh-nghiem',$r->URL),
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
    $s = "SELECT * FROM ".PREFIX_NAME."news".SUPFIX_NAME." WHERE newsID='$r->newsID'";
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
      </li>
      <!-- <li class="decord">
        <a href="#!">Trang sức cưới</a>
      </li> -->
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
  <!-- Facebook SDK -->
  <div id="fb-root"></div>
  <script>
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src =
        'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.12&appId=607358642943947&autoLogAppEvents=1';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  </script>
</body>
</html>