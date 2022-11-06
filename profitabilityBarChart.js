export default profitabilityBarChart

function profitabilityBarChart(data, container) {
    const margin = ({top: 30, right: 25, bottom: 150, left: 25});
    const width = 1100 - margin.left - margin.right,
          height = 575 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const xScale = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);
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
                    .attr('x', -25)
                    .attr('y', -10);
    var colors = d3.scaleOrdinal()
                    .domain(d3.extent(data, d=>d.LeadStudio))
                    .range(d3.schemeTableau10);

    var leadStudio = new Set(data.map(function(array){return array.LeadStudio;}));;
    var rect = svg.selectAll("rect.label")
        .data(leadStudio)
        .enter()
        .append("rect");
    
    rect.attr("height", 10)
        .attr("width", 10)
        .attr("x", width - 200)
        .attr("y", (d, i) => (i - 0.4) * 25)
        .attr("fill", d => colors(d));
    var labels = svg.selectAll(".text")
        .data(leadStudio)
        .enter()
        .append("text")
    labels.attr("x", width - 175)
        .attr("y", (d, i) => i * 25)
        .text(d => d);

    function update(data) {
        let studioTotal = d3.count(data, d=>d.LeadStudio);
        xScale.domain(data.map(d => d.LeadStudio));
        yScale.domain([0,studioTotal]);
        let format = d3.format('.2f');
        const bars = svg.selectAll('.bar').data(data, d => d.LeadStudio);

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("x", d => xScale(d.LeadStudio))
            .attr("y", d => height)
            .attr("height", d => 0)
            .attr("width", xScale.bandwidth())
            .on("mouseenter", (event, d) => {
                const pos = d3.pointer(event, window);
                d3.select(".tooltip3")
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
                    d3.select(".tooltip3")
                    .style("display", 'none');
                })
                .merge(bars)
                .transition()
                .delay((d,i) => i * 150)
                .duration(1000)
                .attr("x", d => xScale(d.LeadStudio))
                .attr('y', d => yScale(d.Profitability))
                .attr('height', d => height - yScale(d.Profitability))
                .attr('fill', d => colors(d.LeadStudio))
        bars.exit()
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
        yLabel.text("Number of Films Produced");
        xLabel.text("Studio")
        }
    return{
        update
    }
}