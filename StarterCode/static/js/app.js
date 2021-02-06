d3.json('../data/samples.json').then(importedData => {

  console.log(importedData)
  const dropDownMenu = document.getElementById('selDataset');
  
  const { names, metadata, samples } = importedData
  // Loop through array elements, create a new DOM node for each element and append to object
  for (let i = 0; i < names.length; i++) {
    const opt = names[i]; 
    const element = document.createElement('option');
    element.textContent = opt;
    element.value = opt;
    dropDownMenu.appendChild(element)
  }

  renderDemographInfo(metadata[0]);
  renderBarChart(samples[0]);
  renderBubbleChart(samples[0])
  gaugeChart(metadata[0])

  // add event listener
  dropDownMenu.addEventListener('change', function(event) {
    // change data type of this.value to an integer
    const subject = metadata.find(data => data.id === +this.value)

    // create variable for bar chart sample to match selected value
    const sample = samples.find(data => data.id === this.value)
    
    renderDemographInfo(subject);
    renderBarChart(sample);
    renderBubbleChart(sample)
    gaugeChart(subject)
  })

  // Button handler
  function handleButton() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
  }
 
});

// create function to populate content in Demographic Info based on user selected ID 
function renderDemographInfo(subject) {
  const demographicInfo = document.getElementById('sample-metadata');
  demographicInfo.innerHTML = `
    <p>id: ${subject.id}</p>
    <p>ethnicity: ${subject.ethnicity}</p>
    <p>gender: ${subject.gender}</p>
    <p>age: ${subject.age}</p>
    <p>location: ${subject.location}</p>
  `;
}

// create function for bar chart
function renderBarChart(sample) {

  // create empty array for ylabels
  let ylabels = [];

  // Slice top 10 for plotting
  const otuIds = sample.otu_ids.slice(0,10);
  const sampleValues = sample.sample_values.slice(0,10);

  // converted ID's to strings for y labels
  for (let i = 0; i < otuIds.length; i++) {
    toString = otuIds[i].toString()
    ylabels.push(`OTU ${toString}`)
  }

  const otuLabels = sample.otu_labels.slice(0,10);

  let trace1 = {
    type: "bar",
    x: sampleValues,
    y: ylabels,
    text: otuLabels,
    orientation: 'h',
    marker: {
      color: 'rgb(142,124,195)',
    }
  };

  let data = [trace1];

  // created layout and reversed order
  let layout = {
    yaxis: {
      autorange: 'reversed'
    },
    xaxis: {
      tick0: 0,
      dtick: 50
    },
    title: 'Number of Microbial Species by Top 10 OTU ID',
  }

  Plotly.newPlot('bar', data, layout);
}

// bubble chart function
function renderBubbleChart(sample) {

  const otuIds = sample.otu_ids
  
  const sampleValues = sample.sample_values;
  const otuLabels = sample.otu_labels;
  
  let trace1 = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIds
    }
  };

  let data = [trace1];

  let layout = {
    showlegend: false,
    height: 500,
    width: 1000,
    title: 'Number of Microbial Species by OTU ID'
  };

  Plotly.newPlot('bubble', data, layout);
}

// gauge chart function

function gaugeChart (id) {
  var data = [
    {
      type: 'indicator',
      mode: 'gauge+number',
      value: id.wfreq,
      title: { text: 'Scrubs per Week', font: { size: 14 } },
      gauge: {
        axis: { range: [0, 9], tickwidth: 1, tickcolor: 'black' },
        bar: { color: '#4245f5' },
        bgcolor: 'white',
        borderwidth: 2,
        bordercolor: 'black',
        steps: [
          { range: [0, 1], color: '#ed0022' },
          { range: [1, 2], color: '#f43021' },
          { range: [2, 3], color: '#fc6114' },
          { range: [3, 4], color: '#ff8c00' },
          { range: [4, 5], color: '#ffad00' },
          { range: [5, 6], color: '#edbd02' },
          { range: [6, 7], color: '#c6bf22' },
          { range: [7, 8], color: '#92b73a' },
          { range: [8, 9], color: '#4aa84e' }
        ],
      }
    }
  ];

  var layout = {
    width: 450,
    height: 400,
    margin: {t: 0, r: 25, l: 25, b:50 },
  };

  Plotly.newPlot('gauge', data, layout);
}
