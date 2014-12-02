
App = {
	init: function refreshData() {
		var endpoint = 'http://10.96.1.159:3000/jawbone';
		$.ajax({
			url: endpoint,
			method: 'GET',
			headers: {
	          'Accept': 'application/json',
	          'Authorization': 'Bearer b6_3pfGGwEi3Q2vrLdoIRfFK59dIENPZEcqJqnkeCcki7I-52Pt9BQwPL5RD418q8EvaJSumcI0GoYT-V9UbpVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP',
	        },
			success: function(data) {
			
				var steps = data.data.items[0].title;
				$('.steps').html(steps);
				console.log("Hi you have new");	
				
			},
			error: function(response) {
				console.log('data error', response);
			}
		});

	//setInterval(refreshData, 50000000);
	}
}
App.init();



