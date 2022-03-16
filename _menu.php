<?
// Xu ly menu chinh
$menu = [];
$s = "SELECT * FROM ".PREFIX_NAME.'menu'.SUPFIX_NAME."
      WHERE chID='0' ".lw('AND')." ORDER BY Thutu";
if($rs = $dx->get_results($s)){
  foreach($rs as $r){
    $subm = [];
    $subl = [];
    $ss = "SELECT * FROM ".PREFIX_NAME.'menu'.SUPFIX_NAME."
          WHERE chID='".$r->mnID."' ".lw('AND')." ORDER BY Thutu";
    if($rrs = $dx->get_results($ss)){
      foreach($rrs as $rr){
        $mlv3 = [];
        $sss = "SELECT * FROM ".PREFIX_NAME.'menu'.SUPFIX_NAME."
          WHERE chID='".$rr->mnID."' ".lw('AND')." ORDER BY Thutu";
          // echo "$sss<br/>";
          if($rrz = $dx->get_results($sss)){
            foreach($rrz as $rz){
              $mlv3[] = [
                'link'	=> $rz->Link,
                'name'	=> $rz->Ten,
                'icon'	=> ThumbImage($rr->Icon,150),
              ];
            }
          }
        if (count($mlv3) > 0) $three = true;

        if ($rr->Icon != '') $mega = true;
        $subm[] = [
          'link'	=> $rr->Link,
          'name'	=> $rr->Ten,
          'icon'	=> ThumbImage($rr->Icon,150),
          'rias'	=> ThumbImage($rr->Icon,'{width}'),
          'three' => $mlv3
        ];

        $sl = "SELECT * FROM ".PREFIX_NAME.'menu'.SUPFIX_NAME."
          WHERE chID='".$rr->mnID."' AND Theme='1' ".lw('AND')." ORDER BY Thutu";
          // echo "$sss<br/>";
          if($rl = $dx->get_results($sl)){
            foreach($rl as $l){
              $subl[] = [
                'link'	=> $l->Link,
                'name'	=> $l->Ten,
                'icon'	=> ThumbImage($l->Icon,150),
                'rias'	=> ThumbImage($l->Icon,'{width}'),
              ];
            }
          }
      }
    }
    $menu[] = [
      'id'	  => $r->mnID,
      'link'	=> $r->Link,
      'theme' => $r->Theme,
      'icon'	=> ThumbImage($r->Icon,150),
      'rias'	=> ThumbImage($r->Icon,'{width}'),
      'name'	=> $r->Ten,
      'three' => $three,
      'sub'   => $subm,
      'mega'  => $mega,
      'sulg'  => $subl
    ];
    echo $menu['sulg'];
  }
}


//cart

//xoa mot
if(isset($_POST['btn-sunset-one-cart'])){
  $target = $_POST['id'];
  foreach($_SESSION['listCart'] as $c => $v) {
    if($v['id'] == $target){
      unset($_SESSION['listCart'][$c]);
    }
     
  }
}

//xoa het gio hang
if(isset($_POST['btn-sunset-all-cart'])){
   unset($_SESSION['listCart']);
}




?>




