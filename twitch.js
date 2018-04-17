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

			let color = d3.scaleOrdinal(d3.schemeCategory10);

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
			    .on("mouseenter", function(d){
			    	d3.selectAll("circle").style('opacity', 0.3);
			    	let mouseNode = d3.select(this)
			    	mouseNode.style('opacity', 1)
			    	mouseNode.transition().duration(200).delay(100).attr('r', 200);
			    	mouseNode.style('stroke-width', 5)
			    	d3.selectAll("text").attr("visibility", "hidden")
						setTimeout(function(){if(mouseNode.style("opacity") == 1){
							display_data(d, selectedNode);
						}}, 200)

			    })
			    .on('mouseleave', function(d){
						d3.select(this).transition().duration(200).delay(0).attr('r', function(d){
							return radiusScale(d.viewers / 10);
						});
						d3.select(this).style('stroke-width', 1);
						d3.selectAll("circle").style('opacity', 0.95);
						d3.selectAll("text").attr("visibility","visible");
						
					});


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
