$(document).ready(function(){
	
	// User clicked on an edit button
	$(".editButton").click(function () {
	  window.location.href = "/confession/" + $(this)[0].id;
	});

	// User clicked on a delete button
	$(".deleteButton").click(function () {
	  var confessionID = $(this)[0].id;

	  $.ajax({
	    url: "/confession",
	    method: "DELETE",
	    data: {
	      confession: confessionID
	    },
	    success: function (response) {
	      $("#confession_"+confessionID).remove();  // Remove the DOM element on success
	    }
	  });
	});



});