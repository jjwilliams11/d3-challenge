// @TODO: YOUR CODE HERE!

let svgWidth = 900;
let svgHeight = 500;

var margin = {
    top:25,
    right:25,
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
let chosenYAxis = "healthcareLow";




// function to change X Axis Scale
function xScale(censusData, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) *.5,
    d3.max(censusData, d => d[chosenXAxis]) * 1.5])
    .range([0, width]);
  
    return xLinearScale;
  
  }

// function to change X Axis
function changeXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(500)
      .call(bottomAxis);
  
    return xAxis;
  }

// // function to change circles from X Axis
function changeXCircles(circlesGroup , newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(500)
        .attr("cx", d => newXScale(d[chosenXAxis]));
      
    circlesGroup.append("text")
        .attr("dx", d => newXScale(d[chosenXAxis])-5);

    return circlesGroup;
    
}

// function to change Y Axis Scale
function yScale(censusData, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) *.5,
    d3.max(censusData, d => d[chosenYAxis]) * 1.5])
    .range([height,0]);
  
    return yLinearScale;
  
  }

// function to change Y Axis
function changeYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(500)
      .call(leftAxis);
  
    return yAxis;
  }


function changeToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    let xlabel;
    let ylabel;

    if (chosenXAxis === "poverty") {
        xlabel = "Poverty (%):";
    }
    else if(chosenXAxis === "age") {
        xlabel = "Age(Median):";
    }
    else {
        xlabel = "Household Income(Median):";
    }

    if (chosenYAxis === "healthcareLow") {
        ylabel = "Lacks Healthcare(%):";
    }
    else if(chosenYAxis === "smokes") {
        ylabel = "Smokes (%):";
    }
    else {
        ylabel = "Obesity (%):";
    }

    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, -20])
        .html(function(d) {
        return (`${d.state}<br>
            ${xlabel} ${d[chosenXAxis]}<br>
            ${ylabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    // Create event listners on the circle for tooltip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data,this);
    })
    .on("mouseout", function(data,index){
        toolTip.hide(data);
    })
    // Create event listners on the text for tooltip  
    circlesGroup.selectAll("text").on("mouseover", function(data){
        toolTip.show(data,this);
    })
    .on("mouseout", function(data,index){
        toolTip.hide(data);
    })

    return circlesGroup;
}

// function to change circles from Y Axis
function changeYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(500)
        .attr("cy", d => newYScale(d[chosenYAxis]))
      
    circlesGroup.append("text")
        .attr("dy", d => newYScale(d[chosenYAxis])+3)

    return circlesGroup;
  }


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
    let xLinearScale = xScale(censusData, chosenXAxis);

    // set yLinearScale
    let yLinearScale = yScale(censusData, chosenYAxis);


    // create initial axis
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);


    // append y axis
    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate (0)`)
        .call(leftAxis);

 

    // Step 5: Create Circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis])) 
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")  // r = radius
        .attr("fill", "blue")
        .attr("stroke", "white")
        .attr("opacity", ".75")
        
    
    circlesGroup.append("text")
        .attr("dx", d => xLinearScale(d[chosenXAxis])-5)
        .attr("dy", d => yLinearScale(d[chosenYAxis])+3)
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", ".5em")
        .attr("fill", "white");

    
    // Estable X-axis labels and groups
    let XaxisLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2.255}, ${height + 40})`);

    let povertyLabel = XaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)")

    let ageLabel = XaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)")

    let incomeLabel = XaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)")


    // Estable Y-axis labels and groups
    let YaxisLabels = chartGroup.append("g")
    .attr("transform", `translate(${width - width}, ${height / 2})`);

    let healthcareLabel = YaxisLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -30)
        .attr("value", "healthcareLow")
        .classed("active", true)
        .text("Lacks Healthcare(%)")

    let smokesLabel = YaxisLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -50)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)")

    let obesityLabel = YaxisLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -70)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obesity (%)")
    

    changeToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    XaxisLabels.selectAll("text")
        .on("click", function() {
        // get value of selection
        let xvalue = d3.select(this).attr("value");
        if (xvalue !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = xvalue;

            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = changeXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = changeXCircles(circlesGroup, xLinearScale, chosenXAxis);

            // // updates tooltips with new info
            circlesGroup = changeToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });


    // y axis labels event listener
    YaxisLabels.selectAll("text")
        .on("click", function(){

         // get value of selection
         let yvalue = d3.select(this).attr("value");
         if (yvalue !== chosenYAxis) {
 
         // replaces chosenXAxis with value
         chosenYAxis = yvalue;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = changeYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = changeYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = changeToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcareLow") {
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }
        });
    

    console.log(censusData);
}).catch(function(error) {
    console.log(error);
})




