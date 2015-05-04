$(document).ready(function(){
	
	var oButton = $('.oButton');
	var xButton = $('.xButton');
	var oCount = 0;
	var xCount = 0;

	oButton.click(function(){
		var confessionID = $this[0].id;

		$.ajax({
			url: '/confession/'+confessionID,
			method: "PUT",
			data: {
				confession: confessionID
			},
			success: function (response) {
				oCount++;
			}
		});
	});

	xButton.click(function(){
		var confessionID = $this[0].id;

		$.ajax({
			url: '/confession/'+confessionID,
			method: "PUT",
			data: {
				confession: confessionID
			},
			success: function (response) {
				xCount++;
			}
		});
	});

});