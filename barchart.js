



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
					'<th>Game</th>' +
					'<th>Popularity</th>' +
					'<th>Viewers</th>' +
					'<th># of Channels</th></tr>';

		gamesList.forEach((d) => {
			html += '<tr class="hover small"><td class="table-game-name">' + d.game.name + '</td>' +
					'<td class="table-game-popularity">' + d.game.popularity + '</td>' + 
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
	let dataset = [];

	// ajax call that gets the list of streamers for each game
	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams?limit=20&game='+gamename,
		type: 'GET',
		headers: {
			'Client-ID': 'j04u3arfwaaxamhkczfl48egoeh3ncn'
		},
		success: function(data){

		data.streams.forEach(function(d) {
				dataset.push(d);
			});

		//sort data based on viewers for each channel
		sortedData = dataset.sort(function(a,b){
			return d3.ascending(a.viewers, b.viewers)
		});

		console.log(sortedData)

		let margin = {top: 20, right: 20, bottom:30, left: 100};
		let width = 900 - margin.left - margin.right;
		let height = 800 - margin.top - margin.bottom;

		let y = d3.scaleBand()
					.range([height, 0])
					.padding(0.1);

		let x = d3.scaleLinear()
				.range([0, width])
	
		let svg = d3.select(".chart")
					.html("")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
    				.attr("height", height + margin.top + margin.bottom)
    				.append("g")
    				.attr("transform", "translate(" + margin.left + "," + margin.top + ")" )


    	// Scale the range of the data in the domains
		x.domain([0, d3.max(sortedData, function(d){ return d.viewers; })])
		y.domain(sortedData.map(function(d) { return d.channel.display_name; }));


		let color = d3.scaleOrdinal(d3.schemeCategory10);


		svg.selectAll(".bar")
		   .data(sortedData)
		   .enter().append("rect")
		   .attr("class", "bar")
		   .attr("width", function(d) {return x(d.viewers); } )
		   .attr("y", function(d) { return y(d.channel.display_name); })
		   .attr("height", y.bandwidth())
		   .attr("fill", function(d){
			    return color(d.viewers);
			})


		// add the x Axis
		svg.append("g")
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(x));

		// add the y Axis
		svg.append("g")
		    .call(d3.axisLeft(y));
		}
	});
});

}


StreamerBarchart()
loadTableData()