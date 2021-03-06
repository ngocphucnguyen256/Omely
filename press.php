<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu-blog.php');

  $s = "SELECT * FROM ".PREFIX_NAME."article_type".SUPFIX_NAME." WHERE typeID='".TYPE_PRESS."'";
  $article = [];
  if($rs = $dx->get_results($s)){
    foreach($rs as $r){
      $article[] = [
        'name'		=> stripslashes($r->Ten),
        'brief'		=> stripslashes($r->Index)
      ];
    }
  }
  if(count($article)>0) {
?>
  <section class="gold-summary">
    <div class="container">
      <? foreach($article as $a){?>
        <h1><?=$a['name']?></h1>
        <div class="row">
          <div class="offset-md-3 col-md-6">
            <?=$a['brief']?>
          </div>
        </div>
      <?}?>
    </div>
  </section>
<?
  }
  // Phan trang
  $rowsPerPage = 12;
  $curPage = isset($_GET['page'])?safe($_GET['page']):1;
  $offset = ($curPage - 1) * $rowsPerPage;

  // Danh sach tin tuc
  $wh = lw();
  $wh .= ($wh==''?'':'AND')."(typeID='".TYPE_PRESS."')";
	$wh .= ($wh==''?'':'AND')."(Active='1')";
	$wh = ($wh==''?'':'WHERE').$wh;
	
	// Danh sach bai viet
	$s = "SELECT * FROM ".PREFIX_NAME."article".SUPFIX_NAME." $wh
        ORDER BY NgayCN DESC LIMIT $offset, $rowsPerPage";
	$list = [];
	if($rs = $dx->get_results($s)){
	  foreach($rs as $r){
      $list[] = [
        'name'		=> stripslashes($r->Ten),
        'image'		=> ThumbImage($r->Anh,300),
        'thumb'		=> ThumbImage($r->Anh,150),
        'rias'		=> ThumbImage($r->Anh,'{width}'),
        'brief'		=> CutString($r->Tomtat,512),
        'link'		=> URL_Rewrite("kien-thuc",$r->URL),
        'date'		=> format_date($r->NgayCN)
      ];
	  }
  }

  // Title tag for SEO
  $web['title'] = lg('Press').' | '.$web['title'];
  ?>
  <section class="news-home gene-page-article">
    <div class="container">
      <? if(count($list)>0) {?>
      <div class="row">
        <? foreach($list as $a){?>
        <div class="col-md-4 col-6">
          <a href="<?=$a['link']?>" title="<?=$a['name']?>">
            <div class="box-img-content-news">
              <img src="<?=$a['thumb']?>" data-src="<?=$a['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload" alt="<?=$a['name']?>">
              <h3><?=$a['name']?></h3>
              <p><?=$a['brief']?></p>
            </div>
          </a>
        </div>
        <? } ?>
      </div>
      <?
      }
      else echo '<i>Kh??ng c?? b??i vi???t</i>';

      $numPages = NumOfPages($dx,PREFIX_NAME.'article'.SUPFIX_NAME,$wh,$rowsPerPage);
      $wview->Pagination($numPages,$curPage,$_GET['content'],$pageURL);
      ?>
    </div>
  </section>

  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
</body>
</html>