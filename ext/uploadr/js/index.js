/*
 * QsvUploadr 2.1
 * Copyright 2018 QsvProgram
 * Released under the MIT and GPL licenses.
 */
class QsvUploadr {
  constructor() {}

  static Template(title, button){
    console.log('QsvUploadr: Template');

    var html = '<div id="qsvuploadr#x#" class="uploadr" data-name="file" multiple>'+
      '<div class="control">'+title+
        '<a id="qsvpickr#x#" href="#picker" class="btn btn-default btn-secondary pickr" title="Giữ ctrl để chọn nhiều hình"><i class="fas fa-upload"></i> '+button+'</a>'+
        '<span class="status">Trình duyệt không hỗ trợ HTML5, Flash hoặc Silverlight!</span>'+
      '</div>'+
      '<ul class="preview"></ul>'+
    '</div>';
    console.log(html);

    return html;
  }

  static Add(holder, pwd='./') {
    console.log('QsvUploadr: Add');

    var $holder = $(holder);
    var noupldr = $holder.find('.uploadr:visible').length;
    console.log('No uploader: ' + noupldr);

    var uptpl = QsvUploadr.Template('', 'Upload hình'),
        newupldr = uptpl.split('#x#').join(noupldr + 1);
    console.log('New uploader: ' + newupldr);

    var $newupldr = $(newupldr);
    $newupldr.appendTo($holder);
    QsvUploadr.Build($newupldr, pwd);
  }

  static Build(uplr, pwd='./') {
    console.log('QsvUploadr: Build');

    var $upload = $(uplr),
        $pick = $upload.find('.pickr'),
        $status = $upload.find('.status'),
        $preview = $upload.find('.preview');

    // Sortable image
    var $sort = Sortable.create($preview[0], {
      animation: 150,
      handle: ".handler",
      draggable: "li",
      ghostClass: "ghost",
      chosenClass: "chosen",
      dragClass: "drag"
    });

    // Multi Uploader
    var multiple = $upload.is('[multiple]');
    if(multiple) console.log('--> Multiple Uploader');
    else console.log('--> Single Uploader');

    // QsvUploadr
    var uploadr = new plupload.Uploader({
      runtimes: 'html5,flash,silverlight,html4',
      browse_button: $pick.attr('id'),
      container: $upload.attr('id'),
      url: Cookies.get('uploadr')+'/upload.php',
      flash_swf_url: pwd+'ext/uploadr/js/Moxie.swf',
      silverlight_xap_url: pwd+'ext/uploadr/js/Moxie.xap',
      chunk_size: '1mb',
      unique_names: false,
      multi_selection: multiple,
      
      filters: {
        max_file_size: '32mb',
        mime_types: [
          {title: 'Image files', extensions: 'jpg,jpeg,png,gif,svg,psd,ai,cdr,swf'},
          {title: 'Doc files', extensions: 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt'},
          {title: 'Zip files', extensions: 'zip,rar,gz,tar'}
        ]
      },
      
      preinit : {
        Init: function(up, info) {
          var $items = $preview.find('.item');
          if($items.length>0) $preview.show();
          else $preview.hide();
        }
      },
      init: {
        PostInit: function() {
          var title = $pick.attr('title');
          $status.html(title);
        },
        
        FilesAdded: function(up, files) {
          if(!multiple) $preview.html('');

          $.each(files, function(i, file) {
            var $div = $('<li>'+
              '<div id="'+file.id+'" class="item">Uploading<br> '+file.name+' <b>0%</b></div>'+
              '</li>');
            $div.appendTo($preview);
          });
          
          $preview.show();
        },
        
        QueueChanged: function(up) {
          up.start();
        },
        
        UploadProgress: function(up, file) {
          $('#'+file.id+' b').html(file.percent+'%');
        },
        
        FileUploaded: function(up, file, info) {
          var name = $upload.data('name'),
              res = $.parseJSON(info.response);
          
          $('#'+file.id).html(QsvUploadr.ViewImage(res.thumb,res.location));
          $('#'+file.id).append('<input type="hidden" name="'+name+'[]" value="'+res.result+'">');
        },
        
        Error: function(up, err) {
          var msg = 'Error #'+err.code+': '+err.message
          if(err.file) $('#'+err.file.id+' b').html(msg);
          else $status.html(msg);
        }
      }
    });

    $upload.data('uploadr',uploadr);
    uploadr.init();
  }

  static Destroy(uplr){
    console.log('QsvUploadr: Destroy');

    var $upload = $(uplr),
			  uploader = $upload.data('upload');
		
		if(typeof(uploader)!='undefined'){
			uploader.destroy();
			$upload.removeData('upload');
		}
  }
  
  static ViewImage(thumb,view){
    console.log('QsvUploadr: View Image');

    var html = '<a href="'+view+'" onclick="return QsvUploadr.OpenImage(\''+view+'\')"><img src="'+thumb+'"></a>';
    html += '<div class="removei" onclick="QsvUploadr.RemoveImage(this)"><i class="fas fa-times"></i></div>';
    html += '<div class="handler"><i class="fas fa-arrows-alt"></i></div>';
    return html;
  }

  static OpenImage(img){
    console.log('QsvUploadr: Open Image');

    $.fancybox.open({
      href : img,
      padding : 0,
      margin : [20, 60, 20, 60],
      openEffect : 'elastic',
      closeEffect : 'elastic',
      closeBtn: false,
      closeClick: true,
      helpers: {
        overlay : {
          css : {'background':'rgba(0,0,0,0.5)'},
          locked: false
        }
      }
    });
    return false;
  }

  static RemoveImage(el){
    console.log('QsvUploadr: Remove Image');
    
    var $item = $(el).parentsUntil('.preview'),
        $preview = $item.parent();
    $item.remove();
    if($preview.find('.item').length==0) $preview.hide();

    return false;
  }
}

window.QsvUploadr = QsvUploadr;
export default QsvUploadr;
