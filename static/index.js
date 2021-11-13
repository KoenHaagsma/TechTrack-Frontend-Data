const margin = { top: 40, bottom: 10, left: 120, right: 20 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element
// Adds a <svg> to <body>
const svg = d3
    .select('body') // Select body
    .append('svg') // Append the svg to the body
    .attr('width', width + margin.left + margin.right) // Add a width to the svg
    .attr('height', height + margin.top + margin.bottom); // add a height to the svg

// Group used to enforce margin
const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`); // Setup the margin

// Global variable for all data
let data; // ??

// Scales setup
const xscale = d3.scaleLinear().range([0, width]); // Setup x-axis scale, so the linear scale to the max width 0 > width
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1); // Setup y-axis to the max height 0 > height

// Axis setup
const xaxis = d3.axisTop().scale(xscale); // Initialize xaxis, set above the x-axis with axisTop
const g_xaxis = g.append('g').attr('class', 'x axis'); // Append the group to the x-axis, and set class .x.axis
const yaxis = d3.axisLeft().scale(yscale); // Initialize yaxis, set left of the y-axis
const g_yaxis = g.append('g').attr('class', 'y axis'); // Append the group to the y-axis, and set class .y.axis

/////////////////////////

// Data fetching
d3.json('https://rawgit.com/sgratzl/d3tutorial/master/examples/weather.json').then((json) => {
    data = json;
    update(data); // Run function update
});

function update(new_data) {
    //update the scales
    xscale.domain([0, d3.max(new_data, (d) => d.temperature)]); // Gets the maximum value
    yscale.domain(new_data.map((d) => d.location.city)); // Gets all locations names
    //render the axis
    g_xaxis.transition().call(xaxis); // Render the xaxis after setting new scales
    g_yaxis.transition().call(yaxis); // Render the yaxis after setting new scales

    // Render the chart with new data
    // DATA JOIN use the key argument for ensuring that the same DOM element is bound to the same data-item
    const rect = g
        .selectAll('rect') // Select all rect in HTML file
        .data(new_data, (d) => d.location.city) // set data to every location name
        .join(
            // Join all these together
            // ENTER
            // new elements
            (enter) => {
                // Enter the new data into the elements
                const rect_enter = enter.append('rect').attr('x', 0); // Append new rect, with x='0'
                rect_enter.append('title'); // Set title filled with the city name
                return rect_enter;
            },
            // UPDATE
            // update existing elements
            (update) => update, // Update all existing elements
            // EXIT
            // elements that aren't associated with data
            (exit) => exit.remove(), // Remove all data that is not filled
        );

    // ENTER + UPDATE
    // both old and new elements
    rect.transition()
        .attr('height', yscale.bandwidth()) // Set height of the bar (rect)
        .attr('width', (d) => xscale(d.temperature)) // Set width of the bar (rect) this determines the scale
        .attr('y', (d) => yscale(d.location.city)); // Set y scale per city name/location

    rect.select('title').text((d) => d.location.city); // Set title per rect.
}

// //interactivity
// d3.select('#filter-us-only').on('change', function () {
//     // This will be triggered when the user selects or unselects the checkbox
//     const checked = d3.select(this).property('checked');
//     if (checked === true) {
//         // Checkbox was just checked

//         // Keep only data element whose country is US
//         const filtered_data = data.filter((d) => d.location.country === 'US');

//         update(filtered_data); // Update the chart with the filtered data
//     } else {
//         // Checkbox was just unchecked
//         update(data); // Update the chart with all the data we have
//     }
// });
