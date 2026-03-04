// charts.js — Chart.js donut + horizontal bar chart for income breakdown
// both charts are created once and updated in-place on every recalc

let donutChart = null;
let barChart   = null;

// called from ui-helpers.js after every successful calculation
function updateCharts(result, multiplier) {
    const gross = result.gross * multiplier;
    if (gross <= 0) {
        resetCharts();
        return;
    }

    const paye  = result.paye         * multiplier;
    const shif  = result.shif         * multiplier;
    const nssf  = result.nssf.total   * multiplier;
    const levy  = result.housingLevy  * multiplier;
    const net   = result.netPay       * multiplier;

    const labels = ['Net Take-Home', 'PAYE Tax', 'SHIF', 'NSSF', 'Housing Levy'];
    const data   = [net, paye, shif, nssf, levy];
    const colors = [
        getComputedColor('--color-net'),
        getComputedColor('--color-paye'),
        getComputedColor('--color-shif'),
        getComputedColor('--color-nssf'),
        getComputedColor('--color-levy'),
    ];

    initOrUpdateDonut(labels, data, colors);
    initOrUpdateBar(labels, data, colors, gross);
    updateBracketVisualizer(result);
}

// ---- donut chart ----
function initOrUpdateDonut(labels, data, colors) {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;

    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor:  colors,
            borderColor:      colors.map(() => '#fff'),
            borderWidth:      3,
            hoverBorderWidth: 4,
            hoverOffset:      8,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        animation: { duration: 400, easing: 'easeInOutQuart' },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding:   16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    font: { size: 12, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
                    color: '#6B7280',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        const val    = ctx.parsed;
                        const total  = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const pct    = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
                        return ' ' + ctx.label + ': KES ' + val.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '  (' + pct + '%)';
                    },
                },
                backgroundColor: '#1F2937',
                titleColor:      '#F9FAFB',
                bodyColor:       '#D1D5DB',
                padding:          12,
                cornerRadius:     8,
            },
        },
    };

    if (donutChart) {
        donutChart.data    = chartData;
        donutChart.options = options;
        donutChart.update();
    } else {
        donutChart = new Chart(canvas, { type: 'doughnut', data: chartData, options });
    }
}

// ---- horizontal stacked bar chart ----
function initOrUpdateBar(labels, data, colors, gross) {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;

    // each deduction as its own dataset so we get per-segment colors
    const datasets = labels.map((label, i) => ({
        label,
        data:            [data[i]],
        backgroundColor: colors[i],
        borderColor:     colors[i],
        borderWidth:     0,
        borderRadius:    i === labels.length - 1 ? { topRight: 4, bottomRight: 4 } : 0,
        borderSkipped:   false,
    }));

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeInOutQuart' },
        scales: {
            x: {
                stacked: true,
                grid:    { display: false },
                ticks: {
                    callback: function (val) {
                        // shorten large numbers for the axis labels
                        if (val >= 1000000) return 'KES ' + (val / 1000000).toFixed(1) + 'M';
                        if (val >= 1000)    return 'KES ' + (val / 1000).toFixed(0)     + 'K';
                        return 'KES ' + val;
                    },
                    color: '#6B7280',
                    font:  { size: 11 },
                },
                max: gross,
                border: { display: false },
            },
            y: {
                stacked: true,
                display: false,
            },
        },
        plugins: {
            legend: { display: false }, // we have our own color legend in the donut
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        const val   = ctx.parsed.x;
                        const pct   = gross > 0 ? ((val / gross) * 100).toFixed(1) : '0.0';
                        return ' ' + ctx.dataset.label + ': KES ' + val.toLocaleString('en-KE', { minimumFractionDigits: 2 }) + '  (' + pct + '% of gross)';
                    },
                },
                backgroundColor: '#1F2937',
                titleColor:      '#F9FAFB',
                bodyColor:       '#D1D5DB',
                padding:          12,
                cornerRadius:     8,
            },
        },
    };

    if (barChart) {
        barChart.data    = { labels: [''], datasets };
        barChart.options = options;
        barChart.update();
    } else {
        barChart = new Chart(canvas, { type: 'bar', data: { labels: [''], datasets }, options });
    }
}

