var key = '6ba34c43d5ae4dbcb690b93b05bf07dd';
var searchedCity = $('#searchedCity');
var searchButton = $('#btnSearch');
var DateTime = luxon.DateTime;

initLocalStorage();

if((localStorage.getItem("prevSearchedCities") != "[]")) {
    var searchHistory = JSON.parse(localStorage.getItem("prevSearchedCities"));
    showLastSearch(searchHistory[0]);
};

// convert searched location to lat and lon coordinates using geo API
function currentWeather(results) {
    // need to use the results function somewhere
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&appid=' + key;
    $.ajax({
        url:geoUrl,
        method: 'GET'
    }).then(function (results) {
       console.log(geoUrl);
    var currentCity = results.name;
    $('#current-location').text(currentCity + '');
    var currentLat = results.coord.lat;
    var currentLon = results.coord.lon;
    coordConvert(currentLat, currentLon);
    });
};

function coordConvert(currentLat, currentLon) {
    var key = '6ba34c43d5ae4dbcb690b93b05bf07dd';
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + currentLat + '&lon=' + currentLon + '&appid=' + key;
    $.ajax({
            url: forecastUrl,
            method: 'GET'
        }).then(function (results) {
            var currentTemp = results.current.temp;
            $('#currentTemp').text('Temperature: ' + currentTemp + ' \u00B0F');
            var currentWind = results.current.wind;
            $('#currentWind').text('Wind: ' + currentWind + ' mph');
            var currentHumidity = results.current.humidity;
            $('#currentHumidity').text('Humidity: ' + currentHumidity + " %");
            fiveDayForecast(results);
    });
};

function displayForecast(forecastUrl) {    
    $('#fiveDayForecast').show();
    $.ajax({
        url: forecastUrl,
        method: 'GET'
    }).then(function (results) {
        // $('#forecast').empty();
        var currentTemp = results.current.temp;
        $('#currentTemp').text('Temperature: ' + currentTemp + ' \u00B0F');
        var currentWind = results.current.wind;
        $('#currentWind').text('Wind: ' + currentWind + ' mph');
        var currentHumidity = results.current.humidity;
        $('#currentHumidity').text('Humidity: ' + currentHumidity + " %");
        fiveDayForecast(results);

    });
};

function fiveDayForecast(results) {
    $('#forecast').text('');
    for (i = 0; i < 5; i++) {
        // today's date
        const now = DateTime.now();
        dt.toLocaleString(DateTime.DATE_FULL);
        var DateTime = $('<h3>');
        $('#searched-city').empty();
        $('#searched-city').append(
            DateTime.text
        )
        // add weather icon here
        // temp
        // humidity
        //icon
        // var forecastWethImg = 'assets/images/' + results.daily[i].weather[0].icon + '@2x.png';
        // var forecastWethIcon = $('<img>');
        // forecastWethIcon.attr('src', forecastWethImg);
        var forecastSquare = $("<div>");
        forecastSquare.attr("class", "col forecast-square");
        //temperature
        var forecastTempP = $('</p>');
        var forecastTemp = 'Temp: ' + results.daily[i].temp.max + ' \u00B0F';
        forecastTempP.append(forecastTemp);
        //humidity
        var forecastHumP = $('<p>');
        var forecastHum = 'Humidity: ' + results.daily[i].humidity + '%';
        forecastHumP.append(forecastHum);
        forecastSquare.append(forecastDateP, forecastWethIcon, forecastTempP, forecastHumP);
        $('#forecast').append(forecastSquare);

    };
};

function showLastSearch(lastSearch) {
    var searchedCity = lastSearch;
    var key = '6ba34c43d5ae4dbcb690b93b05bf07dd';
    var lastForecastUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&appid=' + key;
    $.ajax({
        url: lastForecastUrl,
        method: 'GET'
    }).then(function (results) {
        var currentCity = results.name;
        $('#currentCity').text(currentCity + '');
        var currentLat = results.lat;
        var currentLon = results.lon;
        coordConvert(currentLat, currentLon);
    });
};

// local storage
function initLocalStorage() {
    if (localStorage.getItem("prevSearchedCities") === null) {
        localStorage.setItem("prevSearchedCities", "[]");
    } else if (localStorage.getItem("prevSearchedCities") === "[]") {
        return;
    };
};

var searchHistory = JSON.parse(localStorage.getItem("prevSearchedCities"));

function addToHistory(recentCity) {
    initLocalStorage();
    var searchHistory = JSON.parse(localStorage.getItem("prevSearchedCities"));
    searchHistory.unshift(recentCity);
    localStorage.setItem("prevSearchedCities", JSON.stringify(searchHistory));
    recentCities();
}

function recentCities() {
    $('#searchHistory').text('');
    var searchHistory = JSON.parse(localStorage.getItem("prevSearchedCities"));
    // verify this works
    for (i = 0; i < searchHistory.length; i++) {
        $('#recent-cities').append('<br>');
        var searchButton = $('<button>');
        searchButton.addClass('btn btn-info lastCity');
        searchButton.attr('type', 'button');
        searchButton.attr('id', searchHistory[i]);
        searchButton.text(searchHistory[i]);
        $('#recent-cities').append(searchButton);
        if ([i] > 5) {
            return;
        };
    };
};

$(document).on('click', '.lastCity', function (event) {
    event.preventDefault();
    var key = '6ba34c43d5ae4dbcb690b93b05bf07dd';
    var searchedCity = $('.input').val();
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&appid=' + key;
    $.ajax({
        url: geoUrl,
        method: 'GET'
    }).then(function (results) {
        currentWeather(results);
    });
});

searchButton.on('click', function (event) {
    event.preventDefault();
    var key = '6ba34c43d5ae4dbcb690b93b05bf07dd';
    var searchedCity = $('#searchedCity').val();
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&appid=' + key;
    $.ajax({
        url: geoUrl,
        method: 'GET'
    }).then(function (results) {
        currentWeather(results);
        addToHistory(results.name);
    });
    $('#searchedCity').val('')
});

// $('#btnSearch').click(function() {
//     $(currentWeather)
// });
// searchButton.addEventListener('click', currentWeather);

// local storage of recently searched cities
recentCities();