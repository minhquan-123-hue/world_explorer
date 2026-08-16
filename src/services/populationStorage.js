const STORAGE_KEY = "world-explorer:population";

export function getStoredPopulation(countryCode) {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return stored[countryCode] || null;
    } catch (error) {
        console.error("Could not read stored population:", error);
        return null;
    }
}

export function savePopulation(countryCode, population) {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        stored[countryCode] = population;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
        console.error("Could not save population:", error);
    }
}
