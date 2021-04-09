// @TODO: YOUR CODE HERE!

let svgWidth = 900;
let svgHeight = 500;

var margin = {
    top:75,
    right:75,
    bottom:75,
    left:75
};

// Establish height and width
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Paramaters
let chosenXAxis = "poverty";
let chosenYAxis = "healthcareLow";


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

   
    // set xLinearScale

    // let xLinearScale = xScale(censusData, chosenXAxis);
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) *.5,
    d3.max(censusData, d => d[chosenXAxis]) * 1.5])
    .range([0, width]);

    // set yLinearScale
    // let yLinearScale = yScale(censusData, chosenYAxis);
    let yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) *.5,
    d3.max(censusData, d => d[chosenYAxis]) * 1.5])
    .range([height,0]);



    // create initial axis
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);

    // chartGroup.append("g")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(bottomAxis);

    // append y axis
    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate (${width}, 0)`)
        .call(leftAxis);

    // append y axis
    // chartGroup.append("g")
    //     .call(leftAxis);

    // Step 5: Create Circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis])) // x&y for radius
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "10")  // r = radius
        .attr("fill", "blue")
        .attr("stroke", "white")
        .attr("opacity", ".75")

    
    circlesGroup.append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis])-5)
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "black")
    

    // Setup tooltip
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, -20])
      .html(function(d) {
        return (`${d.state}<br>Poverty(%): ${d.chosenXAxis}<br>Lacks Healthcare(%): ${d.chosenYAxis}`);
      }) 

    // Call tooltip in chartGroup
    chartGroup.call(toolTip);

    // Create event listners fot tooltip
    circlesGroup.on("click", function(data){
        toolTip.show(data,this);
    })
    .on("mouseout", function(data,index){
        toolTip.hide(data);
    })

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 1.4))
        .attr("dy", "2em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2.255}, ${height + 40})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")

    console.log(censusData);
}).catch(function(error) {
    console.log(error);
})


