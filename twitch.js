const gamesArray = [];

function loadTopLine(){

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
			html += '<tr class="table-row-game-data"><td class="table-game-name">' + d.game.name + '<td>' +
					'<td class="table-game.popularity">' + d.game.popularity + '<td>' + 
					'<td class="table-total-viewers">' + d.viewers + '</td>' +
					'<td class="table-total-channels">' + d.channels + '</td>' +
					'<tr>'
		});

		$('.table').html(html);
		}
	});
}


function bubbleChart(){

	$.ajax({
		type: "GET",
		url: 'https://api.twitch.tv/kraken/games/top?limit=30',
		headers: {
			"Client-ID": 'j04u3arfwaaxamhkczfl48egoeh3ncn'
		},
		success: function(data){

			let dataPoints = data.top;
			console.log(dataPoints);

			let graphSelection = d3.select(".graph")
			let width = 960;
			let height = 960;

			// selects the "graph" div on the html page and appends a svg container
		    var svgContainer = graphSelection
		    			.append("svg")
		                .attr("width", width)
		                .attr("height", height)
		                .append("g")
		                .attr("transform", "translate(0,0)");

		    var radiusScale = d3.scaleSqrt().domain([1,300000]).range([10,500])
		    // formats numbers by rounding down. ex 6.2 => 6
			var format = d3.format(",d");

			// the simulation is a collection of forces
			// about where we want our circles to go
			// and how we want our circles to interact
			//STEP ONE: get them to the middle
			// STEP TWO: dont have them collide
			var simulation = d3.forceSimulation()
				.force("x", d3.forceX(width/2).strength(0.05))
				.force("y", d3.forceY(height/2).strength(0.05))
				.force("collide", d3.forceCollide(function(d){
					return radiusScale(d.viewers / 10) + 1;
				}));

			// chooses color scheme for rendering bubbles. more color schemes available.
			var color = d3.scaleOrdinal(d3.schemeCategory20c);


			var circles = svgContainer.selectAll(".node")
			    .data(dataPoints)
			    .enter().append("circle")
			    .attr("class", "games")
			    .attr("r", function(d){
			    	return radiusScale(d.viewers / 10);
			    })
			    .attr("fill",function(d){
			    	return color(d.viewers);
			    })
			    .on("click", function(d){
			    	console.log(d);
			    });


			simulation.nodes(dataPoints)
				.on('tick', ticked);


			function ticked(){
				circles
					.attr("cx", function(d){
						return d.x;
					})
					.attr("cy", function(d){
						return d.y;
					})
			}	
		}
	});
}

loadTopLine();
bubbleChart();
