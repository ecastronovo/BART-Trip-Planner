var map;
function initMap() {
	//var directionsService = new google.maps.DirectionsService;
	var directionDisplay = new google.maps.DirectionsRenderer;

	 var SCU = {lat: 37.3496, lng: -121.9390};

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.7955, lng: -122.3529},
		zoom: 11
	});
	directionDisplay.setMap(map);
	 var marker = new google.maps.Marker({position: SCU, map: map});

}