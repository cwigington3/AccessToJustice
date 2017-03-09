// enables proper text transformation for community area names
String.prototype.capitalize = function(){
    return this.toLowerCase().replace( /\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

// initialize map inside the 'map' div
var map = L.map('map').setView([ 32.836, -83.22], 7);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 15,
    minZoom: 7,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.light'
}).addTo(map);

// global variables for hidden choropleth layers
var choropleth_layers = ["1-100", "100-500", "500-1000", "1000-1500", "1500-3000", "3000+"];

// wait until the map is loaded
map.on('load', function() {
	map.getCanvas().style.cursor = "default";
    
    map.addControl(new mapboxgl.Navigation({position: 'top-left'}));

    map.addSource('divvy', {
    	type: "vector",
      url: "mapbox://jeancochrane.04v9nybc"
    });
    
    map.addSource('neighborhoods', {
    	type: "vector",
      url: "mapbox://jeancochrane.81pz71fw"
    });
    
    // Adds neighborhood outlines
    map.addLayer({
    	"id": "neighborhood_boundaries",
      "type": "fill",
      "source": "neighborhoods",
      "source-layer": "community_area_stats",
      "paint": {
       	"fill-color": "#bfbfbf",
        "fill-outline-color": "#6E6E6E"
      },
    }, "3000+");
    
    // Hidden layer for thickening neighborhood outlines on hover
    map.addLayer({
    	"id": "neighborhood_hover",
      "type": "line",
      "source": "neighborhoods",
      "source-layer": "community_area_stats",
      "paint": {
      	"line-color": "#6E6E6E",
        "line-width": 4
      },
      "filter": ["==", "community", ""]
    });
    
    //Adds layer for Q2 station data
    map.addLayer({
    	"id": "divvy_data_q2",
      "type": "circle",
      "source": "divvy",
      "source-layer": "Divvy_stats1",
      "filter": ["!=", "Address", "State St & Randolph St"],
      "layout" : {
      	"visibility": "visible"
      },
      "paint": {
      	"circle-color": {
        	property: "Rides (2015 Q2)",
          stops: [
            [1, "#ffffcc"],
            [500, "#ff9933"],
            [1000, "#ff6600"],
            [5000, "red"],
            [10000, "maroon"]
          ]
        },
        "circle-opacity": 0.7,
        "circle-radius": {
          stops: [
          	[9, 2.5],
            [11, 5],
            [13, 8]
          ]
        },
      }
    });
    
    //Adds layer for Q4 station data
    map.addLayer({
    	"id": "divvy_data_q4",
      "type": "circle",
      "source": "divvy",
      "source-layer": "Divvy_stats1",
      "filter": ["!=", "Address", "State St & Randolph St"],
      "layout" : {
      	"visibility": "none"
      },
      "paint": {
      	"circle-color": {
        	property: "Rides (2015 Q4)",
          stops: [
            [1, "#ffffcc"],
            [500, "#ff9933"],
            [1000, "#ff6600"],
            [5000, "red"],
            [10000, "maroon"]
          ]
        },
        "circle-opacity": 0.7,
        "circle-radius": {
          stops: [
          	[9, 2.5],
            [11, 5],
            [13, 8]
          ]
        },
      }
    });
    
    // Hidden layer for thickening stations on hover
    map.addLayer({
    	"id": "station_hover",
      "type": "circle",
      "source": "divvy",
      "source-layer": "Divvy_stats1",
      "filter": [
      	"all",
        ["==", "Divvy Station", ""],
      	["!=", "Address", "State St & Randolph St"]
      ],
      "paint": {
      	"circle-color": "black",
        "circle-opacity": 0.6,
        "circle-radius": {
          stops: [
          	[9, 4.5],
            [11, 7],
            [13, 10]
          ]
        },
      }
    });

// click to show data
map.on('click', function (e) {
    var features_q2 = map.queryRenderedFeatures(e.point, {layer: "divvy_data_q2"});
    var visibility_q2 = map.getLayoutProperty('divvy_data_q2', 'visibility');
    
    var features_q4 = map.queryRenderedFeatures(e.point, {layer: "divvy_data_q4"});
    var visibility_q4 = map.getLayoutProperty('divvy_data_q4', 'visibility');
    
    var visibility_choropleth = map.getLayoutProperty('100-500', 'visibility');
    var features_choropleth = map.queryRenderedFeatures(e.point, {layers: choropleth_layers});
    
    var comm_area = map.queryRenderedFeatures(e.point, {layer: "neighborhood_boundaries"});
    
   	if (visibility_q2 === 'visible' && features_q2[0].properties["Rides (2015 Q2)"]) {
    
      var popup = new mapboxgl.Popup()
      	.setLngLat(features_q2[0].geometry.coordinates)
      	.setHTML("<h2><strong>" + comm_area[0].properties["Community District"] + "</strong>" + " (#" + comm_area[0].properties["Divvy Station"] + ")</h2><p><strong>" + features_q2[0].properties["Rides (2015 Q2)"] + "</strong> rides in Spring 2015.</p>")
      	.addTo(map);
      
    } else if (visibility_q4 === 'visible' && features_q4[0].properties["Rides (2015 Q4)"]) {

      var popup = new mapboxgl.Popup()
      	.setLngLat(features_q4[0].geometry.coordinates)
      	.setHTML("<h2><strong>" + comm_area[0].properties["Community District"] + "</strong>" + " (#" + comm_area[0].properties["Divvy Station"] + ")</h2><p><strong>" + features_q4[0].properties["Rides (2015 Q4)"] + "</strong> rides in Autumn 2015.</p>")
      	.addTo(map);
      
    } else if (visibility_choropleth === 'visible' && features_choropleth[0]) {
  
      var popup_choropleth = new mapboxgl.Popup()
      	.setLngLat(features_choropleth[0].geometry.coordinates[0][0])
      	.setHTML("<h2><strong>" +  features_choropleth[0].properties["community"].capitalize() + "</h2><p><strong>" + features_choropleth[0].properties["2015 Q4 (per station)"] + "</strong> rides per Divvy station <br> in Autumn 2015.</p>")
      	.addTo(map);
    
    } else {
    
    	document.getElementById('nhood').innerHTML = "";
    	document.getElementById('divvy_stats').innerHTML = "<p><em>Click on a station or neighborhood <br> for more information.</em></p>" 
      
    }
}); 

// hover styles for data
map.on("mousemove", function(e) {
		var features_nhood_hover = map.queryRenderedFeatures(e.point, {layer: "neighborhood_hover"});
    var visibility_choropleth = map.getLayoutProperty('100-500', 'visibility');
    
     var features_station_hover = map.queryRenderedFeatures(e.point, {layer: "station_hover"});
    var visibility_q2 = map.getLayoutProperty('divvy_data_q2', 'visibility');
    var visibility_q4 = map.getLayoutProperty('divvy_data_q4', 'visibility');
    
		if ((visibility_choropleth === 'visible') && (visibility_q2 = 'none') && (visibility_q4 = 'none') && features_nhood_hover[0].properties["community"]) {
    
    		map.setFilter("neighborhood_hover", ["==", "community", features_nhood_hover[0].properties["community"]]);
        map.getCanvas().style.cursor = "pointer";
        
    } else if (features_station_hover[0].properties["Divvy Station"] && ((visibility_q2 === 'visible') || (visibility_q4 === 'visible')) && (visibility_choropleth === "none")) {
    
    		map.setFilter("station_hover", ["==", "Divvy Station", features_station_hover[0].properties["Divvy Station"]]);
        map.getCanvas().style.cursor = "pointer";
        
    } else {
    
    		map.setFilter("neighborhood_hover", ["==", "community", ""]);
        map.setFilter("station_hover", ["==", "Divvy Station", ""]);
        map.getCanvas().style.cursor = "default";
        
    };
});
});