<header>
  <div class="box-menu--desktop d-sm-none d-md-block" style="height: 100px;">
    <section class="topbar">
      <div class="container">
        <div class="row ">
        <div class="logo-header">
            <a href="<?=URL_Rewrite('')?>"><img src="<?=$web['logo']?>" alt="logo-music-new1.png" ></a>
        </div>
        <div class="quote">
            <p>Cung cấp đồ dùng khách sạn chất lượng với giá cạnh tranh</p>
          </div>
          <div class="gene-hotline" style="text-align:right;">
            <p> Hotline:  <span><?=$web['hotline']?></span></p>
          </div>
          <div class="cart">
            <p class="cart-number"><?=count($_SESSION['listCart'])?></p>
            <button  ><img src="img/Icon-Thanh-vien-14.png"></button>
          </div>
          <div class="cart-hidden">
             <a href="#" class="closecart">X</a>
          
            <div id="minicart">  
                   
                <table id="lista-carrito" class="u-full-width">
                    <tbody>
                    <? $cart = $_SESSION['listCart'];
                    if(count($cart) > 0){
                      foreach($cart as $c =>$slr){  
                        ?>
                        <tr class="product-item">
                            <td><img src="<?=$slr['icon']?>" width="100"></td>
                            <td><?=$slr['name']?></td>
                            <td><?=$slr['price']?></td>
                            <td><?=$slr['amount']?></td>
                            <form action="" method="post">  
                              <input type="hidden" name="amount" value="<?=$slr['amount']?>"> 
                              <input type="hidden" name="id" value="<?=$slr['id']?>">     
                              <td> <button type="submit" name="btn-sunset-one-cart"class="deletebtn">X</button></td>
                            </form>
                        </tr>
                      <?}
                    }?>            
                    </tbody>
                </table>
                  <div style="display:flex; align-items:center;">
                    <form action="" method="post" style="margin-right:20px;">
                      <button style="margin-top:0px;" type="submit" name="btn-sunset-all-cart"id="vaciar-carrito" class="button primary-btn u-full-width">
                          Xóa hết
                      </button>
                  </form>
                  <button class="primary-btn" onclick="PlaceOrder()">Mua ngay</button>
                  </div>
            </div>
           
          </div>
          <!-- <div class="col box-search">
            <form action="/san-pham">
              <div class="box-form-search">
                <input name="q" type="search" value="<?=$_GET['q']?>" placeholder="Tìm sản phẩm" required>
                <button><i class="material-icons">search</i></button>
              </div>
            </form>
          </div> -->
        </div>
      </div>
    </section>


    <div class="box-content-menu gene-menu-main">
      <ul class="menu-mega-2">
      <?
      foreach($menu as $m){
        if(count($m['sub'])==0){?>
        <li class="dtri-edit">
          <a class="edit-son" href="<?=$m['link']?>"><?=$m['name']?></a>
        </li>
        <? }else{
          if($m['theme'] !== '1'){
          ?>
        <li class="dtri-edit active-mega-menu">
          <p class="edit-son" ><?=$m['name']?></p>
          <div class="box-mega-menu">
            <div class="container">
              <dl class="row" style=" justify-content: center;">
                <? foreach($m['sub'] as $s){?>
                  <?
                  if(count($s['three'])==0){
                    ?>
                    <ul style="width: auto;">
                      <li>
                        <a href="<?=$s['link']?>">
                          <img src="<?=$s['icon']?>" alt="">
                        <p><?=$s['name']?></p>
                      </a>
                    </li>
                    </ul>
                  <?
                  }
                  else{
                  ?>
                  <dd>
                      <h3 style="margin-top: 10px; margin-bottom: 10px;"><?=$s['name']?></h3>
                      <ul >
                        <? foreach($s['three'] as $e){?>
                          <li>
                              <a href="<?=$e['link']?>">
                                <img src="<?=$e['icon']?>" alt="<?=$e['name']?>">
                                <p><?=$e['name']?></p>
                            </a>
                          </li>
                        <?}?>
                      </ul>
                  <?}?>
                </dd>
                <?}?>
              </dl>
            </div>
          </div>
        </li>
        <?}else{?>
          <li class="dtri-edit menu-blog-theme">
          <a class="edit-son" href="<?=$m['link']?>"><?=$m['name']?></a>
          <div class="box-menu-blog">
            <div class="container">
              <div class="flex-container">
              <? foreach($m['sulg'] as $n){?>
                  <div class="content-menu">
                    <a href="<?=$n['link']?>">
                    <img src="<?=$n['icon']?>" data-src="<?=$n['rias']?>" data-widths="[250,500,800,1000,1200]" data-optimumx="1.6" data-sizes="auto" class="lazyload">
                      <p>
                      <?=$n['name']?>
                      </p>
                    </a>
                  </div>
                <?}?>
              </div>
            </div>
          </div>
        </li>
        <?
          }
        }
      }
      ?>

      </ul>
    
    </div>
  </div>
  <nav class="navbar box-menu--mobile navbar-light d-sm-block d-md-none">
    <div class="box-menu-mega-new">
      <a herf="#!" class="navbar-toggler" id="icon-sidebar">
        <span class="navbar-toggler-icon"></span>
      </a>
      <a class="navbar-brand" href="<?=URL_Rewrite('')?>">
        <img class="logo-sm" src="<?=$web['nlogo']?>" alt="genesys" />
      </a>
    </div>
    <!-- <div class="box-search-mb">
      <form action="/san-ơham">
        <div class="box-form-search">
          <input name="q" type="search" value="<?=$_GET['q']?>" placeholder="Tìm sản phẩm" required>
          <button><i class="material-icons">search</i></button>
        </div>
      </form>
    </div> -->

    <div class="lean-overlay"></div>
    <div class="navbar-right-down">
      <a herf="#!" class="navbar-toggler" id="icon-stop">
        <span class="navbar-toggler-icon-close"><i class="material-icons">close</i></span>
      </a>
      <ul>
      <?
      foreach($menu as $m){
        if(count($m['sub'])>0){?>
        <li class="nav-item three-menu">
          <!-- <a class="nav-link" href="<?=$m['link']?>"> -->
          <a class="nav-link" href="#!">
            <?=$m['name']?> <i class="material-icons">keyboard_arrow_right</i>
          </a>
          <ul class="level_2">
            <li class="nav-item pre_menu_level2">
              <a class="nav-link close-mage-menu-title" href="<?=$m['link']?>">
                <i class="material-icons">navigate_before</i> <?=$m['name']?>
              </a>
            </li>
            <? foreach($m['sub'] as $s){?>
            <li class="nav-item">
              <a class="nav-link" href="<?=$s['link']?>"><b><?=$s['name']?></b></a>
            </li>
              <? foreach($s['three'] as $e){?>
              <li class="nav-item">
                <a class="nav-link" href="<?=$e['link']?>"><?=$e['name']?></a>
              </li>
              <?
              }
            }
            ?>
          </ul>
        </li>
        <? }else{?>
        <li class="nav-item">
          <a class="nav-link" href="<?=$m['link']?>"><?=$m['name']?></a>
        </li>
          <?
          }
        }

        if(MULTI_LANGUAGE){
        ?>
        <li class="nav-item" style="display: none;">
          <p style="margin-left: 15px;font-weight: 600;"><?=lg('langWeb');?></p>
          <?
          $s = "SELECT * FROM ".PREFIX_NAME.'language'.SUPFIX_NAME."
                WHERE Active='1' ORDER BY Thutu";
          if($rs = $dx->get_results($s)){
            foreach($rs as $r){?>
                <a class="nav-link" style="display: inline-block; width: 45%;" href="/<?=$r->lang?>/" title="<?=stripslashes($r->Ten)?>"><img style="border-radius: 3px;height: 25px;margin-right: 5px;" src="<?=$r->Anh?>" alt="<?=stripslashes($r->Ten)?>"><?=stripslashes($r->Ten)?></a>
              <?
            }
          }
          ?>
        </li>
        <? }?>
      </ul>
    </div>
  </nav>
</header>

