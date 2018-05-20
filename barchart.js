const gamesArray = [];

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function loadTableData(){

	$.ajax({
		type: 'GET',
		url: 'https://api.twitch.tv/kraken/games/top?limit=30',
		headers: {
			'Client-ID': 'j04u3arfwaaxamhkczfl48egoeh3ncn'
		},
		success: function(data) {
			
			let newArray = data.top
			gamesArray.push(newArray);
			const gamesList = data.top;

			let html = '<tr class="table-header">' +
						'<th>Game</th>' +
						'<th>Popularity</th>' +
						'<th>Viewers</th>' +
						'<th># of Channels</th></tr>';

			gamesList.forEach((d) => {
				html += '<tr class="hover small"><td class="table-game-name">' + d.game.name + '</td>' +
						'<td class="table-game-popularity">' + numberWithCommas(d.game.popularity) + '</td>' + 
						'<td class="table-total-viewers">' + numberWithCommas(d.viewers) + '</td>' +
						'<td class="table-total-channels">' + numberWithCommas(d.channels) + '</td>' +
						'<tr>'
			});

			$('.table').html(html);
			document.getElementsByClassName("hover")[0].click()
		}
	});
}


function StreamerBarchart(){

	$("body").on("click", ".hover", function(){
		$(".stream-header").empty()
		var gamename = $(this).find('td:first-of-type').html();
		let dataset = [];

		$.ajax({
			url: 'https://api.twitch.tv/kraken/search/games?q='+gamename+'&type=suggest',
			type: 'GET',
			headers: {
				"Client-ID": 'j04u3arfwaaxamhkczfl48egoeh3ncn'
			},
			success: function(data){
				var html = "";
				var html2 = "";
				// Need to loop through gamearray until I match on gamename -- then filter in total viewers + total streamers
				for (var i = 0; i < gamesArray[0].length; i++) {
					if (gamesArray[0][i].game.name === gamename)
						html2 = '<p class="gametitle">Game: '+gamename+'</p>'
								+'<h4>Watching: ' + numberWithCommas(gamesArray[0][i].viewers) +'</h4>'
								+'<h4>Rank: ' + (i+1) + '</h4>'
								+'<h4>Streaming: '+ numberWithCommas(gamesArray[0][i].channels) +'</h4>';
				}
				var pic = data.games[0].box.large;
				html = '<img class="img-circle" src="'+pic+'">';
				$(".header").html(html);
				$(".gamename").html(html2);
			}
		});

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

				let margin = {top: 5, right: 20, bottom:30, left: 100};
				let width = 570 - margin.left - margin.right;
				let height = 660 - margin.top - margin.bottom;

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

		    	$(".stream-header").append(`<h1>${gamename} : Top 20 Streamers</h1>`)


		    	// Scale the range of the data in the domains
				x.domain([0, d3.max(sortedData, function(d){ return d.viewers; })])
				y.domain(sortedData.map(function(d) { return d.channel.display_name; }));


				let color = d3.scaleOrdinal(d3.schemeCategory10);

				var div = d3.select("body").append("div")
				    .attr("class", "tooltip")
				    .style("opacity", 0);


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
				   .on("mouseover", function(d) {
				       div.transition()
				         .duration(200)
				         .style("opacity", .9);
				       div.html("<ul class='tooltip-list'><li><span>Viewers:</span> " + numberWithCommas(d.viewers) + "</li><li><span>Channel:</span> " + d.channel.name + "</li><li><span>Click To View Stream </span></li></ul>")
				         .style("left", (d3.event.pageX) + "px")
				         .style("top", (d3.event.pageY - 28) + "px");
				       })
				    .on("mouseout", function(d) {
				        div.transition()
				        .duration(500)
				        .style("opacity", 0);
				    })
				    .on("click", function(d){
				    	$(".render-stream").html("")
				    	 let channelName = d.channel.name

				    	let url = `https://player.twitch.tv/?channel=${channelName}`

				    	console.log(url)

				    	let iframeRender = document.createElement("iframe")
				    	iframeRender.src = url;
				    	iframeRender.height = 480;
				    	iframeRender.width = 1080;
				    	iframeRender.frameborder = 0;
				    	iframeRender.scrolling = "no";
				    	iframeRender.allowfullscreen = "yes";							

				    	$(".render-stream").append(`<h1><i class="fas fa-circle"></i>Now Streaming: ${channelName}</h1>`)
				    	$(".render-stream").append(iframeRender);
				    });

					// add the x Axis
					svg.append("g")
					    .attr("transform", "translate(0," + height + ")")
					    .call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
					    .call(d3.axisLeft(y));


					function loadInitialStream(){
						const topStreamer = sortedData[sortedData.length - 1].channel.name;
						const url = `https://player.twitch.tv/?channel=${topStreamer}`;

						let iframeRender = document.createElement("iframe")
				    	iframeRender.src = url;
				    	iframeRender.height = 480;
				    	iframeRender.width = 1080;
				    	iframeRender.frameborder = 0;
				    	iframeRender.scrolling = "no";
				    	iframeRender.allowfullscreen = "yes";							

				    	$(".render-stream").append(`<h1><i class="fas fa-circle"></i>Now Streaming: ${topStreamer}</h1>`)
				    	$(".render-stream").append(iframeRender);
					}

					loadInitialStream();
			}
		});
	});
}





loadTableData();
StreamerBarchart();



