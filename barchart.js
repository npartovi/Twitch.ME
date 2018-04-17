



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
		sortedData = dataset.sort(function(a,b){
			return d3.descending(a.viewers, b.viewers)
		});

		console.log(sortedData)


		let margin = {top: 20, right: 20, bottom:30, left: 40};
		let width = 960 - margin.left - margin.right;
		let height = 500 - margin.top - margin.bottom;

		let y = d3.scaleBand()
					.range([height, 0])
					.padding(0.1);

		let x = d3.scaleLinear()
				.range([0, width])






		

				  












		}
	});
});

}


StreamerBarchart()
loadTableData()