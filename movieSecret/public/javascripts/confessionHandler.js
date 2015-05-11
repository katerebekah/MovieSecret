$(document).ready(function(){
	
	// User clicked on an edit button
	$(".editButton").click(function () {
	  var confessionID = this.id;
	  window.location.href = "/profile/" + confessionID;
	});

	// User clicked on a delete button
	$(".deleteButton").click(function () {

	  var confessionID = this.id;

	  $.ajax({
	    url: "/profile",
	    method: "DELETE",
	    data: {
	      _id: confessionID
	    },
	    success: function (response) {
	      $("#"+confessionID).remove();  // Remove the DOM element on success
	    }
	  });
	});



});