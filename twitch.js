const gamesArray = [];


function loadSummaryTest(){
	$.ajax({
		url: "https://api.twitch.tv/kraken/streams/summary",
		method: "GET",
		headers: {
			'Client-ID': 'j04u3arfwaaxamhkczfl48egoeh3ncn'
		},
		success: function(data){
			// console.log(data)
		}

	});
}


function loadBubbleChart(){

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
			let width = 1200;
			let height = 1200;




			// selects the "graph" div on the html page and appends a svg container
		    let svgContainer = graphSelection
		    			.append("svg")
		                .attr("width", width)
		                .attr("height", height)
		                .append("g")
		                .attr("transform", "translate(0,0)");


		    let radiusScale = d3.scaleSqrt().domain([1,300000]).range([10,800])
		    // formats numbers by rounding down. ex 6.2 => 6
			let format = d3.format(",d");

			// the simulation is a collection of forces
			// about where we want our circles to go
			// and how we want our circles to interact


			var forceXSeperate = d3.forceX(function(d){
				if (d.game.viewers > 10000){
					return 150
				}else {
					return 750
				}
			}).strength(0.05);

			var forceXCombine = d3.forceX(width / 2 ).strength(0.05);


			var forceY = d3.forceY(function(d){
				return height / 2;
			}).strength(0.05);

			var forceCollide = d3.forceCollide(function(d){
				return radiusScale(d.viewers / 10)
			})

			let simulation = d3.forceSimulation()
				.force("x", forceXCombine )
				.force("y", forceY )
				.force("collide", forceCollide)
				

			// chooses color scheme for rendering bubbles. more color schemes available.
			let color = d3.scaleOrdinal(d3.schemeCategory10);


			let circles = svgContainer.selectAll(".node")
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
			    })


			d3.select("#decade").on("click", function(){
				simulation
					.force("x", forceXSeperate)
					.alphaTarget(0.5)
					.restart()
			})

			d3.select("#combine").on("click", function(){
				simulation
					.force("x", forceXCombine)
					.alphaTarget(0.05)
					.restart()
			})


			let texts = svgContainer.selectAll(null)
				.data(dataPoints)
				.enter()
				.append("g")

			texts.append("text")
				.attr("text-anchor", "middle")
				.each(function(d){
					let arr = d.game.name.split(" ");
					d3.select(this).selectAll(null)
						.data(arr)
						.enter()
						.append("tspan")
						.attr("text-anchor", "middle")
						.attr("x", 0)
						.attr("y", function(d, i, nodes){
							 return 13 + (i - nodes.length / 2 - 0.5) * 10;
						})


					.text(String)

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

				texts.attr("transform", function(d) {
				    return "translate(" + d.x + "," + d.y + ")"
				  })
			}	
		}
	});
}


loadBubbleChart();
loadSummaryTest();





// var node = svg.selectAll(“.node”)
//    .data(pack(root).leaves())
//    .enter().append(“g”)
//      .attr(“class”, “node”)
//      .attr(“transform”, function(d) { return “translate(” + d.x + “,” + d.y + “)”; })
//      .on(“click”, function(d) {
//          alert(“on click” + d.className);
//      });

//  node.append(“circle”)
//      .attr(“id”, function(d) { return d.id; })
//      .attr(“r”, function(d) { return d.r; })
//      .style(“fill”, function(d) { return color(Math.random()); });

//  node.append(“clipPath”)
//      .attr(“id”, function(d) { return “clip-” + d.id; })
//    .append(“use”)
//      .attr(“xlink:href”, function(d) { return “#” + d.id; });

//  node.append(“text”)
//      .attr(“clip-path”, function(d) { return “url(#clip-” + d.id + “)”; })
//    .selectAll(“tspan”)
//    .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
//    .enter().append(“tspan”)
//      .attr(“x”, 0)
//      .attr(“y”, function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
//      .text(function(d) { return d; });

//  node.append(“title”)
//      .text(function(d) { return d.id + “\n” + format(d.value); });

// });
