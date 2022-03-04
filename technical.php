<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu.php');

  // Phan trang
  $rowsPerPage = 12;
  $curPage = isset($_GET['page'])?safe($_GET['page']):1;
  $offset = ($curPage - 1) * $rowsPerPage;

  $title = lg('Article');
  // $typeURL = 'article';
  $typeURL = safe($_GET['name1']);

  if(isset($_GET['name'])) $typeURL = safe($_GET['name']);

  $wh = lw();
  $s = "SELECT * FROM ".PREFIX_NAME.'article_type'.SUPFIX_NAME." WHERE URL='$typeURL'";
	if($r = $dx->get_row($s)){
    $title = stripslashes($r->Ten);
  	$wh .= ($wh==''?'':'AND')."(typeID='".$r->typeID."')";
  }

  // Danh sach
	$wh .= ($wh==''?'':'AND')."(Active='1')";
	$wh = ($wh==''?'':'WHERE').$wh;
	
	// $s = "SELECT * FROM ".PREFIX_NAME."article_catalog".SUPFIX_NAME." $wh
  //       ORDER BY Thutu,NgayCN DESC LIMIT $offset, $rowsPerPage";
  $s = "SELECT * FROM ".PREFIX_NAME."article_catalog";
  // echo "$s<br/>";
	$list = [];
	if($rs = $dx->get_results($s)){
	  foreach($rs as $r){
      $image = '';
      if($r->Anh!='') $image = ThumbImage($r->Anh,500);

      $list[] = [
        'name'		=> stripslashes($r->Ten),
        'image'		=> $image,
        'thumb'		=> ThumbImage($r->Anh,150),
        'rias'		=> ThumbImage($r->Anh,'{width}'),
        'brief'		=> CutString($r->Tomtat,150),
        'link'		=> URL_Rewrite($typeURL,$r->URL),
        'date'		=> format_date($r->NgayCN)
        
      ];
	  }
  }

  // Title tag for SEO
  $web['title'] = $title.' | '.$web['title'];
  ?>

  <section class="news-home">
    <div class="container">
      <? if(count($list)>0) {?>
      <div class="row ">
        <? foreach($list as $a){?>
        <div class="col-md-3 col-lg-3 col-6">
          <article class="box-img-content-news">
            <? if($a['image']!='') {?>
            <a href="<?=$a['link']?>" title="<?=$a['name']?>">
              <img src="<?=$a['thumb']?>" data-src="<?=$a['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload" alt="<?=$a['name']?>">
            </a>
            <? }?>
            <div>
              <h3><a href="<?=$a['link']?>" title="<?=$a['name']?>"><?=$a['name']?></a></h3>
              <p ><?=$a['brief']?></p>
            </div>
          </article>
        </div>
        <? }?>
      </div>
      <?
      }
      else echo '<i>Không có bài viết</i>';

      // $numPages = NumOfPages($dx,PREFIX_NAME.'article'.SUPFIX_NAME,$wh,$rowsPerPage);
      // $wview->Pagination($numPages,$curPage,$_GET['content'],$pageURL);
      ?>
    </div>
  </section>
  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
</body>
</html>