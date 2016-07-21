// margins
var margin = {top: 20, right: 80, bottom: 50, left: 70},
    width = 860 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// define scales
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// define axis
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .tickFormat(d3.format("d"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .ticks(5);

// define colors
var color = d3.scale.ordinal()
.domain([])
.range([]);

// define line
var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.station_id); })
    .y(function(d) { return y(d.variable);})
    .defined(function(d) { return d.variable!=0; });;

// create responsive svg
var svgRed = d3.select("#red-chart")
    .append("div")
    .classed("svg-container-line", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 800 500")
    //class to make it responsive
    .classed("svg-content-responsive", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgGold = d3.select("#gold-chart")
    .append("div")
    .classed("svg-container-line", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 800 500")
    //class to make it responsive
    .classed("svg-content-responsive", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgBlue = d3.select("#blue-chart")
    .append("div")
    .classed("svg-container-line", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 800 500")
    //class to make it responsive
    .classed("svg-content-responsive", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgGreen = d3.select("#green-chart")
    .append("div")
    .classed("svg-container-line", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 800 500")
    //class to make it responsive
    .classed("svg-content-responsive", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // load red data
    d3.json('../data/marta.json', function(error, data) {
      if (error) {throw error;}

      var stationNamesRed = [];

      data.filter(function(d) {
        if (Array.isArray(d.line)) {
          return d.line.indexOf("red") > -1;
        }
        return d.line === "red";
      })
      .forEach(function(d) {
        stationNamesRed.push(d.station_id);
      })

     var yearList = ['1970', '1980', '1990', '2000', '2010']

        var stationsRed = yearList.map(function(year, i) {
        return {
          year: year,
          values: data.map(function(d) {
            return {
              year: year,
              station: d.station,
              station_id: d.station_id,
              variable: d.median_family_income[i]
            }
          })
        };
      });

      console.log(stationsRed)

      // x and y domains
      x.domain(d3.extent(data, function(d) { return d.station_id;}));

      y.domain([
        d3.min(stationsRed, function(c) { return d3.min(c.values, function(v) { return v.variable; }); }),
        d3.max(stationsRed, function(c) { return d3.max(c.values, function(v) { return v.variable; }); })
      ]);

      // draw chart
      svgRed.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svgRed.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "translate(170)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Median family income (USD)");

      var stationRed = svgRed.selectAll(".station")
          .data(stationsRed)
        .enter().append("g")
          .attr("class", "station");

      // draw line
      stationRed.append("path")
          .attr("class", function(d) { return "line year" + d.year; })
          .attr("d", function(d) { return line(d.values); })
          .style("fill", "none");

      stationRed.selectAll(".station")
          .data(function(d) {
              return d.values.filter(function(j) { return !isNaN(j.variable) });
          })
      		.enter().append("circle")
            .attr("class", function(d) { return "dot year" + d.year; })
      	    .attr("r", 3)
            .attr("cx", line.x())
            .attr("cy", line.y())
            // .defined(function(d) { return !isNaN(d.homeruns); })
            .on('mouseover', onmouseoverRed)
            .on('mouseout', onmouseoutRed);
});

function onmouseoverRed(d, i) {
    var blurb = '<div class="show-for-large-up"><h6>' + d.station + ' </h6><b>' + d.year + ':</b> ' + (d.variable).toLocaleString();
    // + d.values[0].year + ':</b> ' + (d.values[0].variable).toLocaleString() + '<br/><b>' + d.values[1].year + ':</b> ' + (d.values[1].variable).toLocaleString() + '<br/><b>' + d.values[2].year + ':</b> ' + (d.values[2].variable).toLocaleString() + '<br/><b>' + d.values[3].year + ':</b> ' + (d.values[3].variable).toLocaleString() + '<br/><b>' + d.values[4].year + ':</b> ' + (d.values[4].variable).toLocaleString() + '</div><div class="hide-for-large-up"><h6>' + d.name + ' </h6><b>' + d.values[0].year + ':</b> ' + (d.values[0].variable).toLocaleString() + ' <b>' + d.values[1].year + ':</b> ' + (d.values[1].variable).toLocaleString() + ' <b>' + d.values[2].year + ':</b> ' + (d.values[2].variable).toLocaleString() + ' <b>' + d.values[3].year + ':</b> ' + (d.values[3].variable).toLocaleString() + ' <b>' + d.values[4].year + ':</b> ' + (d.values[4].variable).toLocaleString() + '</div>';
    $("#red-blurb-default").hide();
    $("#red-blurb").html(blurb);
    console.log("mouseover working");
    // $('.line').fadeTo("fast", 0.33);
    // $(this).fadeTo("fast", 1.0);
}

function onmouseoutRed(d, i) {
    $("#red-blurb-default").show();
    $("#red-blurb").html('');
    // $('.line').fadeTo("fast", 1.0);
}
