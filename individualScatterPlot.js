export default individualScatterPlot

function individualScatterPlot(data, container) {
    const margin = ({top: 30, right: 25, bottom: 40, left: 50});
    const width = 550  - margin.left - margin.right,
          height = 475  - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleLinear()
                     .range([0, width]);
    const yScale = d3.scaleLinear()
                     .range([height, 0]);

    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)

    var drawY = svg.append('g')
                   .attr('class', 'axis y-axis')
    var drawX = svg.append('g')
                   .attr('class', 'axis x-axis')
                   .attr("transform", `translate(0, ${height})`)

    var xLabel = svg.append("text")
                    .attr("class", "x-axis-title")
                    .attr('x', width-120)
		            .attr('y', height+40);
    var yLabel = svg.append("text")
                    .attr("class", "y-axis-title")
                    .attr('x', 80)
                    .attr('y', 35)
                    .attr('text-anchor', 'end')
                    .attr('alignment-baseline', 'baseline')
                    .attr("transform", `rotate(${90})`);

    var colors = d3.scaleOrdinal()
                    .domain(d3.extent(data, d=>d.Genre))
                    .range(d3.schemeTableau10);

    var genre = new Set(data.map(function(array){return array.Genre;}));
    var rectangles = svg.selectAll("rect.label")
                        .data(genre)
                        .enter()
                        .append("rect")
    rectangles.attr("height", 10)
              .attr("width", 10)
              .attr("x", width - 110)
              .attr("y", (d, i) => i * 25 + 240)
              .attr("fill", d => colors(d))
    var labels = svg.selectAll(".text")
                    .data(genre)
                    .enter()
                    .append("text")
    labels.attr("x", width - 95)
          .attr("y", (d, i) => i * 25 + 250)
          .text(d => d);

    function update(data) {
        let scoreMin = d3.min(data, d => d.RottenTomatoes),
            scoreMax = d3.max(data, d => d.RottenTomatoes);
        xScale.domain([scoreMin, scoreMax]);

        let profitMin = d3.min(data, d => d.Profitability),
            profitMax = d3.max(data, d => d.Profitability);
        yScale.domain([profitMin, profitMax]);

        let format = d3.format('.2f');

        const circles = svg.selectAll('circle')
                            .data(data);

        circles.enter()
            .append('circle')
            .attr('class', 'circles')
            .attr('r', 5)
            .merge(circles)
            .attr("cx", d => xScale(d.RottenTomatoes))
            .attr("cy", d => yScale(d.Profitability))
            .attr("fill", d => colors(d.Genre))
            .attr("stroke", '#757575')
            .on("mouseenter", (event, d) => {
                const pos = d3.pointer(event, window);
                d3.select(".tooltip2")
                  .style("display", 'block')
                  .style("left", pos[0] + 10 + "px")
                  .style("top", pos[1] - 700 + "px")
                  .html(`<p>Film: ${d.Film}<\p>
                  <p>Genre: ${d.Genre}<\p>
                  <p>Profitability: ${format(d.Profitability)}<\p>
                  <p>Rotten Tomatoes: ${d.RottenTomatoes}<\p>
                  <p>Lead Studio: ${d.LeadStudio}<\p>
                  <p>Worldwide Gross: ${format(d.WorldwideGross)}<\p>`);
              })
             .on("mouseleave", (event, d) => {
                 d3.select(".tooltip2")
                   .style("display", 'none');
              })
            .transition()
            .delay((d,i) => i * 150)
            .duration(1000)

        circles.exit()
            .remove();

        drawX.transition()
             .duration(1000)
             .call(xAxis)
             .selectAll("text")
             .attr("transform", "rotate(-45)")
             .style("text-anchor", "end");

        drawY.transition()
             .duration(1000)
             .call(yAxis);
             
        xLabel.text("Rotten Tomatoes");
        yLabel.text("Profitability");
    }

  return {
    update
  }
  
}