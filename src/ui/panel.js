import { getPopulationFromWorldBank } from "../services/worldBank.js";

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

    // Immediate UI from local data (if available)
    populationMale.textContent = country.male || "–";
    populationFemale.textContent = country.female || "–";
    birthRate.textContent = country.birthRate || "–";
    sexualActivity.textContent = country.sexualActivity || "–";

    // Performers
    performersList.innerHTML = "";
    (country.performers || []).forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        performersList.appendChild(li);
    });

    // Population: optimistic loading from World Bank
    if (populationTotal) populationTotal.textContent = "Loading...";

    // Fetch real population and update
    if (countryCode) {
        getPopulationFromWorldBank(countryCode)
            .then(pop => {
                if (pop && pop.value != null) {
                    populationTotal.textContent = new Intl.NumberFormat("en-US").format(pop.value);
                } else {
                    // fallback to local bundled value
                    populationTotal.textContent = country.population || "Data unavailable";
                }
            })
            .catch(() => {
                populationTotal.textContent = country.population || "Data unavailable";
            });
    } else {
        populationTotal.textContent = country.population || "Data unavailable";
    }

    countryPanel.classList.add("open");
}

export function closeCountryPanel() {
    countryPanel.classList.remove("open");
}
