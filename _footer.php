<footer>
  <div class="container">
    <div class="row">
      <?
      $s = "SELECT * FROM ".PREFIX_NAME."bottom".SUPFIX_NAME."
            WHERE chID='0' ".lw('AND')." ORDER BY Thutu LIMIT 1";
      if($r = $dx->get_row($s)){?>
      <div class="col-md-3 col-12 list-menu-footer">
        <h5><a href="<?=$r->Link?>"><?=stripslashes($r->Ten)?></a></h5>
        <?
        $ss = "SELECT * FROM ".PREFIX_NAME."bottom".SUPFIX_NAME."
               WHERE chID='".$r->btmID."' ORDER BY Thutu";
        if($rrs = $dx->get_results($ss)){?>
        <ul class="links">
          <? foreach($rrs as $rr){?>
          <li>
            <a href="<?=$rr->Link?>"><span class="material-icons">keyboard_arrow_right</span> <?=stripslashes($rr->Ten)?></a>
          </li>
          <?}?>
        </ul>
        <? }?>
      </div>
      <? }?>
      <?
      $s = "SELECT * FROM ".PREFIX_NAME."bottom".SUPFIX_NAME."
            WHERE chID='0' ".lw('AND')." ORDER BY Thutu LIMIT 1,10";
      if($rs = $dx->get_results($s)){
        foreach($rs as $r){?>
      <div class="col-md-3 col-12 list-menu-footer">
        <h5><a href="<?=$r->Link?>"><?=stripslashes($r->Ten)?></a></h5>
        <?
        $ss = "SELECT * FROM ".PREFIX_NAME."bottom".SUPFIX_NAME."
               WHERE chID='".$r->btmID."' ".lw('AND')." ORDER BY Thutu";
        if($rrs = $dx->get_results($ss)){?>
        <ul class="links">
          <? foreach($rrs as $rr){?>
          <li>
            <a href="<?=$rr->Link?>"><span class="material-icons">keyboard_arrow_right</span> <?=stripslashes($rr->Ten)?></a>
          </li>
          <?}?>
        </ul>
        <? }?>
      </div>
      <?
      }
    }
    ?>
    <div class="col-md-3 col-12 follow">
        <div class="follow-us">
          <h5 class="social">FOLLOW US</h5>
          <p>
            <a href="<?=$web['facebook']?>" target="_blank">
              <img src="img/facebook.png" alt="">
            </a>
            <a href="<?=$web['instagram']?>" target="_blank">
              <img src="img/instagram.png" alt="">
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="info-company">
    <p>
      <a href="<?=URL_Rewrite('')?>"><img src="<?=$web['nlogo']?>" alt="genesys"></a>
    </p>
    <ul class="info-contact-footer">
      <li>
        <span class="material-icons">phone</span> <?=$web['hotline']?>
      </li>
      <li>
        <span class="material-icons">email</span> trandang22992@gmail.com
      </li>
      <li>
        <span class="material-icons">public</span> dodungkhachsanphuquoc.com
      </li>
    </ul>
    <ul class="info-contact-footer">
      <li>
        <span class="material-icons">place</span> VH-154, ĐT45, Khu du lịch Grand World Phú Quốc, Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang
      </li>
  </div>
</footer>
<!-- <seciton class="cta-scroll-all">
  <div class="container">
    <div class="row">
      <div class="offset-md-3 col-md-3 col-6 call-phone">
        <a href="tel:<?=$web['hotline']?>" class="secondary-btn"><?=$web['hotline']?></a>
      </div>
      <div class="col-md-3 col-6">
        <button class="primary-btn genesys-contact-show-popup">TƯ VẤN NGAY</button>
      </div>
    </div>
  </div>
</seciton> -->
<seciton class="cta-scroll-all">
  <div class="">
    <div class="r">
      <div class="">
        <a href="tel:<?=$web['hotline']?>" class="secondary-btn">📞</a>
      </div>
      <div class="">
        <button class="primary-btn genesys-contact-show-popup">💭</button>
      </div>
    </div>
  </div>
</seciton>

<!-- jQuery -->
<script src="//code.jquery.com/jquery-3.3.1.min.js"></script>
<script>window.jQuery || document.write('<script src="ext/jquery/jquery.min.js"><\/script>')</script>

<!-- Scripts -->
<script src="dist/bundle.js"></script>
<script>
  var $modal = $('#popupSend');
  if ($modal.length > 0) {
    setTimeout(function () { $modal.show() }, 30000);
  }
</script>
