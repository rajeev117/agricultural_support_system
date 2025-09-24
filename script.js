var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

function addMarker(lat, lng) {
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`)
        .openPopup();
}

let soilData = [];
let lastLat = null;
let lastLng = null;
let lastSoil = null;

fetch('soil_data.csv')
    .then(response => response.text())
    .then(text => {
        const rows = text.trim().split('\n').slice(1);
        soilData = rows.map(row => {
            const [N, P, K, ph] = row.split(',');
            return { N: +N, P: +P, K: +K, ph: +ph };
        });
    })
    .catch(err => console.error('Error', err));

function Distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function autofillSoilData(lat, lng) {
    let sample;
    if (lastLat !== null && Distance(lastLat, lastLng, lat, lng) <= 10) {
        sample = lastSoil;
    } else {
        sample = soilData[Math.floor(Math.random() * soilData.length)];
        lastLat = lat;
        lastLng = lng;
        lastSoil = sample;
    }

    document.getElementById('N').textContent = sample.N;
    document.getElementById('P').textContent = sample.P;
    document.getElementById('K').textContent = sample.K;
    document.getElementById('ph').textContent = sample.ph;
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        map.setView([lat, lng], 13);
        addMarker(lat, lng);
        autofillSoilData(lat, lng);
    }, function (error) {
        console.error("error", error);
    });
} else {
    console.error("Geolocation not supported.");
}

map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    addMarker(lat, lng);
    autofillSoilData(lat, lng);
});

document.getElementById('cropForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;
    var N = document.getElementById('N').textContent;
    var P = document.getElementById('P').textContent;
    var K = document.getElementById('K').textContent;
    var ph = document.getElementById('ph').textContent;

    fetch('http://localhost:3000/api/coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng, N, P, K, ph }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').innerHTML = `
                <p>Predicted Crop: ${data.crop}</p>
                <p>Temperature: ${data.temperature}°C</p>
                <p>Humidity: ${data.humidity}%</p>
            `;
        })
        .catch(error => console.error('Error:', error));
});