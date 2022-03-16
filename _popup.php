<?
  
  // Popup trang chu 
  $wh = lw();
  $wh .= ($wh==''?'':'AND')."(Active='1')";
  $wh .= ($wh==''?'':'AND')."(Loai='0')";
  $wh = ($wh==''?'':'WHERE').$wh;
  
  $s = "SELECT * FROM ".PREFIX_NAME."popup".SUPFIX_NAME." $wh
        ORDER BY Thutu LIMIT 1";
        // echo "$s<br/>";
  $list = [];
  if($rs = $dx->get_results($s)){
    foreach($rs as $r){
      $list[] = [
        'name'		=> stripslashes($r->Ten),
        'image'		=> ThumbImage($r->Anh, 800),
        'imageMB'		=> ThumbImage($r->Anhmobi, 400),
        'content'		=> stripslashes($r->Mota),
        'thumb'		=> ThumbImage($r->Anhmobi, 400),
        'rias'		=> ThumbImage($r->Anhmobi, '{width}'),
        'link'		=> stripslashes($r->Link)
      ];
    }
  }
  
  if(count($list)>0) {?>
    <div id="popupSend" class="popupNew autoNew">
      <div class="container compact popupContent">
        <p class="close-btn-popup close-popup"><span>X</span></p>
        <? foreach($list as $a){?>
          <img class="img-desktop-popup" src="<?=$a['image']?>" alt="">
          <img src="<?=$a['imageMB']?>" alt="" class="img-mobile-popup d-sm-block d-md-none">
        <?}?>
        <div class="formN-popup">
          <form action="/lead" method="post" id="popupform">
            <div class="row">
              <div class="col-12 input-filde-new">
                <input type="text" name="name" required placeholder="Họ và tên">
              </div>
              <div class="col-12 input-filde-new" >
                <input type="text" name="tel" required placeholder="Số điện thoại">
              </div>
              <div class="col-12 input-filde-new" >
                <input type="text" name="mail" required placeholder="Email">
              </div>
              <div class="col-12 input-filde-new" >
                <input type="text" name="note" required placeholder="Nhập yêu cầu">
              </div>
              <div class="col-12 input-filde-new" >
                <button class="primary-btn" onclick="return MakeContact('popupSend')"><?=lg('Subpop')?></button>
                <div class="secondary-btn" style="display:none"><?=lg('Sending request')?>....</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  <?}?>
  <div id="popup" class="modal-request filter-mobile">
    <div class="container compact filterDK">
      <div class="close-popup-send">x</div>
      <div class="row no-gutters">
        <div class="col-12"> 
          <h3>
            DÁNG PIANO
          </h3>
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
          <h3>
            HÃNG PIANO
          </h3>
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
    </div>
  </div>
<script>
  $(".lp-voucher").ready(function() {
    $('.select2x').select2();
  });
  
  function MakeContact(id){
    var frm = $('#'+id);
        ok = true, err = '';

    if (frm.find('*[name=name]').val() == "") {
      frm.find('*[name=name]').focus();
      ok = false;
      err += "Bạn chưa nhập họ tên!\n";
    }

    if (frm.find('*[name=tel]').val() == "") {
      frm.find('*[name=tel]').focus();
      ok = false;
      err += "Bạn chưa nhập điện thoại!\n";
    }

    if (frm.find('*[name=note]').val() == "") {
      frm.find('*[name=note]').focus();
      ok = false;
      err += "Bạn chưa chọn Voucher!\n";
    }

    if (err != '') {
      alert(err);
      return false;
    }

    if(ok) {
      let $btn = frm.find('button');
      $btn.hide();
      $btn.next().show();

      // Thong tin san pham
      let param = $opts.find('select,input').serialize();
      frm.attr('action', "/lead");
      frm.submit();
    }
    
    return false;
  }
  </script>
  