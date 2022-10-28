export default individualBarChart

function individualBarChart(container) {
    const margin = ({top: 30, right: 50, bottom: 150, left: 50});
    const width = 1250 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;
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
    var yLabel = svg.append("text")
                    .attr("class", "y-axis-title")
                    .attr('x', -50)
                    .attr('y', -10);
    function update(data) {
        console.log("in update");
        data.sort((b, a) => a.Profitability - b.Profitability);
        xScale.domain(data.map(d => d.Film));
        yScale.domain([0, d3.max(data, d => d.Profitability)]);
        const bars = svg.selectAll('.bar')
                        .data(data, d => d.Film);
        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("x", d => xScale(d.Film))
            .attr("y", d => height)
            .attr("height", d => 0)
            .attr("width", xScale.bandwidth())
            .merge(bars)
            .transition()
            .delay((d,i) => i * 150)
            .duration(1000)
            .attr("x", d => xScale(d.Film))
            .attr('y', d => yScale(d.Profitability))
            .attr('height', d => height - yScale(d.Profitability));
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
        yLabel.text("Profitability");
    }
  return {
    update
  }
}