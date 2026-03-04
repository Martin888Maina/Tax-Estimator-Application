// core PAYE engine — pure functions, no DOM touching here
// all figures are monthly; the UI layer handles the annual toggle

// active rates start as a deep copy of the constants
// settings-override.js will mutate activeRates when the user edits them
let activeRates = null;

function getActiveRates() {
    if (!activeRates) {
        // first call — clone the constants so overrides don't corrupt the originals
        activeRates = JSON.parse(JSON.stringify(TAX_CONSTANTS));
        // Infinity doesn't survive JSON round-trip, so restore it
        activeRates.payeBrackets[activeRates.payeBrackets.length - 1].max = Infinity;
    }
    return activeRates;
}

function resetActiveRates() {
    activeRates = null;
    getActiveRates(); // rebuild from constants
}

// ---- SHIF ----
function calcSHIF(gross) {
    const { rate, minimum } = getActiveRates().shif;
    if (gross <= 0) return 0;
    return Math.max(gross * rate, minimum);
}

// ---- NSSF ----
// returns { tierOne, tierTwo, total }
function calcNSSF(gross) {
    if (gross <= 0) return { tierOne: 0, tierTwo: 0, total: 0 };

    const { rate, tierOneCap, tierTwoCap } = getActiveRates().nssf;

    // edge case: if someone zeros out the caps in settings, skip gracefully
    if (!tierOneCap && !tierTwoCap) return { tierOne: 0, tierTwo: 0, total: 0 };

    let tierOne = 0;
    let tierTwo = 0;

    if (gross <= tierOneCap) {
        tierOne = gross * rate;
    } else if (gross <= tierTwoCap) {
        tierOne = tierOneCap * rate;
        tierTwo = (gross - tierOneCap) * rate;
    } else {
        // capped — hits the max at 6% of 108,000 = 6,480
        tierOne = tierOneCap * rate;
        tierTwo = (tierTwoCap - tierOneCap) * rate;
    }

    return {
        tierOne: Math.round(tierOne * 100) / 100,
        tierTwo: Math.round(tierTwo * 100) / 100,
        total:   Math.round((tierOne + tierTwo) * 100) / 100,
    };
}

// ---- Housing Levy ----
function calcHousingLevy(gross) {
    const { rate } = getActiveRates().housingLevy;
    if (gross <= 0 || !rate) return 0;
    return gross * rate;
}

// ---- PAYE ----
// taxableIncome = gross - SHIF - NSSF - housingLevy (all three are deductible)
// returns { grossPAYE, personalRelief, payable, taxableIncome, bracketBreakdown }
function calcPAYE(taxableIncome) {
    const rates    = getActiveRates();
    const brackets = rates.payeBrackets;
    const relief   = rates.personalRelief;

    if (taxableIncome <= 0) {
        return { grossPAYE: 0, personalRelief: relief, payable: 0, taxableIncome: 0, bracketBreakdown: [] };
    }

    let remaining = taxableIncome;
    let grossPAYE = 0;
    const bracketBreakdown = [];

    for (const bracket of brackets) {
        if (remaining <= 0) break;

        const bandSize   = bracket.max === Infinity ? remaining : bracket.max - bracket.min;
        const taxable    = Math.min(remaining, bandSize);
        const tax        = taxable * bracket.rate;

        bracketBreakdown.push({
            min:     bracket.min,
            max:     bracket.max,
            rate:    bracket.rate,
            taxable: Math.round(taxable * 100) / 100,
            tax:     Math.round(tax * 100) / 100,
        });

        grossPAYE += tax;
        remaining -= taxable;
    }

    // we subtract personal relief after computing raw PAYE
    const payable = Math.max(0, grossPAYE - relief);

    return {
        grossPAYE:        Math.round(grossPAYE * 100) / 100,
        personalRelief:   relief,
        payable:          Math.round(payable * 100) / 100,
        taxableIncome:    Math.round(taxableIncome * 100) / 100,
        bracketBreakdown,
    };
}

// ---- MAIN: compute everything from a gross monthly figure ----
// returns a result object that the UI layer consumes directly
function computeTax(gross) {
    // bail early if gross is zero or negative
    if (!gross || gross <= 0) {
        return zeroResult();
    }

    const shif        = calcSHIF(gross);
    const nssf        = calcNSSF(gross);
    const housingLevy = calcHousingLevy(gross);

    // taxable income = gross minus the three deductible items
    const taxableIncome = Math.max(0, gross - shif - nssf.total - housingLevy);
    const paye          = calcPAYE(taxableIncome);

    const totalDeductions = paye.payable + shif + nssf.total + housingLevy;
    const netPay          = Math.max(0, gross - totalDeductions);

    // effective rate = PAYE payable / gross (not taxable income)
    const effectiveRate = gross > 0 ? paye.payable / gross : 0;
    const marginalRate  = getMarginalRate(taxableIncome);

    return {
        gross,
        shif:             Math.round(shif * 100) / 100,
        nssf:             nssf,
        housingLevy:      Math.round(housingLevy * 100) / 100,
        taxableIncome:    paye.taxableIncome,
        grossPAYE:        paye.grossPAYE,
        personalRelief:   paye.personalRelief,
        paye:             paye.payable,
        totalDeductions:  Math.round(totalDeductions * 100) / 100,
        netPay:           Math.round(netPay * 100) / 100,
        effectiveRate,
        marginalRate,
        bracketBreakdown: paye.bracketBreakdown,
    };
}

// figure out which bracket the taxable income lands in for the marginal rate display
function getMarginalRate(taxableIncome) {
    const brackets = getActiveRates().payeBrackets;
    for (let i = brackets.length - 1; i >= 0; i--) {
        if (taxableIncome > brackets[i].min) {
            return brackets[i].rate;
        }
    }
    return brackets[0].rate;
}

// clean zero result — used for empty input
function zeroResult() {
    const relief = getActiveRates().personalRelief;
    return {
        gross: 0,
        shif: 0,
        nssf: { tierOne: 0, tierTwo: 0, total: 0 },
        housingLevy: 0,
        taxableIncome: 0,
        grossPAYE: 0,
        personalRelief: relief,
        paye: 0,
        totalDeductions: 0,
        netPay: 0,
        effectiveRate: 0,
        marginalRate: 0,
        bracketBreakdown: [],
    };
}
