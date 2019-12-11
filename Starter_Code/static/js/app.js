
//Run all after window loads 
window.onload = function(e) {
    //Using d3 to call data from JSON file
    d3.json("static/js/samples.json").then((sample) => {

        //HTML varibales
        var personDiv = d3.select("#sample-metadata");
        var dropdown = document.getElementById("selDataset");

        //Data variables 
        var peopleIDS = sample.names;
        var people = sample.metadata;
        var sampleResults = sample.samples;

        //Drop down test
        var defaultOption = document.createElement('option');
        defaultOption.text = "Select Option";
        dropdown.add(defaultOption);

        //Add all IDS to droup down
        peopleIDS.forEach(function(id) {
            var option = document.createElement('option');
            option.text = id;
            option.value = id;
            dropdown.add(option,id);
        });
    
        //Adding event listener to drop down
        dropdown.addEventListener('change', function(event) {

            //Get values from option 
            var id = event.target.value;

            //Empty div element
            personDiv.html("");

            //If Statement for metadata selected and insert ID when found
            people.forEach(function(person) {

                if (id == person.id) {
                    Object.entries(person).forEach(function([key, value]) {

                        //Display demographic 
                        var row = personDiv.append("p");
                        row.text(`${key}: ${value}`);
                    });
                }
            });


            //Search for person sample
            sampleResults.forEach(function(sample) {

                if (id == sample.id) {
                    Object.entries(sample).forEach(function([key, value]) {

                        //Display bubble chart
                        var x_axis = sample.otu_ids;
                        var y_axis = sample.sample_values;
                        var size = sample.sample_values;
                        var color = sample.otu_ids;
                        var texts = sample.otu_labels;

                        var bubble = {
                            x: x_axis,
                            y: y_axis,
                            text: texts,
                            mode: `markers`,
                            marker: {
                                size: size,
                                color: color
                            }
                        };

                        var layout = {
                            title: "Belly Button Bacteria",
                            xaxis: { title: "OTU ID" }};
                        
                        Plotly.newPlot("bubble", [bubble], layout);
                    });
                }
            });
            // Scan for sample results for bar chart
            sampleResults.forEach(function(sample) {

                if (id == sample.id) {
                    Object.entries(sample).forEach(function([key,value]){

                        //Display bar chart from data chosen
                        var xaxis = sample.sample_values.slice(0,10);
                        var yaxis = sample.otu_ids.slice(0,10);
                        var barHover = sample.otu_labels.slice(0,10);

                        var bar = {
                            type: 'bar',
                            x: xaxis,
                            y: yaxis,
                            hovertext: barHover,
                            orientation: 'h'
                        };

                        var layout = {
                            title: "Belly Button Bar Chart"
                        };

                        Plotly.newPlot("bar", [bar], layout);
                    });
                }
            });

            //Scan for sample results for pie chart
            sampleResults.forEach(function(sample) { 
                
                if (id == sample.id) {
                    Object.entries(sample).forEach(function([key, value]){

                        //Display pie chart
                        var pieValues = sample.sample_values.slice(0,10);
                        var pieLabels = sample.otu_ids.slice(0,10);
                        var pieHover = sample.otu_labels.slice(0,10);

                        var pie = {
                            type: 'pie',
                            labels: pieValues,
                            values: pieLabels,
                            hovertext: pieHover
                        };

                        var layout = { title: "Pie Chart" };
                                                
                        Plotly.newPlot("pie", [pie], layout)
                                    
                    });
                }
            });    
        });
    });
}



