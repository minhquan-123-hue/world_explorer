import {
    getFertilityRate,
    getGenderPopulation,
    getPopulation
} from "../services/populationService.js";

const countryPanel = document.getElementById("country-panel");
const panelCountryName = document.getElementById("panel-country-name");
const closePanelButton = document.getElementById("close-panel");
const populationTotal = document.getElementById("population-total");
const populationMale = document.getElementById("population-male");
const populationFemale = document.getElementById("population-female");
const birthRate = document.getElementById("birth-rate");
const sexualActivity = document.getElementById("sexual-activity");
const performersList = document.getElementById("performers-list");

export function getSexualActivityLabel(childrenPerWoman) {
    if (!Number.isFinite(childrenPerWoman)) {
        return "Không có dữ liệu";
    }

    if (childrenPerWoman < 1) {
        return "Nhiều lần trong tuần";
    }

    if (childrenPerWoman < 2) {
        return "Mất kiểm soát siêu lần";
    }

    return "Rất nhiều, không thể đếm được";
}

export function initPanel() {
    if (closePanelButton) {
        closePanelButton.addEventListener("click", closeCountryPanel);
    }
}

export function openCountryPanel(country, countryCode) {
    panelCountryName.textContent = country.name || "Không xác định";

    populationMale.textContent = "Đang tải...";
    populationFemale.textContent = "Đang tải...";
    birthRate.textContent = "Đang tải...";
    sexualActivity.textContent = "Đang tính...";

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
        populationMale.textContent = "Không có dữ liệu";
        populationFemale.textContent = "Không có dữ liệu";
        birthRate.textContent = "Không có dữ liệu";
        sexualActivity.textContent = "Không có dữ liệu";
        return;
    }

    getFertilityRate(countryCode)
        .then(fertilityRateData => {
            if (!fertilityRateData || fertilityRateData.value == null) {
                birthRate.textContent = "Không có dữ liệu";
                return;
            }

            const formattedFertilityRate = new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 2
            }).format(fertilityRateData.value);
            birthRate.textContent =
                `${formattedFertilityRate} con / phụ nữ (${fertilityRateData.year})`;
            sexualActivity.textContent = getSexualActivityLabel(fertilityRateData.value);
        })
        .catch(error => {
            console.error("Không thể tải tổng tỷ suất sinh:", error);
            birthRate.textContent = "Không có dữ liệu";
            sexualActivity.textContent = "Không có dữ liệu";
        });

    getGenderPopulation(countryCode)
        .then(genderPopulation => {
            const numberFormatter = new Intl.NumberFormat("vi-VN");
            const malePopulation = genderPopulation?.male;
            const femalePopulation = genderPopulation?.female;

            populationMale.textContent = malePopulation?.value == null
                ? "Không có dữ liệu"
                : `${numberFormatter.format(malePopulation.value)} (${malePopulation.year})`;
            populationFemale.textContent = femalePopulation?.value == null
                ? "Không có dữ liệu"
                : `${numberFormatter.format(femalePopulation.value)} (${femalePopulation.year})`;
        })
        .catch(error => {
            console.error("Không thể tải dữ liệu dân số nam nữ:", error);
            populationMale.textContent = "Không có dữ liệu";
            populationFemale.textContent = "Không có dữ liệu";
        });

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
