var map, searchManager;

function GetMap() {
  map = new Microsoft.Maps.Map("#myMap", {
    credentials: credentials,
    // center: new Microsoft.Maps.Location(28.9845, 77.7064),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 10,
  });
  //   geocodeQuery("Meerut, india");
  geocodeQuery(locationForMap);

  //Add your post map load code here.
}

function geocodeQuery(query) {
  //If search manager is not defined, load the search module.
  if (!searchManager) {
    //Create an instance of the search manager and call the geocodeQuery function again.
    Microsoft.Maps.loadModule("Microsoft.Maps.Search", function () {
      searchManager = new Microsoft.Maps.Search.SearchManager(map);
      geocodeQuery(query);
    });
  } else {
    var searchRequest = {
      where: query,
      callback: function (r) {
        //Add the first result to the map and zoom into it.
        if (r && r.results && r.results.length > 0) {
          var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
          map.entities.push(pin);

          map.setView({ bounds: r.results[0].bestView });
        }
      },
      errorCallback: function (e) {
        //If there is an error, alert the user about it.
        alert("Such location in not exist");
      },
    };

    //Make the geocode request.
    searchManager.geocode(searchRequest);
  }
}
