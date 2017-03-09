////////////////////////////////////////////////////////////////////////////////////////////
//setting up the map//
////////////////////////////////////////////////////////////////////////////////////////////

var map = new L.Map('map').setView([-13, -54], 3);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

////////////////////////////////////////////////////////////////////////////////////////////
//adding the data//
////////////////////////////////////////////////////////////////////////////////////////////

var stations = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "STATION": "Rio Parana&#237;ba",
      "ST_CODE": "MGRP",
    },
    "geometry": {
      "type": "Point",
      "coordinates": [-46.132551833299999, -19.209860611100002]
    }
  }, {
    "type": "Feature",
    "properties": {
      "STATION": "Varginha",
      "ST_CODE": "MGV1",
    },
    "geometry": {
      "type": "Point",
      "coordinates": [-45.434993111099999, -21.5426228611]
    }
  }, {
    "type": "Feature",
    "properties": {
      "STATION": "Vi&#231;osa",
      "ST_CODE": "VICO",
    },
    "geometry": {
      "type": "Point",
      "coordinates": [-42.8699895, -20.761500555600001]
    }
  }, {
    "type": "Feature",
    "properties": {
      "STATION": "Belo Horizonte",
      "ST_CODE": "MGBH",
    },
    "geometry": {
      "type": "Point",
      "coordinates": [-43.924896972200003, -19.941900861099999]
    }
  }]
};

var markerLayer = L.geoJson(stations, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<b>" + feature.properties.STATION + "</b><br>" +
      "Station Code: " + feature.properties.ST_CODE);
  }
}).addTo(map);
map.fitBounds(markerLayer.getBounds());

////////////////////////////////////////////////////////////////////////////////////////////
//creating the selector control//
////////////////////////////////////////////////////////////////////////////////////////////

//create Leaflet control for selector
var selector = L.control({
  position: 'topright'
});

selector.onAdd = function(map) {
  //create div container
  var div = L.DomUtil.create('div', 'mySelector');
  //create select element within container (with id, so it can be populated later)
  div.innerHTML = '<select id="marker_select"><option value="init">(select station)</option></select>';
  return div;
};

selector.addTo(map);

//have to use eachFeature (instead of onEachFeature) to create selector options
//because _leaflet_id doesn't exist until after each feature is created
markerLayer.eachLayer(function(layer) {
  //create option in selector element
  //with content set to city name
  //and value set to the layer's internal ID
  var optionElement = document.createElement("option");
  optionElement.innerHTML = layer.feature.properties.STATION;
  optionElement.value = layer._leaflet_id;
  L.DomUtil.get("marker_select").appendChild(optionElement);
});

////////////////////////////////////////////////////////////////////////////////////////////
//setting up event listeners//
////////////////////////////////////////////////////////////////////////////////////////////

var marker_select = L.DomUtil.get("marker_select");

//prevent clicks on the selector from propagating through to the map
//(otherwise popups will close immediately after opening)
L.DomEvent.addListener(marker_select, 'click', function(e) {
  L.DomEvent.stopPropagation(e);
});

L.DomEvent.addListener(marker_select, 'change', changeHandler);

function changeHandler(e) {
  if (e.target.value == "init") {
    map.closePopup();
  } else {
    markerLayer.getLayer(e.target.value).openPopup();
  }
}
