// ui-helpers.js — DOM wiring, event listeners, and rendering
// nothing in here does any tax math — that all lives in tax-calculator.js

document.addEventListener('DOMContentLoaded', function () {

    const salaryInput       = document.getElementById('salaryInput');
    const salaryError       = document.getElementById('salaryError');
    const salaryHint        = document.getElementById('salaryHint');
    const periodToggle      = document.getElementById('periodToggle');
    const labelMonthly      = document.getElementById('toggleLabelMonthly');
    const labelAnnual       = document.getElementById('toggleLabelAnnual');
    const resultsArea       = document.getElementById('resultsArea');
    const breakdownPeriod   = document.getElementById('breakdownPeriodLabel');
    const cardNetSub        = document.getElementById('cardNetSub');
    const cardGrossSub      = document.getElementById('cardGrossSub');

    // true = user is viewing annual figures
    let isAnnual = false;

    // ---- salary input — recalc on every keystroke ----
    salaryInput.addEventListener('input', handleInput);
    salaryInput.addEventListener('paste', function () {
        setTimeout(handleInput, 0); // give paste time to land
    });

    // ---- period toggle ----
    periodToggle.addEventListener('change', function () {
        isAnnual = periodToggle.checked;

        labelMonthly.classList.toggle('period-toggle__label--active', !isAnnual);
        labelAnnual.classList.toggle('period-toggle__label--active',  isAnnual);

        const periodText = isAnnual ? 'Annual' : 'Monthly';
        if (breakdownPeriod) breakdownPeriod.textContent = periodText;
        if (cardNetSub)    cardNetSub.textContent    = 'per ' + (isAnnual ? 'year' : 'month');
        if (cardGrossSub)  cardGrossSub.textContent  = 'per ' + (isAnnual ? 'year' : 'month');

        handleInput(); // re-render with new period
    });

    // ---- main handler ----
    function handleInput() {
        const raw = salaryInput.value.trim();

        // empty input — show the hint, hide results
        if (raw === '') {
            clearError();
            showHint('Enter your gross salary above to see your full tax breakdown.');
            hideResults();
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

        // the input is always treated as monthly — if the user toggled to annual we divide by 12
        const monthlyGross = isAnnual ? val / 12 : val;
        const result       = computeTax(monthlyGross);
        const multiplier   = isAnnual ? 12 : 1;

        renderCards(result, multiplier);
        renderBreakdownTable(result, multiplier);
        renderBracketDetail(result);
        showResults();
    }

    // ---- render summary cards ----
    function renderCards(r, mult) {
        setText('cardGross', formatKES(r.gross * mult));
        setText('cardPAYE',  formatKES(r.paye  * mult));
        setText('cardSHIF',  formatKES(r.shif  * mult));
        setText('cardNSSF',  formatKES(r.nssf.total * mult));
        setText('cardLevy',  formatKES(r.housingLevy * mult));
        setText('cardNet',   formatKES(r.netPay * mult));

        // show NSSF tier breakdown in the sub-label
        const nssfSub = document.getElementById('cardNSSFSub');
        if (nssfSub) {
            nssfSub.textContent =
                'T1: ' + formatKES(r.nssf.tierOne * mult) +
                ' | T2: ' + formatKES(r.nssf.tierTwo * mult);
        }

        // effective rate on PAYE card
        setText('cardPAYERate', formatPercent(r.effectiveRate) + ' effective rate');
    }

    // ---- render breakdown table ----
    function renderBreakdownTable(r, mult) {
        const tbody = document.getElementById('breakdownBody');
        const tfoot = document.getElementById('breakdownFoot');
        if (!tbody || !tfoot) return;

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
                formula: '2.75% of gross (min KES 300)',
                amount:  -(r.shif * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'NSSF — Tier I',
                sub:     'National Social Security Fund',
                formula: '6% of first KES 9,000',
                amount:  -(r.nssf.tierOne * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'NSSF — Tier II',
                sub:     '',
                formula: '6% of KES 9,001 – 108,000',
                amount:  -(r.nssf.tierTwo * mult),
                cls:     'bt-amount--deduction',
            },
            {
                label:   'Affordable Housing Levy',
                sub:     '',
                formula: '1.5% of gross',
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
                formula: 'KES 2,400 / month (fixed)',
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

        // tfoot — totals
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

        // build a lookup of per-bracket tax from the calc result
        const taxByBracketIndex = {};
        breakdown.forEach((b, i) => { taxByBracketIndex[i] = b; });

        tbody.innerHTML = brackets.map((bracket, i) => {
            const bd       = taxByBracketIndex[i];
            const hasIncome = bd && bd.taxable > 0;
            const isActive  = bd && bd.taxable > 0 && taxable > bracket.min;
            const rowCls    = isActive ? 'bracket-row--active' : (bd ? '' : 'bracket-row--zero');

            const maxLabel = bracket.max === Infinity ? 'Above ' + formatAmount(bracket.min) : formatAmount(bracket.min) + ' – ' + formatAmount(bracket.max);
            const taxable_ = hasIncome ? formatAmount(bd.taxable) : '0.00';
            const taxAmt   = hasIncome ? formatAmount(bd.tax)     : '0.00';

            return `
                <tr class="${rowCls}">
                    <td>${maxLabel}</td>
                    <td>${(bracket.rate * 100).toFixed(1)}%</td>
                    <td>${taxable_}</td>
                    <td>${taxAmt}</td>
                </tr>
            `;
        }).join('');

        // update the rate badges
        setText('effectiveRate', formatPercent(r.effectiveRate));
        setText('marginalRate',  formatPercent(r.marginalRate));

        // short plain-english summary below the bracket table
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
                    'Your gross PAYE is <strong>KES ' + formatAmount(r.grossPAYE) + '</strong>, ' +
                    'reduced by personal relief of <strong>KES ' + formatAmount(r.personalRelief) + '</strong> ' +
                    'to give a net PAYE of <strong>KES ' + formatAmount(r.paye) + '</strong>. ' +
                    'Your effective tax rate on gross income is <strong>' + formatPercent(r.effectiveRate) + '</strong>.';
            }
        }
    }

    // ---- visibility helpers ----
    function showResults() {
        resultsArea.classList.remove('results-area--empty');
        if (salaryHint) salaryHint.style.display = 'none';
    }

    function hideResults() {
        resultsArea.classList.add('results-area--empty');
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
        if (salaryError) {
            salaryError.textContent = msg;
            salaryInput.classList.add('input--error');
        }
    }

    function clearError() {
        if (salaryError) {
            salaryError.textContent = '';
            salaryInput.classList.remove('input--error');
        }
    }

    // ---- tiny DOM helpers ----
    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function amountStr(val) {
        // show minus sign for negatives in the table
        if (val < 0) return '− ' + formatAmount(Math.abs(val));
        return formatAmount(val);
    }

    // prevent XSS when injecting user-derived strings into innerHTML
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // start with results hidden
    hideResults();
});
