// @TODO: YOUR CODE HERE!

let svgWidth = 960;
let svgHeight = 500;

var margin = {
    top:100,
    right:100,
    bottom:100,
    left:100
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
let chosenYAxis = "healthcare";

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
        .domain([0, d3.max(censusData , d => d.poverty)])
        .range([0,width])

    // set yLinearScale
    // let yLinearScale = yScale(censusData, chosenYAxis);
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);


    // create initial axis
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    // let xAxis = chartGroup.append("g")
    //     .classed("x-axis", true)
    //     .attr("transform", `translate(0,${height})`)
    //     .call(bottomAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    // let yAxis = chartGroup.append("g")
    //     .classed("y-axis", true)
    //     .attr("transform", `translate (${width}, 0)`)
    //     .call(leftAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty)) // x&y for radius
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")  // r = radius
        .attr("fill", "blue")
        .attr("stroke", "white")
        .attr("opacity", ".5")
    // // circlesGroup.append("text")
    //     .attr("dx", d => 20)
    //     .attr("stroke", "white")
    //     .text(d => d.abbr);




    //     .attr({
    //         "text-anchor": "middle",
    //         "font-size": function(d) {
    //           return d.r / ((d.r * 10) / 100);
    //         },
    //         "dy": function(d) {
    //           return d.r / ((d.r * 25) / 100);
    //         }
    //       });


    // Setup tooltip
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty(%): ${d.poverty}<br>Healthcare(%): ${d.healthcare}`);
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
        .attr("y", 0 - margin.left + 45)
        .attr("x", 0 - (height / 1.75))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare(%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2.255}, ${height + 40})`)
        .attr("class", "axisText")
        .text("Poverty (%)")

    console.log(censusData);
}).catch(function(error) {
    console.log(error);
})

