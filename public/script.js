let map;
let markers = [];
const logBox = document.getElementById('terminalLog');
const resultsDiv = document.getElementById('results');

// 1. Inisialisasi Peta Awal (Fokus ke Indonesia)
function initMap(lat = -2.5489, lng = 118.0149, zoom = 5) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: zoom,
        styles: [
            { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
            { "elementType": "labels.text.fill", "stylers": [{ "color": "#00ff41" }] },
            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
        ]
    });
}

// 2. Fungsi Log Terminal
function addLog(msg, color = "#00ff41") {
    const p = document.createElement('p');
    p.style.color = color;
    p.innerText = `[${new Date().toLocaleTimeString()}] > ${msg}`;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

// 3. Fungsi Eksekusi Utama
async function runIntel() {
    const city = document.getElementById('cityInput').value;
    const device = document.getElementById('deviceInput').value;
    
    addLog(`SEARCHING DATABASE FOR SECTOR: ${city || 'ID-GLOBAL'}...`, "#5500ff");
    resultsDiv.innerHTML = '';
    
    // Hapus marker lama
    markers.forEach(m => m.setMap(null));
    markers = [];

    try {
        const res = await fetch(`/api/scan?city=${city}&device=${device}`);
        const data = await res.json();

        // Load Script Google Maps jika belum ada
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${data.mapsKey}&callback=setupMapAfterLoad`;
            document.head.appendChild(script);
            window.setupMapAfterLoad = () => {
                initMap();
                processResults(data.matches);
            };
        } else {
            processResults(data.matches);
        }
    } catch (err) {
        addLog(`ACCESS DENIED: CONNECTION TIMEOUT`, "#ff0000");
    }
}

// 4. Memproses Koordinat & Marker
function processResults(matches) {
    if (!matches || matches.length === 0) {
        addLog(`NO VULNERABILITIES FOUND.`, "#ff0000");
        return;
    }

    addLog(`ACQUIRED ${matches.length} GEO-COORDINATES.`, "#00ff41");

    matches.forEach((item, index) => {
        const lat = item.location.latitude;
        const lng = item.location.longitude;
        const url = `http://${item.ip_str}:${item.port}`;

        // Tambahkan ke Peta
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: `TARGET_${index}`,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: "#ff0000",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff"
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="color:#000"><b>IP:</b> ${item.ip_str}<br><b>CITY:</b> ${item.location.city}</div>`
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
            addLog(`FOCUSED ON TARGET: ${item.ip_str}`, "#ffff00");
        });

        markers.push(marker);

        // Render Card di bawah Map
        resultsDiv.innerHTML += `
            <div class="neo-border p-3 bg-[#111] text-[10px] font-mono">
                <div class="h-24 bg-black mb-2 overflow-hidden border border-[#333]">
                    <img src="/api/proxy?url=${encodeURIComponent(url + '/snapshot.jpg')}" 
                         class="w-full h-full object-cover opacity-70"
                         onerror="this.src='https://via.placeholder.com/300x150?text=ENCRYPTED'">
                </div>
                <p>IP: ${item.ip_str}</p>
                <p>COORD: ${lat}, ${lng}</p>
                <button onclick="map.setCenter({lat:${lat}, lng:${lng}}); map.setZoom(15);" 
                        class="mt-2 w-full border border-[#00ff41] py-1 hover:bg-[#00ff41] hover:text-black transition">
                    LOCATE
                </button>
            </div>
        `;
    });

    // Pindahkan kamera ke marker pertama jika ada
    if (matches.length > 0) {
        map.setCenter({ lat: matches[0].location.latitude, lng: matches[0].location.longitude });
        map.setZoom(10);
    }
}
