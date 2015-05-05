$(document).ready(function(){
	
	// User clicked on an edit button
	$(".editButton").click(function () {
	  var confessionID = $(this)[0].id;
	  console.log(confessionID)
			  console.log("edit button has fired client side")
	  window.location.href = "/profile/" + confessionID;
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