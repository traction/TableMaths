/*
Table Maths!
© 2017 Traction
https://traction.github.io/TableMaths/
*/
var $tablemaths = {
  version: '1.1.0',
  src_jquery: 'https://code.jquery.com/jquery-3.1.1.min.js',
  src_jquery_ui: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
  src_img_handle: 'https://traction.github.io/TableMaths/handle.png',
  tm_loading_start: 0,
  tm_loading_interval: 400,
  tm_loading_max: 10,
  tm_cache: [],
  tm_tag_index: 0,
  init : function(){
    this.tm_loading_start = new Date().getTime();
    $tablemaths.loadJquery();
  },
  loadJquery: function() {
    var jqueryScript = document.createElement('script');
    jqueryScript.setAttribute('src', $tablemaths.src_jquery);
    jqueryScript.onload = function() {
      $tablemaths.loadJqueryUI();
    };
    jqueryScript.onerror = function() {
      $tablemaths.error('jQuery could not load.');
    };
    document.head.appendChild(jqueryScript);
  },
  loadJqueryUI: function() {
    var jqueryScriptUI = document.createElement('script');
    jqueryScriptUI.setAttribute('src', $tablemaths.src_jquery_ui);
    jqueryScriptUI.onload = function() {
      $tablemaths.prerun();
    };
    jqueryScriptUI.onerror = function() {
      $tablemaths.error('jQuery UI could not load.');
    };
    document.head.appendChild(jqueryScriptUI);
  },
  prerun : function(){
    if (typeof $ == 'undefined' || typeof $.fn.draggable == 'undefined'){
      $tablemaths.error('jQuery or jQuery UI couldn\'t load.');
    } else {
      this.run();
    }
  },
  run : function(){
    $('body').append('<div id="tmhl" style="display:none;background-color:#9cf;opacity:0.75;position:absolute;z-index:999;"></div>');
    this.tm_cache = [];
    var i=0;
    var err=0;
    var warn=0;
    var report=''
    var reporttag='<div id="tablemaths" style="z-index:9999;position:fixed;top:15px;left:15px;border:1px solid #000;background-color:#ff9;font-family:Lucida Grande,Helvetica,Arial;font-size:10px;padding:5px;width:450px;overflow:hidden;cursor:move;">';
    reporttag += '<h1 style="font-size:16px;font-weight:bold;margin:0 0 12px 0;">TableMaths '+this.version+'</h1>';
    $('table,td').each(function(idx,el){
      var e=$(el);
      var x=e.attr('width');
      if(x !== undefined){
        var w=e.width();
        if (x.trim() === '') {
          report += 'Warning! Empty width attribute on tag:<br/>';
          report += $tablemaths.tagHtml(e)+'<br/><br/>';
          warn++;
        } else if (x.substring(x.length-1)=='%'){
          if (parseInt(e.css('padding-left')) || parseInt(e.css('padding-right'))) {
            report += 'Error! Tag with percentage width and padding:<br/>';
            report += $tablemaths.tagHtml(e)+'<br/><br/>';
            err++;
          } else if (e.parents('table').length > 0) { // ignores tables that aren't nested
            report += 'Warning! Percentage width on tag:<br/>';
            report += $tablemaths.tagHtml(e)+'<br/><br/>';
            warn++;
          }
        } else if (w!=x) {
          report += 'Incorrect width on tag:<br/>';
          report += $tablemaths.tagHtml(e)+'<br/>';
          report += x+' specified, '+w+' actual<br/><br/>';
          err++;
        }
      }
      i++;
    });
    $('tr').each(function(idx,el){
      var e=$(el);
      if(e.attr('valign')){
        report += 'Warning! valign on tr tags is ignored in some email clients.<br/>'
        report += $tablemaths.tagHtml(e)+'<br/>';
        warn++;
      }
      var tds = e.find('> td');
      var pad_top = tds.map(function(){return parseInt($(this).css('padding-top'), 10);});
      i++;
    });
    report = '<b>'+i+' tags scanned, '+err+' errors, '+warn+' warnings.</b><br/><br/>'+report+'Enjoy your maths!';
    $('body').append(reporttag+report+'<div id="tmrs" class="ui-resizable-handle ui-resizable-se" style="position:absolute;bottom:5px;right:5px;background-image:url('+$tablemaths.src_img_handle+');background-size:11px;background-repeat:no-repeat;width:11px;height:11px;cursor:se-resize;"></div></div');
    $('#tablemaths').draggable().resizable({ handles: {se:'#tmrs'} });
    $('.tmhl-tag').on('mouseover mouseout', function(event) {
      if (event.type=='mouseout'){
        $('#tmhl').hide();
      } else {
        $tablemaths.highlightEl($tablemaths.tm_cache[$(this).attr('cacheidx')]);
      }
    });
  },
  tagHtml : function(e){
    this.tm_tag_index++;
    this.tm_cache[this.tm_tag_index]=e;
    var out = $("<p>").append(e.eq(0).clone()).html();
    var parts = out.split('>',2);
    out = parts[0]+'>';
    out = out.replace('<','&lt;').replace('>','&gt;');
    out = '<span class="tmhl-tag" style="cursor:help;" cacheidx="'+this.tm_tag_index+'">'+out+'</span>';
    return out;
  },
  highlightEl : function(e){
    var p=e.offset();
    $('#tmhl').css('left',p.left).css('top',p.top).width(e.width()).height(e.height()).show();
  },
  error: function(inputString) {
    console.error(inputString);
    return false;
  }
};
$tablemaths.init();
