/*
Table Maths!
© 2010 Traction
By Gabriel Gilder, 2010/06/17
*/
var $tablemaths = {
	tm_loading : 0,
	tm_loading_max : 200,
	tm_cache : [],
	init : function(){
		this.addScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
		this.addScript('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js');
		window.setTimeout('$tablemaths.prerun()',50);
	},
	addScript : function(src){
		t=document.createElement('script');
		t.setAttribute('src',src);
		document.body.appendChild(t);
	},
	prerun : function(){
		if (typeof $ == 'undefined' || typeof $.fn.draggable == 'undefined'){
			if (this.tm_loading > this.tm_loading_max) {
				alert("Waited for 10 seconds and jQuery/jQuery UI are not loaded yet. Giving up... sorry! Waaaa!");
			} else {
				console.log('jquery or jquery ui not loaded; waiting another 50ms...');
				this.tm_loading++;
				window.setTimeout('$tablemaths.prerun()',50);
			}
		}else{
			this.run();
		}
	},
	run : function(){
		$('body').append('<div id="tmhl" style="display:none;background-color:#9cf;opacity:0.75;position:absolute;z-index:999;"></div>');
		this.tm_cache = [];
		i=0;
		err=0;
		warn=0;
		report=''
		reporttag='<div id="tablemaths" style="z-index:9999;position:fixed;top:15px;left:15px;border:1px solid #000;background-color:#ff9;font-family:Lucida Grande;font-size:10px;padding:5px;width:450px;overflow:hidden;cursor:move;">';
		$('table,td').each(function(idx,el){
			e=$(el);
			if(x=e.attr('width')){
				w=e.width();
				if (x.substring(x.length-1)=='%'){
					if (parseInt(e.css('padding-left')) || parseInt(e.css('padding-right'))) {
						report += 'Error! Tag with percentage width and padding:<br/>';
						report += $tablemaths.tagHtml(e, idx)+'<br/><br/>';
						$tablemaths.tm_cache[idx]=e;
						err++;
					} else if (e.parents('table').length > 0) { // ignores tables that aren't nested
						report += 'Warning! Percentage width on tag:<br/>';
						report += $tablemaths.tagHtml(e, idx)+'<br/><br/>';
						$tablemaths.tm_cache[idx]=e;
						warn++;
					}
				} else if (w!=x) {
					report += 'Incorrect width on tag:<br/>';
					report += $tablemaths.tagHtml(e, idx)+'<br/>';
					report += x+' specified, '+w+' actual<br/><br/>';
					$tablemaths.tm_cache[idx]=e;
					err++;
				}
			}
			i++;
		});
		report = '<b>'+i+' tags scanned, '+err+' errors, '+warn+' warnings.</b><br/><br/>'+report+'Enjoy your maths!';
		$('body').append(reporttag+report+'<div id="tmrs" class="ui-resizable-handle ui-resizable-se" style="position:absolute;bottom:5px;right:5px;background-image:url(http://github.com/traction/TableMaths/raw/master/handle.png);width:11px;height:11px;cursor:se-resize;"></div></div');
		$('#tablemaths').draggable().resizable({ handles: {se:'#tmrs'} });
		$('.tmhl-tag').live('mouseover mouseout', function(event) {
			if (event.type=='mouseout'){
				$('#tmhl').hide();
			} else {
				$tablemaths.highlightEl($tablemaths.tm_cache[$(this).attr('cacheidx')]);
			}
		});
	},
	tagHtml : function(e, idx){
		out = $("<p>").append(e.eq(0).clone()).html();
		parts = out.split('>',2);
		out = parts[0]+'>';
		out = out.replace('<','&lt;').replace('>','&gt;');
		out = '<span class="tmhl-tag" style="cursor:help;" cacheidx="'+idx+'">'+out+'</span>';
		return out;
	},
	highlightEl : function(e){
		p=e.offset();
		$('#tmhl').css('left',p.left).css('top',p.top).width(e.width()).height(e.height()).show();
	}
};
$tablemaths.init();
