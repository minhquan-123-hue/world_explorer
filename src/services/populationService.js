import { getPopulationFromWorldBank } from "./worldBank.js";
import { getStoredPopulation, savePopulation } from "./populationStorage.js";

export async function getPopulation(countryCode) {
    try {
        const freshPopulation = await getPopulationFromWorldBank(countryCode);

        if (freshPopulation) {
            savePopulation(countryCode, freshPopulation);
            return freshPopulation;
        }
    } catch (error) {
        console.warn("World Bank unavailable, using stored population:", error);
    }

    return getStoredPopulation(countryCode);
}
