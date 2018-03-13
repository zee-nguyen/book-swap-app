$(document).ready(function() {

  // Dropdown toggle
  $('.dropdown-toggle').dropdown();

  //Book excerpt
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

  //Browse Result
  $('.dropdown-item').on('click', function() {
    var genre = $(this)[0].innerText.toLowerCase();
    var url = `http://localhost:8888/books/api/browse_category/${genre}`;
    $.getJSON(url)
    .then(function(data) {
      console.log(data)
      $('.books-wrapper').empty();
      if(data.length == 0) {
        $('.books-wrapper').append('<div class="col-md-12">Sorry. We currently don\'t have any books in this categories</div>');
      } else {
        data.forEach(function(book) {
          if (book.summary.length > 400) {
            book.summary = book.summary.substring(0, 400) + '...';
          }
          var content = '<div class="col-md-3 book-container">';
          content += `<a href="books/${book._id}">`;
          content += `<div class="book-thumbnail"><img class= "img-fluid" src="${book.thumbnail}" alt=""></div></a>`;

          content += `<div class="book-info"> <h4 class="book-title"> <a href="books/${book._id}">${book.title}</a> </h4> <p class="book-author"> by ${book.author} </p> <div class="summary"> <p class="book-summary"> ${book.summary} </p> <a href="books/${book._id}">more details</a> </div> </div></div></div> </div>`;

          $('.books-wrapper').append(content);
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  });


  // Search result
  // $('.btn-query').on('click', function(e) {
  //     var query = $(this).val().toLowerCase();
  //     console.log(query);
      // var url = `http://localhost:8888/books/api/search/${query}`;
      // $.getJSON(url)
      //   .then(function(data) {
      //     console.log(data);
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   })
  // });

});
