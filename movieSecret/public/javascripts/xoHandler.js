$(document).ready(function(){
	
	var oButton = $('.oButton');
	var xButton = $('.xButton');

	oButton.click(function(){
		var confessionID = this.id;

		$.ajax({
			url: '/o',
			method: "POST",
			data: {
				_id confessionID
			},
			success: function (response) {
			}
		});
	});

	xButton.click(function(){
		var confessionID = this.id;

		$.ajax({
			url: '/x',
			method: "POST",
			data: {
				_id: confessionID
			},
			success: function (response) {
			}
		});
	});

});