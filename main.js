import individualBarChart from "./individualBarChart.js";
import individualScatterPlot from "./individualScatterPlot.js";
import individualScatterPlot2 from "./individualScatterPlot2.js";
import profitabilityBarChart from "./profitabilityBarChart.js";

var year = 2007;

d3.csv("./HollywoodsMostProfitableStories.csv", d3.autoType).then(data=>{
    const firstChart = individualBarChart(data, ".chart-container1");
    var selected = data.filter(data => data.Year == year);
    firstChart.update(selected)

    const secondChart = individualScatterPlot(data, ".chart-container2");
    var selected = data.filter(data => data.Year == year);
    secondChart.update(selected)


    const thirdChart = individualScatterPlot2(data, ".chart-container3");
    var selected = data.filter(data => data.Year == year);
    thirdChart.update(selected)

    const fourthChart = profitabilityBarChart(data, ".chart-container4");
    var selected = data.filter(data => data.Year == year);
    fourthChart.update(selected)

    d3.select('#year').on("change", (event) => {year = d3.select('#year').node().value;
                                                var selected = data.filter(data => data.Year == year)
                                                firstChart.update(selected);
                                                secondChart.update(selected);
                                                thirdChart.update(selected);
                                                fourthChart.update(selected);})

})