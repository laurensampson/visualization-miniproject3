import individualBarChart from "./individualBarChart.js";

var year = 2007;

d3.csv("./HollywoodsMostProfitableStories.csv", d3.autoType).then(data=>{
    const firstChart = individualBarChart(data, ".chart-container1");
    var selected = data.filter(data => data.Year == year);
    firstChart.update(selected)
    d3.select('#year').on("change", (event) => {year = d3.select('#year').node().value;
                                                var selected = data.filter(data => data.Year == year)
                                                console.log(selected);
                                                firstChart.update(selected);})
})