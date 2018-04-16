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
			console.log(dataPoints)

			let graphSelection = d3.select(".graph")
			let width = 960
			let height = 960

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
				}))

			// chooses color scheme for rendering bubbles. more color schemes available.
			var color = d3.scaleOrdinal(d3.schemeCategory20c);


			var circles = svgContainer.selectAll(".node")
			    .data(dataPoints)
			    .enter().append("circle")
			    .attr("class", "artist")
			    .attr("r", function(d){
			    	return radiusScale(d.viewers / 10)
			    })
			    .attr("fill", "lightblue")
			    .on("click", function(d){
			    	console.log(d)
			    })

			simulation.nodes(dataPoints)
				.on('tick', ticked)


			function ticked(){
				circles
					.attr("cx", function(d){
						return d.x
					})
					.attr("cy", function(d){
						return d.y
					})
			}

			 


			    



			

		}
	});






	// var graphSelection = d3.select(".graph")

	// // selects the "graph" div on the html page and appends a svg container
 //    var svgContainer = graphSelection
 //    			.append("svg")
 //                .attr("width", 960)
 //                .attr("height", 960);

 //    // formats numbers by rounding down. ex 6.2 => 6
	// var format = d3.format(",d");

	// // chooses color scheme for rendering bubbles. more color schemes available.
	// var color = d3.scaleOrdinal(d3.schemeCategory20c);

	// var node = svgContainer.selectAll("p")
	//     .data(data)
	//     .enter()
	//     .append("p")

	// console.log(gamesArray)


	// var pack = d3.pack()
	//     .size([960, 960])
	//     .padding(1.5);

	// d3.csv("flare.csv", function(d) {
	//   d.value = +d.value;
	//   if (d.value) return d;
	// }, function(error, classes) {
	//   if (error) throw error;

	//   var root = d3.hierarchy({children: classes})
	//       .sum(function(d) { return d.value; })
	//       .each(function(d) {
	//         if (id = d.data.id) {
	//           var id, i = id.lastIndexOf(".");
	//           d.id = id;
	//           d.package = id.slice(0, i);
	//           d.class = id.slice(i + 1);
	//         }
	//       });

	 
	      // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  // node.append("circle")
	  //     .attr("id", function(d) { return d.id; })
	  //     .attr("r", function(d) { return d.r; })
	  //     .style("fill", function(d) { return color(d.package); });

	  // node.append("clipPath")
	  //     .attr("id", function(d) { return "clip-" + d.id; })
	  //   .append("use")
	  //     .attr("xlink:href", function(d) { return "#" + d.id; });

	  // node.append("text")
	  //     .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
	  //   .selectAll("tspan")
	  //   .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
	  //   .enter().append("tspan")
	  //     .attr("x", 0)
	  //     .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
	  //     .text(function(d) { return d; });

	  // node.append("title")
	  //     .text(function(d) { return d.id + "\n" + format(d.value); });





	// });

}

loadTopLine();
bubbleChart();
