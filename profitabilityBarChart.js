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

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale)
                  .ticks(4);
    
    var drawY = svg.append('g')
                   .attr('class', 'axis y-axis')
    var drawX = svg.append('g')
                   .attr('class', 'axis x-axis')
                   .attr("transform", `translate(0, ${height})`)
   
   var xLabel = svg.append("text")
                    .attr("class", "x-axis-title")
                    .attr('x', width-50)
                    .attr('y', height+40);
    var yLabel = svg.append("text")
                    .attr("class", "y-axis-title")
                    .attr('x', -25)
                    .attr('y', -10);

    var leadStudio = new Set(data.map(function(array){return array.LeadStudio;}));;
    console.log(leadStudio);

    function update(data) {
        var studioCount = new Object();
        leadStudio.forEach(element => {
          studioCount[element] = data.filter(obj => obj.LeadStudio == element).length;
        })
        const values = Object.values(studioCount);
        const max = Math.max(...values);
        var items = Object.keys(studioCount).map((key) => {return [key, studioCount[key]]});
        items.sort((first, second) => second[1] - first[1]);
        var keys = items.map((e) => e[0]);
        yScale.domain([0, max]);
        xScale.domain(keys);
        let bars = svg.selectAll(".bar")
                      .remove()
                      .exit()
                      .data(data, d => d.LeadStudio);
        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("x", d => xScale(d.LeadStudio))
            .attr("y", d => height)
            .attr("height", d => 0)
            .attr("width", xScale.bandwidth())
            .merge(bars)
            .transition()
            .duration(2000)
            .attr("x", d => xScale(d.LeadStudio))
            .attr("y", d => yScale(studioCount[d.LeadStudio]))
            .attr('height', d => height - yScale(studioCount[d.LeadStudio]))
            .attr("fill", d3.schemeTableau10[0]);
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