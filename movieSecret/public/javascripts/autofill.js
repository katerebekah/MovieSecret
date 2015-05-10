$(function() {
  //create a var to hold API dummy data (just in case it isn't selected) and the real selected data
  var dData = {};
  var formData = {};
  var newInput = '';
  $('.input').autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "http://www.omdbapi.com/?t=" + request.term + "&r=json&callback",
        dataType: "jsonp",
        success: function(data) {
          //save API data (dummy data until item is selected) for later save with the form
          dData.year = data.Year;
          dData.poster = data.Poster;
          dData.awards = data.Awards;
          dData.imdbID = data.imdbID;
          //reformat data for browser display
          var obj = {};
          var arr = [];
          obj.label = data.Title;
          obj.title = data.Title;
          arr.push(obj);
          //send reformatted data
          response(arr);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      if (ui.item.label) {
        //save dummy data to actual form data because the item was selected
        formData = dData;
      }
    }
  });

  //form post submit
  $('.confess').click(function(e) {
    //prevent form posting automatically
    e.preventDefault();
    //create variable to hold all the data to be submitted
    var fdata = {};
    //from the user input
    fdata.confession = $('#confession').val();
    //from the saved API data
    fdata.poster = formData.poster;
    fdata.awards = formData.awards;
    fdata.year = formData.year;
    fdata.imdbID = formData.imdbID;
    //post form and reload page
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
