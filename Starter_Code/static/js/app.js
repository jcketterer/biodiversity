

//Getting Data
const data_url = "https://jcketterer.github.io/biodiversity-/Starter_Code/samples.json";

var jsondata;
var subjects;
var metaData;
var samples;
var filter;

//Define from json
function defineData(jsondata) {
    subjects = jsondata.names;
    metaData = jsondata.metaData;
    samples = jsondata.samples;
}

//Dropt Down list 
function makeSelect(subjects) {
    console.log("Populate "+subjects.length+" subjects");
    var dropDown = d3.select('#filter-column').append("select")
        .attr("id", "subject-selection")
        .style("background-color", "rgb(133,252,138")
    ;
    var options = dropDown.selectAll("option")
        .data(subjects)
        .enter()
        .append("option")
        .attr("value", function(d) {return d;})
        .text(function(d) {return d;})
    ;  
}

// Get sample by id 
var sample_index = -1;
var sample;
var meta;
function getSample(sample, sample_id) {
    console.log("Searching for:" +sample_id);
    for (i = 0; i < samples.length; i++) {
        if (samples[i].id == sample_id){
            sample_index = 1;
            sample = sample[i];
            meta = metaData[i];
            break;
        }
    }
}

//Calulate gauge statistics
var gauge_min = 100; 
var gauge_max = 0;
var gauge_mean = 0;

function getGaugeStats(metaData) {
    let washing_frequency = 0;
    let washing_sum = 0; 
    for( i = 0; i < metaData.length; i++) {
        let meta = metaData[i].wfreq;
        if (meta != null) {
            washing_frequency += 1;
            washing_sum += meta;
            if (meta < gauge_min) {
                gauge_min = meta;
            }
            if (meta > gauge_max) {
                gauge_max = meta;
            }
        }
    }
    gauge_mean = washing_sum/washing_frequency;
}

//Display the demographics
function updateDemographics(meta) {
    console.log(meta);
    let subjectid = "ID: " +meta.id;
    let subject_ethnicity = "Ethnicity: " +meta.ethnicity;
    let subject_gender = "Gender: " +meta.gender;
    let subject_age = "Age: " +meta.age;
    let subject_location = "Location: " +meta.location;
    let subject_type  = "Type: " +meta.type;
    let subject_washfreq = "Wash Frequency: " +meta.wfreq;

    d3.select(".subjectid").text(subjectid);
    d3.select(".ethnicity").text(subject_ethnicity);
    d3.select(".gender").text(subject_gender);
    d3.select(".age").text(subject_age);
    d3.select(".location").text(subject_location);
    d3.select(".type").text(subject_type);
}

//Plotting

function buildPlot(filter) {
    getSample(samples,filter);
    console.log(sample);
    updateDemographics(meta);
    var x = sample.otu_ids;
    var y = sample.sample_values;
    var text = sample.otu_labels;
    var bar_trace = {
        x: x,
        y: y,
        type: "bar",
        text: text
    };
    var bar_data = [bar_trace];
    var bar_layout = {
        title: "Sample values by OTU Id Bar Chart"
    };
    Plotly.newPlot("bar", bar_data, bar_layout);
    var bubble_trace = {
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {size: y}
    };
    var bubble_data = [bubble_trace];
    var bubble_layout = {
        title: "Sample values by OTU Id Bubble Chart",
        showlegend: false
    };
    Plotly.newPlot("bubble",bubble_data,bubble_layout);
    var washing_frequency = meta.wfreq;
    var gauge_data = [
        {
            domain: { x: [0,1], y: [0,1] },
            value: washing_frequency,
            title: { text: "Wash Freq" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, gauge_max]},
                steps: [
                    { range: [gauge_min, gauge_mean], color: "lightgray"},
                    { range: [gauge_mean, gauge_max], color: "rgb(133,252,138)"}
                ],
                threshold: {
                    line: { color: "blue", width: 4 },
                    thickness: 0.75,
                    value: gauge_mean
                }
            }
        }
   ];
   var gauge_layout = {
       height: 200,
       margin: { t: 0, b: 0}
   };
   Plotly.newPlot('gauge', gauge_data, gauge_layout);   
}

d3.json(data_url).then(data => {
    console.log(data);
    jsondata = data;
    defineData(jsondata);
    getGaugeStats(metaData);
    makeSelect(subjects);
    var selectSubject = d3.select("#subject-selection")
    selectSubject.on("change", function() {
        filter = d3.event.target.value;
        console.log(filter+" selected");
        buildPlot(filter);
    });
});

// function buildMetadata(samples) {
//     var metaurl = "samples.json";
//     d3.json(metaurl).then(function (sample) {
//         console.log(sample);
//         var sample_metadata = d3.select("#sample-metadata");
//         sample_metadata.html("");
//         Object.entries(sample).forEach(([key, value]) => {
//             console.log(key, value);
//             sample_metadata.append('p').text(`${key}, ${value}`);
//         });
//     });
// };

// function buildCharts(samples) {
//     var url = "samples.json"
//     d3.json(url).then(function (d) {
//         var bx = d.otu_ids;
//         var by = d.sample_values;
//         var btext = d.otu_labels;
//         var bmode = "markers";
//         var marker_clr = d.otu_ids;
//         var marker_sz = d.sample_values;

//         var trace_bubble = {
//             x: bx,
//             y: by, 
//             text: btext,
//             mode: bmode,
//             marker: {
//                 color: marker_clr,
//                 size: marker_sz
//             }
//         };
//         var bubbleData = [trace_bubble];

//         var layout = {
//             xaxis: { title: "OTU_ID" }
//         };
//         Plotly.newPlot('bubble', bubbleData, layout);

//         d3.json(url).then(function (d) {
//             var pvalues = d.sample_values.slice(0, 10);
//             var plabels = d.otu_ids.slice(0, 10);
//             var phovertext = d.otu_labels.slice(0, 10);

//             var pie_trace = {
//                 values: pvalues,
//                 labels: plabels,
//                 hovertext: phovertext,
//                 type: 'pie'
//             };
//             var pieData = [pie_trace]
//             Plotly.newPlot("pie", pieData)
//         });
//     });
// };

// function init() {
//     var selector = d3.select("#selDataset");

//     d3.json("/static").then((sampleNames) => {
//         sampleNames.forEach((sample) => {
//             selector
//                 .append("option")
//                 .text(sample)
//                 .property("values", sample);
//         });

//         const firstSample = sampleNames[0];
//         buildCharts(firstSample);
//         buildMetadata(firstSample);
//     });
// };

// function optionChanged(newSample) {
//     buildCharts(newSample);
//     buildMetadata(newSample);
// };


// init();