switchToQ2();
switchToQ4();
switchToChoropleth();

function switchToQ2() {
		var link = document.getElementById('q2');

    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();   
        document.getElementById('q4').className = 'inactive';
        document.getElementById('choropleth').className = 'inactive';
        
        map.setLayoutProperty('divvy_data_q2', 'visibility', 'visible');
        map.setLayoutProperty('divvy_data_q4', 'visibility', 'none');
        choropleth_layers.forEach(function(layer) {
        		map.setLayoutProperty(layer, 'visibility', 'none');
        });
        this.className = 'active';
    };
};

function switchToQ4() {
		var link = document.getElementById('q4');

    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();   
        document.getElementById('q2').className = 'inactive';
        document.getElementById('choropleth').className = 'inactive';
        
        map.setLayoutProperty('divvy_data_q4', 'visibility', 'visible');
        map.setLayoutProperty('divvy_data_q2', 'visibility', 'none');
        choropleth_layers.forEach(function(layer) {
        		map.setLayoutProperty(layer, 'visibility', 'none');
        });
        this.className = 'active';
    };
};

function switchToChoropleth() {
		var link = document.getElementById('choropleth');
    
    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        document.getElementById('q2').className = 'inactive';
        document.getElementById('q4').className = 'inactive';
        
        map.setLayoutProperty('divvy_data_q2', 'visibility', 'none');
        map.setLayoutProperty('divvy_data_q4', 'visibility', 'none');
        this.className = 'active';
        
        choropleth_layers.forEach(function(layer) {
        		map.setLayoutProperty(layer, 'visibility', 'visible');
        });
    };
}
