export async function getPopulationFromWorldBank(countryCode) {

    const url =
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`World Bank API error: ${response.status}`);
        }

        const data = await response.json();

        const records = data[1];

        if (!records || records.length === 0) {
            throw new Error(`No population data found for ${countryCode}`);
        }

        // Find the newest available population value
        const latestRecord = records.find(r => r.value !== null);

        if (!latestRecord) {
            throw new Error(`Population value not available for ${countryCode}`);
        }

        return {
            value: latestRecord.value,
            year: latestRecord.date
        };

    } catch (error) {
        console.error("World Bank population error:", error);
        return null;
    }
}
