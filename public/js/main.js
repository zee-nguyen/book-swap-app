(function($) {
	// jQuery function to set a maximum length or characters for a page element it can handle mutiple elements
  $.fn.createExcerpts = function(elems,length,more_txt) {
		$.each($(elems), function() {
			var item_html = $(this).html(); //
			item_html = item_html.replace(/]+>/gi, ''); //replace html tags
			item_html = jQuery.trim(item_html);  //trim whitespace
			$(this).html(item_html.substring(0,length) + more_txt);  //update the html on page
		});
		return this; //allow jQuery chaining
	}
})(jQuery);

$().createExcerpts('.book-summary', 200,'...');
