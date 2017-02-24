/*
Table Maths!
© 2017 Traction
https://traction.github.io/TableMaths/
*/
var $tablemaths = {
  version: '1.2.0',
  src_jquery: 'https://code.jquery.com/jquery-3.1.1.min.js',
  src_jquery_ui: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
  src_style: 'https://traction.github.io/TableMaths/assets/css/tablemaths.css',
  tm_cache: [],
  tm_tag_index: 0,
  init : function(){
    $tablemaths.loadStyle();
    $tablemaths.loadJquery();
  },
  loadStyle: function() {
    var styleTag = document.createElement('link');
    styleTag.setAttribute('href', $tablemaths.src_style);
    styleTag.setAttribute('rel', 'stylesheet');
    styleTag.setAttribute('type', 'text/css');
    document.head.appendChild(styleTag);
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
    $('body').append('<div id="tmhl"></div>');
    this.tm_cache = [];
    var i=0;
    var err=0;
    var warn=0;
    var report=''
    var reporttag='<div id="tablemaths">';
    reporttag += '<h1>TableMaths '+this.version+' <small><a href="https://traction.github.io/TableMaths/" target="_blank">by Traction</a></small></h1>';
    $('table,td').each(function(idx,el){
      var e=$(el);
      var x=e.attr('width');
      if(x !== undefined){
        var w=e.width();
        if (x.trim() === '') {
          report += '<div class="tm-report-element tm-report-type-emptywidth">';
          report += '<span class="tm-report-heading">Warning! Empty width attribute on tag:</span><br/>';
          report += $tablemaths.tagHtml(e);
          report += '</div>';
          warn++;
        } else if (x.substring(x.length-1)=='%'){
          if (parseInt(e.css('padding-left')) || parseInt(e.css('padding-right'))) {
            report += '<div class="tm-report-element tm-report-type-percentagewidthpadding">';
            report += '<span class="tm-report-heading">Error! Tag with percentage width and padding:</span><br/>';
            report += $tablemaths.tagHtml(e);
            err++;
          } else if (e.parents('table').length > 0) { // ignores tables that aren't nested
            report += '<div class="tm-report-element tm-report-type-percentagewidth">';
            report += '<span class="tm-report-heading">Warning! Percentage width on tag:</span><br/>';
            report += $tablemaths.tagHtml(e);
            report += '</div>';
            warn++;
          }
        } else if (w!=x) {
          report += '<div class="tm-report-element tm-report-type-widthwrong">';
          report += '<span class="tm-report-heading">Incorrect width on tag:</span><br/>';
          report += $tablemaths.tagHtml(e)+'<br/>';
          report += x+' specified, '+w+' actual';
          report += '</div>';
          err++;
        }
      }
      i++;
    });
    $('tr').each(function(idx,el){
      var e=$(el);
      if(e.attr('valign')){
        report += '<div class="tm-report-element tm-report-type-valign">';
        report += '<span class="tm-report-heading">Warning! valign on tr tags is ignored in some email clients.</span><br/>'
        report += $tablemaths.tagHtml(e);
        report += '</div>';
        warn++;
      }
      var tds = e.find('> td');
      var pad_top = tds.map(function(){return parseInt($(this).css('padding-top'), 10);});
      i++;
    });
    var finalReport = '<p class="tm-report">' + i + ' tags scanned, ' + err + ' errors, ' + warn + ' warnings.</p>' + report + '<p class="tm-ending">Enjoy your maths!</p>';
    $('body').append(reporttag + finalReport + '<div id="tmrs" class="ui-resizable-handle ui-resizable-se"></div></div>');
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
    out = '<span class="tmhl-tag" cacheidx="'+this.tm_tag_index+'">'+out+'</span>';
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
