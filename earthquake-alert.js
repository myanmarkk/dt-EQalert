// earthquake-alert.js
const cities = {
    "Yangon": { lat: 16.8661, lon: 96.1951 },
    "Mandalay": { lat: 21.975, lon: 96.0836 },
    "Naypyidaw": { lat: 19.747, lon: 96.115 },
    "Bagan": { lat: 21.1722, lon: 94.8611 },
    "Taunggyi": { lat: 20.7892, lon: 97.0378 },
    "Mawlamyine": { lat: 16.4905, lon: 97.6283 },
    "Bago": { lat: 17.3369, lon: 96.4797 },
    "Pathein": { lat: 16.7792, lon: 94.7381 },
    "Monywa": { lat: 22.1083, lon: 95.1358 },
    "Myitkyina": { lat: 25.3849, lon: 97.3924 },
    "Meiktila": { lat: 20.8775, lon: 95.8586 },
    "Magway": { lat: 20.152, lon: 94.932 },
    "Sittwe": { lat: 20.1462, lon: 92.8986 },
    "Dawei": { lat: 14.0973, lon: 98.1945 },
    "Pyay": { lat: 18.8203, lon: 95.268 },
    "Hpa-An": { lat: 16.8895, lon: 97.6337 },
    "Lashio": { lat: 22.935, lon: 97.749 },
    "Pakokku": { lat: 21.338, lon: 95.088 },
    "Myeik": { lat: 12.452, lon: 98.613 },
    "Kalay": { lat: 23.195, lon: 94.107 },
    "Loikaw": { lat: 19.6785, lon: 97.209 },
    "Thandwe": { lat: 18.4607, lon: 94.3554 },
    "Kengtung": { lat: 21.286, lon: 99.612 },
    "Yenangyaung": { lat: 20.461, lon: 94.881 },
    "Shwebo": { lat: 22.568, lon: 95.698 },
    "Sagaing": { lat: 21.878, lon: 95.977 },
    "Hakha": { lat: 22.644, lon: 93.611 },
    "Tachileik": { lat: 20.446, lon: 99.883 },
    "Nyaung-U": { lat: 21.195, lon: 94.923 },
    "Bilin": { lat: 17.657, lon: 97.217 },
    "Kyaukse": { lat: 21.606, lon: 96.132 },
    "Thaton": { lat: 16.923, lon: 97.367 },
    "Maubin": { lat: 16.731, lon: 95.654 },
    "Mudon": { lat: 16.257, lon: 97.725 },
    "Pyin Oo Lwin": { lat: 22.035, lon: 96.456 },
    "Thanbyuzayat": { lat: 15.987, lon: 97.733 },
    "Minbu": { lat: 20.181, lon: 94.882 },
    "Kyaikto": { lat: 17.305, lon: 97.014 },
    "Daik-U": { lat: 17.974, lon: 96.454 },
    "Myawaddy": { lat: 16.689, lon: 98.508 },
    "Kanbalu": { lat: 23.407, lon: 95.654 },
    "Mong Hsat": { lat: 20.538, lon: 99.259 },
    "Pantanaw": { lat: 17.123, lon: 95.222 },
    "Thayet": { lat: 19.312, lon: 95.182 },
    "Aunglan": { lat: 19.396, lon: 95.221 },
    "Namhkan": { lat: 23.866, lon: 97.395 },
    "Mong Nai": { lat: 20.670, lon: 97.618 },
    "Letpadan": { lat: 17.783, lon: 95.751 },
    "Bhamo": { lat: 24.268, lon: 97.233 }
};

const alertSound = new Audio('https://www.myinstants.com/media/sounds/alarm.mp3');

document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
    document.getElementById("city-select").addEventListener("change", fetchEarthquakes);
    fetchEarthquakes();
    setInterval(fetchEarthquakes, 180000); // Refresh every 3 min
});

async function fetchEarthquakes() {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/5.0_week.geojson');
    const data = await response.json();

    // Filter earthquakes in Myanmar (Latitude ~10 to 28, Longitude ~92 to 101)
    const myanmarQuakes = data.features.filter(eq => {
        const [lon, lat] = eq.geometry.coordinates;
        return lat >= 10 && lat <= 28 && lon >= 92 && lon <= 101;
    });

    displayQuakes(myanmarQuakes);
}

function displayQuakes(quakes) {
    const quakeList = document.getElementById("quake-list");
    quakeList.innerHTML = ""; // Clear old data

    quakes.forEach(eq => {
        const { place, mag, time } = eq.properties;
        const date = new Date(time).toLocaleString();
        const listItem = `<li><strong>${place}</strong> - Magnitude: ${mag}, Time: ${date}</li>`;
        quakeList.innerHTML += listItem;

        // Trigger alert sound
        alertSound.play();
        
        // Send browser notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Earthquake Alert!", {
                body: `Magnitude ${mag} earthquake detected near ${place}`,
                icon: "https://cdn-icons-png.flaticon.com/512/3150/3150982.png"
            });
        }
    });
}
