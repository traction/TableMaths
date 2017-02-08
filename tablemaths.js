/*
Table Maths!
© 2011 Traction
https://traction.github.io/TableMaths/
*/
var $tablemaths = {
  version: '1.1.0',
  tm_loading_start: 0,
  tm_loading_interval: 100,
  tm_loading_max: 10,
  tm_cache: [],
  tm_tag_index: 0,
  init : function(){
    this.tm_loading_start = new Date().getTime();
    this.addScript('https://code.jquery.com/jquery-1.8.3.min.js');
    this.addScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js');
    window.setTimeout("$tablemaths.prerun()", this.tm_loading_interval);
  },
  addScript : function(src){
    t=document.createElement('script');
    t.setAttribute('src',src);
    document.body.appendChild(t);
  },
  prerun : function(){
    if (typeof $ == 'undefined' || typeof $.fn.draggable == 'undefined'){
      if ((new Date().getTime() - this.tm_loading_start) > (this.tm_loading_max * 1000)) {
        alert("Waited for "+this.tm_loading_max+" seconds and jQuery/jQuery UI are not loaded yet. Giving up... sorry! Waaaa!");
      } else {
        console.log('jquery or jquery ui not loaded; waiting another '+this.tm_loading_interval+'ms...');
        window.setTimeout("$tablemaths.prerun()", this.tm_loading_interval);
      }
    }else{
      this.run();
    }
  },
  run : function(){
    if ($.browser.opera || $.browser.msie){
      alert("Sorry, TableMaths doesn't work with your browser. Please try Firefox, Safari, or Chrome.");
      return;
    }
    $('body').append('<div id="tmhl" style="display:none;background-color:#9cf;opacity:0.75;position:absolute;z-index:999;"></div>');
    this.tm_cache = [];
    i=0;
    err=0;
    warn=0;
    report=''
    reporttag='<div id="tablemaths" style="z-index:9999;position:fixed;top:15px;left:15px;border:1px solid #000;background-color:#ff9;font-family:Lucida Grande,Helvetica,Arial;font-size:10px;padding:5px;width:450px;overflow:hidden;cursor:move;">';
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
    $('body').append(reporttag+report+'<div id="tmrs" class="ui-resizable-handle ui-resizable-se" style="position:absolute;bottom:5px;right:5px;background-image:url(https://traction.github.io/TableMaths/handle.png);width:11px;height:11px;cursor:se-resize;"></div></div');
    $('#tablemaths').draggable().resizable({ handles: {se:'#tmrs'} });
    $('.tmhl-tag').live('mouseover mouseout', function(event) {
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
    out = $("<p>").append(e.eq(0).clone()).html();
    parts = out.split('>',2);
    out = parts[0]+'>';
    out = out.replace('<','&lt;').replace('>','&gt;');
    out = '<span class="tmhl-tag" style="cursor:help;" cacheidx="'+this.tm_tag_index+'">'+out+'</span>';
    return out;
  },
  highlightEl : function(e){
    p=e.offset();
    $('#tmhl').css('left',p.left).css('top',p.top).width(e.width()).height(e.height()).show();
  }
};
$tablemaths.init();
