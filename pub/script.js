var app = angular.module('twitterwildfire', ['ui.router']);

function MapPoint(id, latLng, importance, title){ 
    this.id = id;
    this.latLng = latLng;
    this.importance = importance;
    this.title = title;
}

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {                                              
  $stateProvider                                                                             
    .state('map', {                                                                          
      url: '/map',                                                                           
      templateUrl: 'map.html',                                                          
      controller: 'MapCtrl'                                                                  
    });                                                                                      
  $stateProvider                                                                             
    .state('overview', {                                    
      url: '/overview',                                              
      templateUrl: 'overview.html',                                               
      controller: 'OverviewCtrl'                                                         
    });                                                                                      
  $stateProvider
    .state('search', {
      url: '/search',
      templateUrl: 'search.html',
      controller: 'SearchCtrl'
    });
  $stateProvider
    .state('cloud', {
      url: '/cloud',
      templateUrl: 'cloud.html',
      controller: 'CloudCtrl'
    });
  /*$stateProvider
    .state('cloud', {
      url: '/cloud',
      templateUrl: 'cloud.html',
      controller: 'CloudCtrl'
    });*/
  $stateProvider
    .state('reltable', {
      url: '/reltable',
      templateUrl: 'reltable.html',
      controller: 'RelTableCtrl'
    });
  $stateProvider
    .state('relnet', {
      url: '/relnet',
      templateUrl: 'rel-net.html',
      controller: 'RelNetCtrl'
    });


  $urlRouterProvider.otherwise('map');
}]);

app.factory('markers', [function(){
  var o = {
    markers: []
  };
  return o;
}]);

app.controller('CloudCtrl', [
    '$scope',
    function($scope) {
	$scope.showChart = false;

	//var cloud = d3.layout.cloud();
	var height = $("#word-cloud").clientHeight;
	var width = $("#word-cloud").clientWidth;
	words = ["Lorem", "Ipsum", "is", "simply", "dummy", "text", "of", "the", "printing", "and", "typesetting", "industry", "Lorem", "Ipsum", "has", "been", "the", "industry's", "standard", "dummy", "text", "ever", "since", "the", "1500s", "when", "an", "unknown", "printer", "took", "a", "galley", "of", "type", "and", "scrambled", "it", "to", "make", "a", "type", "specimen", "book", "It", "has", "survived", "not", "only", "five", "centuries", "but", "also", "the", "leap", "into", "electronic", "typesetting", "remaining", "essentially", "unchanged", "It", "was", "popularised", "in", "the", "1960s", "with", "the", "release", "of", "Letraset", "sheets", "containing", "Lorem", "Ipsum", "passages", "and", "more", "recently", "with", "desktop", "publishing", "software", "like", "Aldus", "PageMaker", "including", "versions", "of", "Lorem", "Ipsum"].map(function(d) {return {text:d, size: 10 + Math.random() * 90};});
	d3.layout.cloud().size([width,height])
	    .words(words)
	    .padding(5)
	    .rotate(function() {return ~~(Math.random() * 2) * 90; })
	    .font("Impact")
	    .fontSize(function(d) {return d.size; })
	    .on("end", draw)
	    .start();
	
	function draw(words) {
	    console.log("Drawing cloud");
	    /*d3.select("#word-cloud").append("g")
	    .attr("transform", "translate(320,200)")
	    .selectAll("text")
	    .data(words)
	    .enter().append("text")
	    .style("font-size", function(d) {return d.size + "px"; })
	    .attr("transform", function(d) {
		return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
	    .text(function(d) { return d.text; });*/
	}
    }
]);

app.controller('MapCtrl', [
    '$scope',
    function($scope){
	console.log("MapCtrl started");
	$scope.showChart = false;
	
	$scope.map_content = null;
	$scope.markers = [];

	function createMarker(lat,lng) {
	    var m = new google.maps.Circle({
		center: new google.maps.LatLng(lat, lng),
		radius: 2000000*(Math.pow(2,-$scope.map_content.getZoom())),
		strokeColor: "#0000FF",
		strokeOpacity: 0,
		strokeWeight: 2,
		fillColor: "#FF0000",
		fillOpacity: 0.5
	    });
	    m.setMap($scope.map_content);
	    $scope.markers.push(m);
	    m
	}
	function initMap() {
	    var mapProp = {
		center: new google.maps.LatLng(52,0),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    $scope.map_content = new google.maps.Map(
		document.getElementById('map-content'),mapProp);

	    createMarker(51.508742, -0.120850);
	    createMarker(58.983991,  5.734863);
	    createMarker(52.395715,  4.888916);
	    for (var i = 0; i < 100; i++) {
	    	createMarker(Math.random()*60, Math.random()*100-50);
	    }
	    $scope.map_content.addListener('zoom_changed', function() {
		console.log("zoom_changed");
	    	for (marker of $scope.markers)
	    	    marker.setRadius(2000000*(Math.pow(2,-$scope.map_content.getZoom())));
	    },100);
	}
	initMap();
    }
]);
