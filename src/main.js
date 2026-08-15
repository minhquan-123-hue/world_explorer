import { countries } from "./data/countries.js";
import { openCountryPanel, initPanel } from "./ui/panel.js";

// Map initialization
const map = L.map("map", {
    worldCopyJump: false,
    maxBounds: [[-85, -180], [85, 180]],
    maxBoundsViscosity: 1.0,
    wheelPxPerZoomLevel: 150,
    zoomDelta: 0.5,
    zoomSnap: 0.5,
    wheelDebounceTime: 80
}).setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    noWrap: true,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

initPanel();

// Load GeoJSON and add features
fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
    .then(response => {
        if (!response.ok) throw new Error("Failed to load GeoJSON data.");
        return response.json();
    })
    .then(data => {
        L.geoJSON(data, {
            style: { color: "#555", weight: 1, fillOpacity: 0.25 },
            onEachFeature: function (feature, layer) {
                const properties = feature.properties;
                const countryCode = properties["ISO3166-1-Alpha-2"];
                const country = countries[countryCode];
                if (!country) return;

                const labelHTML = `
                    <div class="country-label">

                        <div class="country-name">
                            ${country.name}
                        </div>

                        <div class="capital-name">
                            ${country.capital}
                        </div>

                    </div>
                `;

                const center = layer.getBounds().getCenter();

                L.marker(center, {
                    icon: L.divIcon({ className: "", html: labelHTML, iconSize: null, iconAnchor: [0, 0] }),
                    interactive: false
                }).addTo(map);

                layer.on("click", function () {
                    openCountryPanel(country, countryCode);
                });

                layer.on("mouseover", function () {
                    layer.setStyle({ weight: 2, fillOpacity: 0.4 });
                });

                layer.on("mouseout", function () {
                    layer.setStyle({ weight: 1, fillOpacity: 0.25 });
                });
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error("Could not load map data:", error);
    });
