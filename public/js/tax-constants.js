// KRA rates effective July 2023 (Finance Act 2023) with SHIF + NSSF updates through 2026
// this is the ONLY file that needs editing when rates change — everything else reads from here

const TAX_CONSTANTS = {

    // five PAYE brackets — monthly taxable income thresholds
    // the 'max' on the last bracket is Infinity so we never need a special case
    payeBrackets: [
        { min: 0,       max: 24000,   rate: 0.10 },
        { min: 24000,   max: 32333,   rate: 0.25 },
        { min: 32333,   max: 500000,  rate: 0.30 },
        { min: 500000,  max: 800000,  rate: 0.325 },
        { min: 800000,  max: Infinity, rate: 0.35 },
    ],

    // personal relief — fixed at KES 2,400/month since April 2020
    personalRelief: 2400,

    // SHIF replaced NHIF in October 2024 — flat 2.75%, minimum KES 300
    shif: {
        rate: 0.0275,
        minimum: 300,
    },

    // NSSF under the new Act — 6% of pensionable pay, Tier I and Tier II
    // employee contribution is capped at 6% of KES 108,000 = KES 6,480
    nssf: {
        rate: 0.06,
        tierOneCap: 9000,     // Tier I covers the first KES 9,000 of pensionable pay
        tierTwoCap: 108000,   // Tier II covers up to KES 108,000
    },

    // Housing Levy — 1.5% of gross, reintroduced March 2024
    housingLevy: {
        rate: 0.015,
    },

    // insurance relief — optional, 15% of premiums up to KES 5,000/month
    // not calculated by default unless user enters a premium amount
    insuranceRelief: {
        rate: 0.15,
        maxMonthly: 5000,
    },
};
