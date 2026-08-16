export async function getPopulationFromWorldBank(countryCode) {
    const url =
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`World Bank API error: ${response.status}`);
    }

    const data = await response.json();
    const records = data[1];

    if (!records || records.length === 0) {
        throw new Error(`No population data found for ${countryCode}`);
    }

    const latestRecord = records.find(record => record.value !== null);

    if (!latestRecord) {
        throw new Error(`Population value not available for ${countryCode}`);
    }

    return {
        value: latestRecord.value,
        year: latestRecord.date,
        source: "World Bank",
        indicator: "SP.POP.TOTL"
    };
}
