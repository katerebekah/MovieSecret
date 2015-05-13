$(document).ready(function(){
	
	var oButton = $('.oButton');
	var xButton = $('.xButton');

	oButton.click(function(){
		var confessionID = this.id;
		console.log("obutton fired and this is the id", confessionID)
		$.ajax({
			url: '/o',
			method: "POST",
			data: {
				_id: confessionID
			},
			success: function (response) {
        window.location.href = "/#" + confessionID;
			}
		});
	});

	xButton.click(function(){
		var confessionID = this.id;
		console.log("xbutton fired and this is the id", confessionID);
		$.ajax({
			url: '/x',
			method: "POST",
			data: {
				_id: confessionID
			},
			success: function (response) {
        window.location.href = "/#" + confessionID;
			}
		});
	});

});