// ui-helpers.js — DOM wiring, event listeners, and rendering
// nothing in here does any tax math — that all lives in tax-calculator.js

document.addEventListener('DOMContentLoaded', function () {

    const salaryInput     = document.getElementById('salaryInput');
    const salaryError     = document.getElementById('salaryError');
    const salaryHint      = document.getElementById('salaryHint');
    const periodToggle    = document.getElementById('periodToggle');
    const labelMonthly    = document.getElementById('toggleLabelMonthly');
    const labelAnnual     = document.getElementById('toggleLabelAnnual');
    const resultsArea     = document.getElementById('resultsArea');
    const breakdownPeriod = document.getElementById('breakdownPeriodLabel');
    const cardNetSub      = document.getElementById('cardNetSub');
    const cardGrossSub    = document.getElementById('cardGrossSub');

    // true = user is viewing annual figures
    let isAnnual = false;

    // ---- wire up the settings panel — any change triggers a recalc ----
    if (typeof initSettingsPanel === 'function') {
        initSettingsPanel(handleInput);
    }

    // ---- wire up the explanations accordion ----
    const expToggle = document.getElementById('explanationsToggle');
    const expBody   = document.getElementById('explanationsBody');
    if (expToggle && expBody) {
        expToggle.addEventListener('click', function () {
            const isOpen = !expBody.hidden;
            expBody.hidden = isOpen;
            expToggle.setAttribute('aria-expanded', !isOpen);
            expToggle.classList.toggle('explanations-panel__toggle--open', !isOpen);
        });
    }

    // ---- salary input — recalc on every keystroke ----
    if (salaryInput) {
        salaryInput.addEventListener('input', handleInput);
        salaryInput.addEventListener('paste', function () {
            setTimeout(handleInput, 0); // let paste land first
        });
    }

    // ---- period toggle ----
    if (periodToggle) {
        periodToggle.addEventListener('change', function () {
            isAnnual = periodToggle.checked;

            if (labelMonthly) labelMonthly.classList.toggle('period-toggle__label--active', !isAnnual);
            if (labelAnnual)  labelAnnual.classList.toggle('period-toggle__label--active',   isAnnual);

            const periodText = isAnnual ? 'Annual' : 'Monthly';
            if (breakdownPeriod) breakdownPeriod.textContent = periodText;
            if (cardNetSub)      cardNetSub.textContent      = 'per ' + (isAnnual ? 'year' : 'month');
            if (cardGrossSub)    cardGrossSub.textContent    = 'per ' + (isAnnual ? 'year' : 'month');

            handleInput();
        });
    }

    // ---- main handler — called on input, toggle change, and settings change ----
    function handleInput() {
        if (!salaryInput) return;
        const raw = salaryInput.value.trim();

        if (raw === '') {
            clearError();
            showHint('Enter your gross salary above to see your full tax breakdown.');
            hideResults();
            if (typeof resetCharts === 'function') resetCharts();
            return;
        }

        const val = parseFloat(raw);

        if (isNaN(val) || val < 0) {
            showError('Please enter a valid positive number.');
            hideResults();
            return;
        }

        if (val > 100000000) {
            showError('Salary exceeds the maximum supported value of KES 100,000,000.');
            hideResults();
            return;
        }

        clearError();
        hideHint();

        // input is always treated as monthly — divide by 12 when annual is toggled
        const monthlyGross = isAnnual ? val / 12 : val;
        const result       = computeTax(monthlyGross);
        const multiplier   = isAnnual ? 12 : 1;

        renderCards(result, multiplier);
        renderBreakdownTable(result, multiplier);
        renderBracketDetail(result);
        showResults();

        // let charts.js know there's new data (Phase 4 will use this)
        if (typeof updateCharts === 'function') {
            updateCharts(result, multiplier);
        }
    }

    // ---- render summary cards ----
    function renderCards(r, mult) {
        setText('cardGross', formatKES(r.gross * mult));
        setText('cardPAYE',  formatKES(r.paye  * mult));
        setText('cardSHIF',  formatKES(r.shif  * mult));
        setText('cardNSSF',  formatKES(r.nssf.total * mult));
        setText('cardLevy',  formatKES(r.housingLevy * mult));
        setText('cardNet',   formatKES(r.netPay * mult));

        // tier breakdown in the NSSF sub-label
        const nssfSub = document.getElementById('cardNSSFSub');
        if (nssfSub) {
            nssfSub.textContent =
                'T1: ' + formatKES(r.nssf.tierOne * mult) +
                ' | T2: ' + formatKES(r.nssf.tierTwo * mult);
        }

        setText('cardPAYERate', formatPercent(r.effectiveRate) + ' effective rate');
    }

    // ---- render breakdown table ----
    function renderBreakdownTable(r, mult) {
        const tbody = document.getElementById('breakdownBody');
        const tfoot = document.getElementById('breakdownFoot');
        if (!tbody || !tfoot) return;

        // use the active rates for formula labels so they stay in sync with overrides
        const rates = getActiveRates();
        const shifRatePct  = (rates.shif.rate * 100).toFixed(2) + '%';
        const nssfRatePct  = (rates.nssf.rate * 100).toFixed(0) + '%';
        const levyRatePct  = (rates.housingLevy.rate * 100).toFixed(1) + '%';
        const reliefAmt    = 'KES ' + formatAmount(rates.personalRelief);

        const g = r.gross * mult;
        const rows = [
            {
                label:   'Gross Salary',
                sub:     '',
                formula: 'Your input',
                amount:  g,
                cls:     'bt-amount--gross',
            },
            {
                label:   'SHIF Contribution',
                sub:     'Social Health Insurance Fund',
                formula: shifRatePct + ' of gross (min KES ' + formatAmount(rates.shif.minimum) + ')',
                amount:  -(r.shif * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'NSSF — Tier I',
                sub:     'National Social Security Fund',
                formula: nssfRatePct + ' of first KES ' + formatAmount(rates.nssf.tierOneCap),
                amount:  -(r.nssf.tierOne * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'NSSF — Tier II',
                sub:     '',
                formula: nssfRatePct + ' of KES ' + formatAmount(rates.nssf.tierOneCap) + ' – ' + formatAmount(rates.nssf.tierTwoCap),
                amount:  -(r.nssf.tierTwo * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'Affordable Housing Levy',
                sub:     '',
                formula: levyRatePct + ' of gross',
                amount:  -(r.housingLevy * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'Taxable Income',
                sub:     'Gross minus deductible items',
                formula: 'Gross − SHIF − NSSF − Levy',
                amount:  r.taxableIncome * mult,
                cls:     '',
            },
            {
                label:   'Gross PAYE',
                sub:     'Before personal relief',
                formula: 'Graduated brackets (10%–35%)',
                amount:  -(r.grossPAYE * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'Personal Relief',
                sub:     'KRA statutory relief',
                formula: reliefAmt + ' / month (fixed)',
                amount:  r.personalRelief * mult,
                cls:     'bt-amount--gross',
            },
            {
                label:   'PAYE Payable',
                sub:     'After personal relief',
                formula: 'Gross PAYE − Personal Relief',
                amount:  -(r.paye * mult),
                cls:     'bt-amount--deduction',
            },
        ];

        tbody.innerHTML = rows.map(row => `
            <tr>
                <td class="bt-label">
                    ${escHtml(row.label)}
                    ${row.sub ? '<span class="bt-label--sub">' + escHtml(row.sub) + '</span>' : ''}
                </td>
                <td class="bt-formula">${escHtml(row.formula)}</td>
                <td class="bt-amount ${row.cls}">${amountStr(row.amount)}</td>
            </tr>
        `).join('');

        tfoot.innerHTML = `
            <tr class="bt-total-row">
                <td class="bt-label" colspan="2">Total Deductions</td>
                <td class="bt-amount bt-amount--deduction">− ${formatAmount(r.totalDeductions * mult)}</td>
            </tr>
            <tr class="bt-net-row">
                <td class="bt-label" colspan="2">Net Take-Home Pay</td>
                <td class="bt-amount">${formatKES(r.netPay * mult)}</td>
            </tr>
        `;
    }

    // ---- render bracket detail table ----
    function renderBracketDetail(r) {
        const tbody   = document.getElementById('bracketTableBody');
        const summary = document.getElementById('bracketSummary');
        if (!tbody) return;

        const brackets  = getActiveRates().payeBrackets;
        const taxable   = r.taxableIncome;
        const breakdown = r.bracketBreakdown;

        const taxByIdx = {};
        breakdown.forEach((b, i) => { taxByIdx[i] = b; });

        tbody.innerHTML = brackets.map((bracket, i) => {
            const bd        = taxByIdx[i];
            const hasIncome = bd && bd.taxable > 0;
            const isActive  = bd && bd.taxable > 0 && taxable > bracket.min;
            const rowCls    = isActive ? 'bracket-row--active' : (hasIncome ? '' : 'bracket-row--zero');

            const maxLabel  = bracket.max === Infinity
                ? 'Above ' + formatAmount(bracket.min)
                : formatAmount(bracket.min) + ' – ' + formatAmount(bracket.max);

            return `
                <tr class="${rowCls}">
                    <td>${maxLabel}</td>
                    <td>${(bracket.rate * 100).toFixed(1)}%</td>
                    <td>${hasIncome ? formatAmount(bd.taxable) : '0.00'}</td>
                    <td>${hasIncome ? formatAmount(bd.tax)     : '0.00'}</td>
                </tr>
            `;
        }).join('');

        setText('effectiveRate', formatPercent(r.effectiveRate));
        setText('marginalRate',  formatPercent(r.marginalRate));

        if (summary) {
            if (r.gross === 0) {
                summary.innerHTML = 'Enter a salary above to see the bracket breakdown.';
            } else if (r.paye === 0) {
                summary.innerHTML =
                    '<strong>No PAYE owed.</strong> Your personal relief (KES ' +
                    formatAmount(r.personalRelief) +
                    '/month) fully offsets the gross tax on your taxable income of KES ' +
                    formatAmount(r.taxableIncome) + '.';
            } else {
                summary.innerHTML =
                    'Your taxable income is <strong>KES ' + formatAmount(r.taxableIncome) + '</strong>. ' +
                    'Gross PAYE comes to <strong>KES ' + formatAmount(r.grossPAYE) + '</strong>, ' +
                    'reduced by personal relief of <strong>KES ' + formatAmount(r.personalRelief) + '</strong> ' +
                    'leaving a net PAYE of <strong>KES ' + formatAmount(r.paye) + '</strong>. ' +
                    'Your effective rate on gross salary is <strong>' + formatPercent(r.effectiveRate) + '</strong>.';
            }
        }
    }

    // ---- visibility helpers ----
    function showResults() {
        if (resultsArea) resultsArea.classList.remove('results-area--empty');
        hideHint();
    }

    function hideResults() {
        if (resultsArea) resultsArea.classList.add('results-area--empty');
    }

    function showHint(msg) {
        if (salaryHint) {
            salaryHint.textContent = msg;
            salaryHint.style.display = '';
        }
    }

    function hideHint() {
        if (salaryHint) salaryHint.style.display = 'none';
    }

    function showError(msg) {
        if (salaryError) salaryError.textContent = msg;
        if (salaryInput) salaryInput.classList.add('input--error');
    }

    function clearError() {
        if (salaryError) salaryError.textContent = '';
        if (salaryInput) salaryInput.classList.remove('input--error');
    }

    // ---- tiny DOM helpers ----
    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function amountStr(val) {
        if (val < 0) return '− ' + formatAmount(Math.abs(val));
        return formatAmount(val);
    }

    // guard against XSS in innerHTML strings
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // start hidden until a salary is entered
    hideResults();
});
