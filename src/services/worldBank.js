export async function getPopulationFromWorldBank(countryCode) {
    return getIndicatorFromWorldBank(countryCode, "SP.POP.TOTL");
}

export async function getGenderPopulationFromWorldBank(countryCode) {
    const [male, female] = await Promise.all([
        getIndicatorFromWorldBank(countryCode, "SP.POP.TOTL.MA.IN"),
        getIndicatorFromWorldBank(countryCode, "SP.POP.TOTL.FE.IN")
    ]);

    return { male, female };
}

export async function getFertilityRateFromWorldBank(countryCode) {
    return getIndicatorFromWorldBank(countryCode, "SP.DYN.TFRT.IN");
}

async function getIndicatorFromWorldBank(countryCode, indicator) {
    const url =
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json`;

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
        indicator
    };
}
