// @TODO: YOUR CODE HERE!

let svgWidth = 960;
let svgHeight = 500;

var margin = {
    top:40,
    right:40,
    bottom:40,
    left:40
};

// Establish height and width
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Paramaters
let chosenXAxis = "In Poverty(%)";
let chosenYAxis = "Lacks Healthcare(%)";

// Retrieve data from CSV
d3.csv("assets/data/data.csv").then(function(censusData, err){
    if (err) throw err;

    // Parse Data to make sure all are integers
    censusData.forEach(function(data){
        data.poverty = parseInt(data.poverty);
        data.povertyMoe = parseInt(data.povertyMoe);
        data.age = parseInt(data.age);
        data.ageMoe = parseInt(data.ageMoe);
        data.income = parseInt(data.income);
        data.incomeMoe = parseInt(data.incomeMoe);
        data.healthcare = parseInt(data.healthcare);
        data.healthcareLow = parseInt(data.healthcareLow);
        data.healthcareHigh = parseInt(data.healthcareHigh);
        data.obesity = parseInt(data.obesity);
        data.obesityLow = parseInt(data.obesityLow);
        data.obesityHigh = parseInt(data.obesityHigh);
        data.smokes = parseInt(data.smokes);
        data.smokesLow = parseInt(data.smokesLow);
        data.smokesHigh = parseInt(data.smokesHigh);
    });

    console.log(censusData);
}).catch(function(error) {
    console.log(error);
})