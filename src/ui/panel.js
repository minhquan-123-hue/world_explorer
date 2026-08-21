import { getPopulation } from "../services/populationService.js";

const countryPanel = document.getElementById("country-panel");
const panelCountryName = document.getElementById("panel-country-name");
const closePanelButton = document.getElementById("close-panel");
const populationTotal = document.getElementById("population-total");
const populationMale = document.getElementById("population-male");
const populationFemale = document.getElementById("population-female");
const birthRate = document.getElementById("birth-rate");
const sexualActivity = document.getElementById("sexual-activity");
const performersList = document.getElementById("performers-list");

export function initPanel() {
    if (closePanelButton) {
        closePanelButton.addEventListener("click", closeCountryPanel);
    }
}

export function openCountryPanel(country, countryCode) {
    panelCountryName.textContent = country.name || "Không xác định";

    populationMale.textContent = country.male || "–";
    populationFemale.textContent = country.female || "–";
    birthRate.textContent = country.birthRate || "–";
    sexualActivity.textContent = country.sexualActivity || "–";

    performersList.innerHTML = "";
    (country.performers || []).forEach(performer => {
        const li = document.createElement("li");
        li.textContent = performer;
        performersList.appendChild(li);
    });

    populationTotal.textContent = "Đang tải...";
    countryPanel.classList.add("open");

    if (!countryCode) {
        populationTotal.textContent = "Không có dữ liệu";
        return;
    }

    getPopulation(countryCode)
        .then(population => {
            if (!population || population.value == null) {
                populationTotal.textContent = "Không có dữ liệu";
                return;
            }

            populationTotal.textContent =
                `${new Intl.NumberFormat("vi-VN").format(population.value)} (${population.year})`;
        })
        .catch(error => {
            console.error("Không thể tải dữ liệu dân số:", error);
            populationTotal.textContent = "Không có dữ liệu";
        });
}

export function closeCountryPanel() {
    countryPanel.classList.remove("open");
}
