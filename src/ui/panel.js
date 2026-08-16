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
    panelCountryName.textContent = country.name || "Unknown";

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

    populationTotal.textContent = "Loading...";
    countryPanel.classList.add("open");

    if (!countryCode) {
        populationTotal.textContent = "Data unavailable";
        return;
    }

    getPopulation(countryCode)
        .then(population => {
            if (!population || population.value == null) {
                populationTotal.textContent = "Data unavailable";
                return;
            }

            populationTotal.textContent =
                `${new Intl.NumberFormat("en-US").format(population.value)} (${population.year})`;
        })
        .catch(error => {
            console.error("Could not load population:", error);
            populationTotal.textContent = "Data unavailable";
        });
}

export function closeCountryPanel() {
    countryPanel.classList.remove("open");
}
