// KES formatting — always 2 decimal places, comma-separated thousands
// using the built-in Intl API so we don't need a library for this

const KES = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// returns a string like "KES 45,678.00"
function formatKES(amount) {
    return KES.format(amount);
}

// just the number part — used inside table cells where the "KES" prefix is already in the header
function formatAmount(amount) {
    return amount.toLocaleString('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// percentage with one decimal — e.g. "23.4%"
function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
}
