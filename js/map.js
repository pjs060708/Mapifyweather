let map;
let locate_btn;
let searchBox;
let searchBtn;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 20,
            });
            map.addListener('click', function (e) {
                getWeather(e.latLng.lat(), e.latLng.lng());
            });

            locate_btn = document.getElementById('locate_btn');
            locate_btn.addEventListener('click', () => {
                map.setCenter(pos);
                map.setZoom(20);
            });

            searchBox = document.getElementById('search-box');
            searchBtn = document.getElementById('search-btn');

            searchBtn.addEventListener('click', () => {
                let geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': searchBox.value }, function (results, status) {
                    if (status === 'OK') {
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(20);
                    } else {
                        alert('검색 결과가 없거나, 아무것도 입력되지 않았습니다.');
                    }
                });
            });

        }, () => {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}


function handleLocationError(browserHasGeolocation) {
    let errorMessage = browserHasGeolocation ? '현위치를 가져오지 못했습니다.' : '현재 브라우저는 위치 정보를 지원하지 않습니다.';
    errorMessage += "페이지를 새로 고침합니다.";
    alert(errorMessage);
    location.reload();
}

const getWeather = (lat, lng) => {
    const API_KEY = 'Openweathermap_API_Key';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&lang=kr`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            showModal(lat, lng, data.weather[0].description);
            updateWeatherIcon(data.weather[0].icon);
        })
        .catch(error => console.error('Error:', error));
}

const weatherCodeToIconClass = {
    "01d": "wi-day-sunny",
    "02d": "wi-day-cloudy",
    "03d": "wi-cloud",
    "04d": "wi-cloudy",
    "09d": "wi-showers",
    "10d": "wi-day-rain",
    "11d": "wi-day-thunderstorm",
    "13d": "wi-day-snow",
    "50d": "wi-day-fog",
    "01n": "wi-night-clear",
    "02n": "wi-night-cloudy",
    "10n": "wi-night-rain",
    "11n": "wi-night-thunderstorm",
    "13n": "wi-night-snow",
    "50n": "wi-night-fog",
};

const updateWeatherIcon = (weatherCode) => {
    const iconClass = weatherCodeToIconClass[weatherCode] || "wi-day-sunny";
    const weatherIconElement = document.getElementById("weather-icon");
    weatherIconElement.className = "";
    weatherIconElement.classList.add("wi", iconClass);
};

const modal = document.getElementById('myModal');

const showModal = (lat, lng, weatherInfo) => {
    modal.style.display = 'block';
    modal.style.right = '0';
    document.querySelector("#locationInfo").innerText = `위도: ${lat}
경도: ${lng}`;
    document.querySelector("#weatherInfo").innerText = `날씨: ${weatherInfo}`;
};

const span = document.getElementsByClassName('close')[0];
span.onclick = function () {
    const modal = document.getElementById('myModal');
    modal.style.right = '-100%';
};