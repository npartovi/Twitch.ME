



function loadTableData(){

	$.ajax({
		type: 'GET',
		url: 'https://api.twitch.tv/kraken/games/top?limit=30',
		headers: {
			'Client-ID': 'j04u3arfwaaxamhkczfl48egoeh3ncn'
		},
		success: function(data) {
		
		gamesArray.push(data.top);
		const gamesList = data.top;

		let html = '<tr class="table-header">' +
					'<td>Game</td>' +
					'<td>Popularity</td>' +
					'<td>Viewers</td>' +
					'<td># of Channels</td></tr>';

		gamesList.forEach((d) => {
			html += '<tr class="hover small"><td class="table-game-name">' + d.game.name + '<td>' +
					'<td class="table-game-popularity">' + d.game.popularity + '<td>' + 
					'<td class="table-total-viewers">' + d.viewers + '</td>' +
					'<td class="table-total-channels">' + d.channels + '</td>' +
					'<tr>'
		});

		$('.table').html(html);
		}
	});
}





function StreamerBarchart(){

$("body").on("click", ".hover", function(){
	var gamename = $(this).find('td:first-of-type').html();

	// ajax call that gets the list of streamers for each game
	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams?limit=20&game='+gamename,
		type: 'GET',
		headers: {
			'Client-ID': 'j04u3arfwaaxamhkczfl48egoeh3ncn'
		},
		success: function(data){

		let dataset = [];

		data.streams.forEach(function(d) {
				dataset.push(d);
			});

		//sort data based on viewers for each channel
		data = dataset.sort(function(a,b){
			return d3.descending(a.viewers, b.viewers)
		});

		let margin = {
			top: 15,
			right: 25,
			bottom: 15,
			left: 60
		};

		let width = 960 - margin.left - margin.right;
		let height = 500 - margin.top - margin-bottom;

		let svg = d3.select(".chart")
				    .append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		let x = 






		console.log(data)

















		// //Channel name var to join
		// var channel = d => d.channel.name;

		// console.log(channel)


		}
	});
});

}

// var width = 600;
// var height = 545;
// var padding = 120;
// var paddinglight = 0;


// //Create SVG element

// var svg = d3.select(".chart")
// 			.append("svg")
// 			.attr("width", width)
// 			.attr("height", height);

StreamerBarchart()
loadTableData()