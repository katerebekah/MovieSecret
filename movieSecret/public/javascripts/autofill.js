$(function() {
  var newInput = '';
  $('.input').autocomplete({
    source: function(request, response) {
      console.log(request.term);
      $.ajax({
        url: "https://api.themoviedb.org/3/movie/550?api_key=002f333f2697a7d07837b73589332b00" + request.term,
        dataType: "jsonp",
        success: function(data) {
          console.log(data);
          response(data);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      console.log(ui.item ?
        "Selected: " + ui.item.label :
        "Nothing selected, input was " + this.value);
    },
    open: function() {
      console.log(open);
      //$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      console.log(closed);
      //$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });
});