// ---- bracket visualizer ----
// paints a row of coloured segments — one per bracket — with the user's income highlighted
function updateBracketVisualizer(result) {
    const container = document.getElementById('bracketVizContainer');
    if (!container) return;

    const brackets = getActiveRates().payeBrackets;
    const taxable  = result.taxableIncome;

    // colour ramp from light to deep orange across the brackets
    const bracketColors = ['#FEF3C7', '#FDE68A', '#FCD34D', '#F97316', '#C2410C'];

    // total range to display — cap at the taxable income or tier 5 start, whichever is higher
    // we always show all 5 brackets regardless of salary so the user sees the full picture
    const displayMax = Math.max(taxable * 1.2, brackets[3].max * 1.1, 900000);

    container.innerHTML = brackets.map((b, i) => {
        const segMin   = b.min;
        const segMax   = b.max === Infinity ? displayMax : Math.min(b.max, displayMax);
        const width    = ((segMax - segMin) / displayMax) * 100;
        const isActive = taxable > segMin; // user's income reaches this bracket

        return `
            <div class="bviz-segment ${isActive ? 'bviz-segment--active' : 'bviz-segment--inactive'}"
                 style="width: ${Math.max(width, 4).toFixed(2)}%; background: ${isActive ? bracketColors[i] : '#F3F4F6'};"
                 title="Bracket ${i + 1}: ${(b.rate * 100).toFixed(0)}% on KES ${b.min.toLocaleString()} – ${b.max === Infinity ? 'above' : b.max.toLocaleString()}">
                <span class="bviz-segment__rate">${(b.rate * 100).toFixed(0)}%</span>
            </div>
        `;
    }).join('');

    // update the text labels below the bar
    const labelsEl = document.getElementById('bracketVizLabels');
    if (labelsEl) {
        labelsEl.innerHTML = brackets.map((b, i) => {
            const isActive = taxable > b.min;
            return `
                <div class="bviz-label ${isActive ? 'bviz-label--active' : ''}">
                    <span class="bviz-label__rate">${(b.rate * 100).toFixed(0)}%</span>
                    <span class="bviz-label__threshold">
                        ${b.max === Infinity ? 'Above KES ' + b.min.toLocaleString() : 'Up to KES ' + b.max.toLocaleString()}
                    </span>
                </div>
            `;
        }).join('');
    }

    // marker line showing where the user's taxable income sits on the bar
    const markerEl = document.getElementById('bracketVizMarker');
    if (markerEl && taxable > 0) {
        const pct = Math.min((taxable / displayMax) * 100, 99.5);
        markerEl.style.left    = pct.toFixed(2) + '%';
        markerEl.style.display = 'block';
        const markerLabel = document.getElementById('bracketVizMarkerLabel');
        if (markerLabel) {
            markerLabel.textContent = 'KES ' + taxable.toLocaleString('en-KE', { maximumFractionDigits: 0 });
        }
    } else if (markerEl) {
        markerEl.style.display = 'none';
    }

    // populate the summary badges inside the visualizer card
    const vizEffective = document.getElementById('vizEffectiveRate');
    const vizMarginal  = document.getElementById('vizMarginalRate');
    const vizTaxable   = document.getElementById('vizTaxableIncome');
    if (vizEffective) vizEffective.textContent = formatPercent(result.effectiveRate);
    if (vizMarginal)  vizMarginal.textContent  = formatPercent(result.marginalRate);
    if (vizTaxable)   vizTaxable.textContent   = formatKES(taxable);

    // show the content, hide the empty placeholder
    const emptyEl   = document.getElementById('bracketVizEmpty');
    const contentEl = document.getElementById('bracketVizContent');
    if (emptyEl)   emptyEl.style.display   = 'none';
    if (contentEl) contentEl.style.display = 'block';
}

// ---- zero out charts when input is cleared ----
function resetCharts() {
    const empty = { labels: [], datasets: [{ data: [] }] };
    if (donutChart) { donutChart.data = empty; donutChart.update(); }
    if (barChart)   { barChart.data   = empty; barChart.update(); }

    const container = document.getElementById('bracketVizContainer');
    if (container) container.innerHTML = '';
    const markerEl = document.getElementById('bracketVizMarker');
    if (markerEl) markerEl.style.display = 'none';

    // restore the empty placeholder
    const emptyEl   = document.getElementById('bracketVizEmpty');
    const contentEl = document.getElementById('bracketVizContent');
    if (emptyEl)   emptyEl.style.display   = '';
    if (contentEl) contentEl.style.display = 'none';
}

// ---- read a CSS variable colour from the root ----
// fallback to hex literals if getComputedStyle isn't available
function getComputedColor(varName) {
    try {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    } catch (e) {
        const fallbacks = {
            '--color-net':  '#22C55E',
            '--color-paye': '#F97316',
            '--color-shif': '#3B82F6',
            '--color-nssf': '#F59E0B',
            '--color-levy': '#8B5CF6',
        };
        return fallbacks[varName] || '#999';
    }
}
