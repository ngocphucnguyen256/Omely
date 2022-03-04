<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Article">
<head>
  <? include_once('_header.php')?>
</head>
<body>
  <?
  include_once('_menu.php');
  

  $wh = lw();
  // $wh .= ($wh==''?'':'AND')."(Hot='1')";
  $wh .= ($wh==''?'':'AND')."(Active='1')";
  $wh = ($wh==''?'':'WHERE').$wh;

  $ps = "SELECT * FROM ".PREFIX_NAME."slideshow".SUPFIX_NAME." $wh";

  $sildeshow = [];
  if($ps = $dx->get_results($ps)){
    foreach($ps as $pr){
      $sildeshow[] = [
        'name'		=> stripslashes($pr->Ten),
        'image'		=> ThumbImage($pr->Anh,1200),
        'thumb'		=> ThumbImage($pr->Anh,360),
        'rias'		=> ThumbImage($pr->Anh,'{width}'),
        'link'		=> URL_Rewrite($pr->URL),
        'content'	=> stripslashes($pr->Content),
      ];
    }
  }
  if(count($sildeshow)>0) {
  ?>
  <section class="banner-sildeshow">
    <? foreach($sildeshow as $a){?>
      
        <div class="genesys-banner-sildeshow" >
          <a href="<?=$a['link']?>">
            <img src="<?=$a['thumb']?>" data-src="<?=$a['rias']?>" data-widths="[480,640,800,1280,1600,2560]" data-optimumx="1.6" data-sizes="auto" class="lazyload">
          </a>
        </div>
        <div class="box-content-banner">
          <div class="container">
            <div class="row">
              <div class="offset-lg-8 col-lg-4 col-12">
                <?=$a['content']?>
                <p><!-- <a href="<?=$a['link']?>"><span>Tìm hiểu ngay</span></a> --></p>
              </div>
            </div>
          </div>
        </div>
    <?}?>
  </section>
  <?
  }
  ?>

  <section class="breadcrumb">
    <ul>
      <li><a href="<?=URL_Rewrite('')?>"><?=lg('Home')?></a></li>
    </ul>
  </section>
  <? 
    include_once('_popup.php');
    include_once('_footer.php');
  ?>
</body>
</html>