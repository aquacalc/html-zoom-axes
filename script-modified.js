// By-pass fetching the csv file
const myData = [
  {
    Petal_Length: "1.7",
    Petal_Width: "0.4",
    Sepal_Length: "5.4",
    Sepal_Width: "3.9",
    Species: "setosa",
  },
  {
    Petal_Length: "4.8",
    Petal_Width: "1.8",
    Sepal_Length: "5.9",
    Sepal_Width: "3.2",
    Species: "versicolor",
  },
  // [NB] Next three are dummy data //
  {
    Petal_Length: "6.0",
    Petal_Width: "1.8",
    Sepal_Length: "6.0",
    Sepal_Width: "2.2",
    Species: "versicolor",
  },
  {
    Petal_Length: "3.0",
    Petal_Width: "1.8",
    Sepal_Length: "3.5",
    Sepal_Width: "2.2",
    Species: "versicolor",
  },
  {
    Petal_Length: "4.5",
    Petal_Width: "1.8",
    Sepal_Length: "4.5",
    Sepal_Width: "2.2",
    Species: "versicolor",
  },
];

// console.log(`myData: `, myData);

// ** -- Set the Dimensions -- ** //

// set the dimensions and margins of the graph
let svgWidth = 460;
let svgHeight = 400;

let margin = { top: 10, right: 30, bottom: 30, left: 60 };

// 460 - 60 - 30 = 370
let width = svgWidth - margin.left - margin.right;

// 400 - 10 - 30 = 360
let height = svgHeight - margin.top - margin.bottom;

// append the SVG object to the body of the page
let SVG = d3
  .select("#dataviz_axisZoom")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add X axis
// [** NB **] ".clamp(true)" breaks the panning!!
let xScale = d3.scaleLinear().domain([0, 8]).range([0, width]);
let xAxis = SVG.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

// Add Y axis
let yScale = d3.scaleLinear().domain([0, 8]).range([height, 0]);
let yAxis = SVG.append("g").call(d3.axisLeft(yScale));

// "Add clipPath: everything OUT of this area won't be drawn"
// (And when the clipPath <g> is outside of the clipPath <rect>...)
let clipRect = SVG.append("defs")
  .append("SVG:clipPath")
  .attr("id", "clipRect")
  .append("SVG:rect")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0);

// Create the scatter variable: where both the circles and the brush take place
// (scatter is the <g> with the clipPath and its denizens)
// [NB] see: https://stackoverflow.com/questions/18697278/how-to-style-svg-g-element
let scatter = SVG.append("g")
  .attr("id", "my-clip-path")
  .attr("clip-path", "url(#clipRect)");

// Add circles
scatter
  .selectAll("circle")
  .data(myData)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d.Sepal_Length))
  .attr("cy", (d) => yScale(d.Petal_Length))
  .attr("r", 8)
  .style("fill", "#61a3a9")
  .style("opacity", 0.5);

// Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
let zoom = d3
  .zoom()
  .scaleExtent([1, 5]) // This control how much you can unzoom (x0.5) and zoom (x20)
  .extent([
    [0, 0],
    [width, height],
  ])
  .translateExtent([
    [0, 0],
    [width, height],
  ])
  .on("zoom", updateChart);

// This add an invisible rect on top of the chart area.
// This rect can recover pointer events: necessary to understand when the user zoom
SVG.append("rect")
  .attr("id", "invisible-rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "#f5f5dc43")
  // .style("fill", "none")
  .style("pointer-events", "all")
  .attr("transform", `translate(${0}, ${0})`)
  .call(zoom);
// now the user can zoom and it will trigger the function called updateChart

// A function that updates the chart when the user zoom and thus new boundaries are available
function updateChart() {
  // recover the new scale
  var newScaleX = d3.event.transform.rescaleX(xScale);
  var newScaleY = d3.event.transform.rescaleY(yScale);

  // update axes with these new boundaries
  xAxis.call(d3.axisBottom(newScaleX));
  yAxis.call(d3.axisLeft(newScaleY));

  // update circle position
  scatter
    .selectAll("circle")
    .attr("cx", (d) => newScaleX(d.Sepal_Length))
    .attr("cy", (d) => newScaleY(d.Petal_Length));
}
