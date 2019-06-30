var obj;
var stations = [];
var trip;
let option;
var startStation;
var endStation;
var tripTimes;
var toggle = 0;
var stationInfo;
var nextTrip;
var startLoc;
var endLoc;

var dropBoxStart = document.getElementById("start_box");
var dropBoxEnd = document.getElementById("end_box");

fetch("https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y")
    .then(response => response.json())
    .then((data) => {
        obj = data;
        //stationInfo = data["root"][]
        stations = data["root"]["stations"]["station"];
        console.log(stations);
for (var i = 0; i < stations.length; i++) {
    option = new Option(stations[i]["name"]);
    option.value = stations[i]["abbr"];
    option2 = new Option(stations[i]["name"]);
    option2.value = stations[i]["abbr"];
    console.log(option);
    console.log(option2);
    dropBoxStart.options.add(option);
    dropBoxEnd.options.add(option2);
}
});

function getStartValue(){
    startStation = dropBoxStart.options[start_box.selectedIndex].value;
    console.log(startStation);
    fetchTrip();
}
function getEndValue(){
    endStation = dropBoxEnd.options[end_box.selectedIndex].value;
    console.log(endStation);
    fetchTrip();
}
function fetchTrip(){
    if(startStation == null)
        return;
    if(endStation == null)
        return;

    let url = "https://api.bart.gov/api/sched.aspx?cmd=depart&orig=" +startStation+"&dest="+endStation+"&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1&json=y";
    console.log(url);

    fetch(url)
    .then(response => response.json())
    .then((data) => {
        trip = data["root"];
        tripTimes = data["root"]["schedule"]["request"]["trip"];
        console.log(trip);
        console.log(tripTimes);
        console.log(tripTimes.length);
        nextTrip = tripTimes[2]["@origTimeMin"];
        document.getElementById("numberOfTrips").innerHTML= tripTimes.length;
        addTable();
        addTime();
    });
    fetchStation();


}
function addTime(){
    document.getElementById("time_to_next_train").innerHTML ="The next train leaves at: "  +  nextTrip;
}
function fetchStation(){
    let url = "https://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=" +startStation+ "&key=MW9S-E7SL-26DU-VV8V&json=y";

    fetch(url)
    .then(response => response.json())
    .then((data) => {
        stationInfo = data["root"]["stations"]["station"]["intro"]["#cdata-section"];
        console.log(stationInfo);
        document.getElementById("stationInformation").innerHTML= stationInfo;
    });
}
function addTable() {
  //help for creating this table was from https://stackoverflow.com/questions/20407781/dynamically-generated-table-using-an-array-to-fill-in-td-values
    var myTableDiv = document.getElementById("trip_results")
    var table = document.getElementById("table")
    var tableBody = document.createElement('TBODY')
    
    if(toggle == 1){

        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

    }
    table.appendChild(tableBody);
    var heading = new Array();
    heading[0] = "Origin"
    heading[1] = "Destination"
    heading[2] = "Depart Time"
    heading[3] = "Arrival Time"
    heading[4] = "Fare $"

    var stock = new Array()
    for (var i = 0; i < tripTimes.length; i++) {
        stock[i] = new Array(tripTimes[i]["@origin"],tripTimes[i]["@destination"],tripTimes[i]["@origTimeMin"],tripTimes[i]["@destTimeMin"],tripTimes[i]["@fare"])
    }
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (i = 0; i < heading.length; i++) {
        var th = document.createElement('TH')
        th.width = '75';
        th.appendChild(document.createTextNode(heading[i]));
        tr.appendChild(th);
    }
    for (i = 0; i < stock.length; i++) {
        var tr = document.createElement('TR');
        for (j = 0; j < stock[i].length; j++) {
            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(stock[i][j]));
            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }  
    myTableDiv.appendChild(table)
    toggle = 1;
}

function displayCounter() {  //local Storage help was from https://stackoverflow.com/questions/46183070/localstorage-counter
        // check if the localStorage object is supported by the browser
        if ('localStorage' in window && window['localStorage'] !== null) {
            // if the counter has been defined, increment its value, // otherwise, set it to 0
            ('counter' in localStorage && localStorage['counter'] !== null) ? localStorage['counter']++ : localStorage['counter'] = 0;
            var container = document.getElementById('times_visited');
            if (!container) { 
                return 
            };
            container.innerHTML = 'Welcome back, you have visited this page ' + localStorage['counter'] + ' times before.';
        }
    }
    // call the 'displayCounter()' function when the web page is loaded
    window.onload = function () {
        displayCounter();
    }

    //reloads information every 30 seconds
    setTimeout("fetchTrip();", 30000);