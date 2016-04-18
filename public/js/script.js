var app = angular.module('twitterwildfire', ['ui.router','uiGmapgoogle-maps']);

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
    .state('net', {
      url: '/net',
      templateUrl: 'html/net.html',
      controller: 'NetCtrl'
    });

  $urlRouterProvider.otherwise('net');
}]);

app.factory('markers', [function(){
  var o = {
    markers: []
  };
  return o;
}]);

app.controller('NetCtrl', [
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
    $scope.showChart = false;

    $scope.map = {
      center: {
        latitude: 40.1451,
        longitude: -99.6680
      },
      zoom: 4,
      bounds: {}
    };

    $scope.options = {
      scrollwheel: true
    };

    var createRandomMarker = function(i, bounds, idKey) {
      var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

      if (idKey == null) {
        idKey = "id";
      }

      var latitude = lat_min + (Math.random() * lat_range);
      var longitude = lng_min + (Math.random() * lng_range);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: 'm' + i
      };
      ret[idKey] = i;
      return ret;
    };
    $scope.randomMarkers = [];

    $scope.$watch(function() {
	

    // Get the bounds from the map once it's loaded
    $scope.$watch(function() {
      return $scope.map.bounds;
    }, function(nv, ov) {
      // Only need to regenerate once
      if (!ov.southwest && nv.southwest) {
        var markers = [];
        for (var i = 0; i < 50; i++) {
          markers.push(createRandomMarker(i, $scope.map.bounds))
        }
        $scope.randomMarkers = markers;
      }
    }, true);
  }
]);