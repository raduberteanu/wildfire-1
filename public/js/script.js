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
      templateUrl: 'html/map.html',
      controller: 'MapCtrl'
    });
  $stateProvider
    .state('cloud', {
      url: '/cloud',
      templateUrl: 'html/cloud.html',
      controller: 'CloudCtrl'
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

	$scope.cloud = d3.layout.cloud();
	var height = $("#word-cloud").clientHeight;
	var width = $("#word-cloud").clientWidth;
	cloud.start();
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
