$(function() {
  var formData = {};
  var newInput = '';
  $('.input').autocomplete({
      source: function(request, response) {
        $.ajax({
          url: "http://www.omdbapi.com/?t=" + request.term + "&r=json&callback",
          dataType: "jsonp",
          success: function(data) {
            //save API data for later save with the form
            formData.year = data.Year;
            formData.poster = data.Poster;
            formData.awards = data.Awards;
            //reformat data for browser display
            var obj = {};
            var arr = [];
            obj.label= data.Title;
            obj.title= data.Title;
            arr.push(obj);
            //send reformatted data
            response(arr);
          }
        });
      },
      minLength: 3,
      select: function(event, ui) {
        //if the item is selected, send the saved API data to the form
        if (ui.item.label) {
          console.log(formData);
        };
    }
  });

  $('.confess').click(function(e){
    e.preventDefault();
    var fdata = {};
    fdata.confession = $('#confession').val();
    fdata.apiData = formData;
    $.ajax({
      url: "/profile",
      method: "POST",
      data: fdata,
      success: function(data) {
        document.location.reload(true);
      }
    });
  });
});
