


function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var MetaData = `/metadata/${sample}`;
    d3.json(MetaData).then(function(response) {
     
      
      var panelData = d3.select("#sample-metadata");
      panelData.html("");
      
    // Use `.html("") to clear any existing metadata
      
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      var data = Object.entries(response);
      data.forEach(function(item) {
      panelData.append("div").text(item);
  });
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 }


function buildCharts(sample) {
  var url = `/samples/${sample}`
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response){

    var id = response.otu_ids.slice(0,10);
    var labels = response.otu_labels.slice(0,10);
    var values = response.sample_values.slice(0,10);
    var data = [{
      "labels": id,
      "values": values,
      "hovertext": labels,
      "type": "pie"
    }];
    
  Plotly.newPlot('pie', data);

  d3.json(url).then(function(response){
    var bubbleIds = response.otu_ids;
    var bubbleLabels = response.otu_labels;
    var bubbleValues = response.sample_values;

    var bubbleChartData = {
      mode: 'markers',
      x: bubbleIds,
      y: bubbleValues,
      text: bubbleLabels,
      marker: {color: bubbleIds, colorscale: 'Rainbow', size: bubbleValues}
    };

    var bblData = [bubbleChartData];

    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
      };
    
    Plotly.newPlot('bubble', bblData, layout); 
  })
})

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
