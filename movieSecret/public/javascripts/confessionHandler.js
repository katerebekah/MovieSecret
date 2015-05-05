$(document).ready(function(){
	
	// User clicked on an edit button
	$(".editButton").click(function () {
	  var confessionID = $(this)[0].id;
			  console.log("edit button has fired client side")
	  window.location.href = "/profile/" + confessionID;
	});

	// User clicked on a delete button
	$(".deleteButton").click(function () {

	  var confessionID = $(this)[0].id;
	  console.log(confessionID);

	  $.ajax({
	    url: "/profile",
	    method: "DELETE",
	    data: {
	      confession: confessionID
	    },
	    success: function (response) {
	      $("#"+confessionID).remove();  // Remove the DOM element on success
	    }
	  });
	});



});