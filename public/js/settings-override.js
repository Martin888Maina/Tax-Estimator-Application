// settings-override.js — populates the settings panel and wires up user edits
// any change here mutates activeRates and fires a recalc via the callback

// called from ui-helpers.js once the DOM is ready
function initSettingsPanel(onChangeCallback) {

    const panel       = document.getElementById('settingsPanel');
    const toggleBtn   = document.getElementById('settingsPanelToggle');
    const body        = document.getElementById('settingsPanelBody');
    const resetAllBtn = document.getElementById('resetAllBtn');

    if (!panel || !toggleBtn || !body) return;

    // ---- populate all fields from the current active rates ----
    populateFields();

    // ---- accordion toggle ----
    toggleBtn.addEventListener('click', function () {
        const isOpen = !body.hidden;
        body.hidden  = isOpen;
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        toggleBtn.classList.toggle('settings-panel__toggle--open', !isOpen);
    });

    // ---- reset all ----
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', function () {
            resetActiveRates();
            populateFields();
            onChangeCallback();
        });
    }

    // ---- per-field reset buttons ----
    body.addEventListener('click', function (e) {
        const btn = e.target.closest('.settings-field__reset');
        if (!btn) return;
        const targetId = btn.getAttribute('data-reset');
        resetField(targetId);
        onChangeCallback();
    });

    // ---- listen for edits on any settings input ----
    body.addEventListener('input', function (e) {
        const input = e.target.closest('.settings-field__input');
        if (input) {
            applyFieldChange(input);
            onChangeCallback();
        }

        // bracket inputs are identified by data-bracket-index and data-bracket-prop
        const bracketInput = e.target.closest('.bracket-settings-input');
        if (bracketInput) {
            applyBracketChange(bracketInput);
            onChangeCallback();
        }
    });
}

// ---- populate all settings fields from activeRates ----
function populateFields() {
    const rates = getActiveRates();
    const orig  = TAX_CONSTANTS;

    // personal relief
    setFieldValue('sfPersonalRelief', rates.personalRelief);
    setDefault('sfPersonalReliefDefault', orig.personalRelief);

    // SHIF
    setFieldValue('sfShifRate', +(rates.shif.rate * 100).toFixed(4));
    setDefault('sfShifRateDefault', +(orig.shif.rate * 100).toFixed(4) + '%');
    setFieldValue('sfShifMin',  rates.shif.minimum);
    setDefault('sfShifMinDefault', 'KES ' + orig.shif.minimum);

    // NSSF
    setFieldValue('sfNssfRate',    +(rates.nssf.rate * 100).toFixed(4));
    setDefault('sfNssfRateDefault', +(orig.nssf.rate * 100).toFixed(4) + '%');
    setFieldValue('sfNssfTierOne', rates.nssf.tierOneCap);
    setDefault('sfNssfTierOneDefault', 'KES ' + orig.nssf.tierOneCap.toLocaleString());
    setFieldValue('sfNssfTierTwo', rates.nssf.tierTwoCap);
    setDefault('sfNssfTierTwoDefault', 'KES ' + orig.nssf.tierTwoCap.toLocaleString());

    // Housing Levy
    setFieldValue('sfLevyRate', +(rates.housingLevy.rate * 100).toFixed(4));
    setDefault('sfLevyRateDefault', +(orig.housingLevy.rate * 100).toFixed(4) + '%');

    // bracket rows
    buildBracketRows(rates.payeBrackets, orig.payeBrackets);
}

// ---- build the editable bracket rows ----
function buildBracketRows(brackets, origBrackets) {
    const container = document.getElementById('bracketSettingsRows');
    if (!container) return;

    container.innerHTML = brackets.map((b, i) => {
        const isLast    = i === brackets.length - 1;
        const maxVal    = isLast ? '' : b.max;
        const origMax   = isLast ? '—' : origBrackets[i].max.toLocaleString();
        const origRate  = (origBrackets[i].rate * 100).toFixed(1) + '%';

        return `
            <div class="bracket-settings-row" data-bracket-index="${i}">
                <span class="bracket-settings-row__label">
                    Bracket ${i + 1}
                    <span class="bracket-settings-row__range">
                        ${i === 0 ? '0' : brackets[i - 1].max.toLocaleString()} –
                        ${isLast ? 'above' : b.max.toLocaleString()}
                    </span>
                </span>
                <div class="settings-field__input-wrap">
                    ${isLast
                        ? '<span class="bracket-settings-row__infinity">No upper limit</span>'
                        : `<input type="number"
                                  class="settings-field__input bracket-settings-input"
                                  value="${maxVal}"
                                  min="0"
                                  step="1"
                                  data-bracket-index="${i}"
                                  data-bracket-prop="max"
                                  title="Default: KES ${origMax}">`
                    }
                </div>
                <div class="settings-field__input-wrap">
                    <input type="number"
                           class="settings-field__input bracket-settings-input"
                           value="${+(b.rate * 100).toFixed(4)}"
                           min="0"
                           max="100"
                           step="0.01"
                           data-bracket-index="${i}"
                           data-bracket-prop="rate"
                           title="Default: ${origRate}">
                </div>
                <button class="settings-field__reset bracket-reset-btn"
                        data-bracket-index="${i}"
                        title="Reset bracket ${i + 1} to default">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>
            </div>
        `;
    }).join('');

    // wire per-bracket reset buttons
    container.addEventListener('click', function (e) {
        const btn = e.target.closest('.bracket-reset-btn');
        if (!btn) return;
        const idx = parseInt(btn.getAttribute('data-bracket-index'), 10);
        resetBracket(idx);
    });
}

// ---- apply a change from a named settings field ----
function applyFieldChange(input) {
    const key = input.getAttribute('data-key');
    const raw = parseFloat(input.value);

    if (isNaN(raw) || raw < 0) return; // don't apply invalid values

    const rates = getActiveRates();

    switch (key) {
        case 'personalRelief':
            rates.personalRelief = raw;
            break;
        case 'shif.rate':
            // user enters percentage, we store decimal
            if (raw > 100) return;
            rates.shif.rate = raw / 100;
            break;
        case 'shif.minimum':
            rates.shif.minimum = raw;
            break;
        case 'nssf.rate':
            if (raw > 100) return;
            rates.nssf.rate = raw / 100;
            break;
        case 'nssf.tierOneCap':
            rates.nssf.tierOneCap = raw;
            break;
        case 'nssf.tierTwoCap':
            rates.nssf.tierTwoCap = raw;
            break;
        case 'housingLevy.rate':
            if (raw > 100) return;
            rates.housingLevy.rate = raw / 100;
            break;
    }

    markFieldModified(input);
}

// ---- apply a change to a bracket field ----
function applyBracketChange(input) {
    const idx  = parseInt(input.getAttribute('data-bracket-index'), 10);
    const prop = input.getAttribute('data-bracket-prop');
    const raw  = parseFloat(input.value);

    if (isNaN(raw) || raw < 0) return;

    const rates = getActiveRates();

    if (prop === 'max') {
        rates.payeBrackets[idx].max = raw;
        // keep the next bracket's min in sync
        if (rates.payeBrackets[idx + 1]) {
            rates.payeBrackets[idx + 1].min = raw;
        }
    } else if (prop === 'rate') {
        if (raw > 100) return;
        rates.payeBrackets[idx].rate = raw / 100;
    }

    markFieldModified(input);
}

// ---- reset a single named field to its original value ----
function resetField(fieldId) {
    const orig  = TAX_CONSTANTS;
    const input = document.getElementById(fieldId);
    if (!input) return;

    const key = input.getAttribute('data-key');
    const rates = getActiveRates();

    switch (key) {
        case 'personalRelief':
            rates.personalRelief = orig.personalRelief;
            setFieldValue(fieldId, orig.personalRelief);
            break;
        case 'shif.rate':
            rates.shif.rate = orig.shif.rate;
            setFieldValue(fieldId, +(orig.shif.rate * 100).toFixed(4));
            break;
        case 'shif.minimum':
            rates.shif.minimum = orig.shif.minimum;
            setFieldValue(fieldId, orig.shif.minimum);
            break;
        case 'nssf.rate':
            rates.nssf.rate = orig.nssf.rate;
            setFieldValue(fieldId, +(orig.nssf.rate * 100).toFixed(4));
            break;
        case 'nssf.tierOneCap':
            rates.nssf.tierOneCap = orig.nssf.tierOneCap;
            setFieldValue(fieldId, orig.nssf.tierOneCap);
            break;
        case 'nssf.tierTwoCap':
            rates.nssf.tierTwoCap = orig.nssf.tierTwoCap;
            setFieldValue(fieldId, orig.nssf.tierTwoCap);
            break;
        case 'housingLevy.rate':
            rates.housingLevy.rate = orig.housingLevy.rate;
            setFieldValue(fieldId, +(orig.housingLevy.rate * 100).toFixed(4));
            break;
    }

    input.classList.remove('settings-field__input--modified');
}

// ---- reset a single bracket to its original values ----
function resetBracket(idx) {
    const orig  = TAX_CONSTANTS.payeBrackets[idx];
    const rates = getActiveRates();

    rates.payeBrackets[idx].max  = orig.max;
    rates.payeBrackets[idx].rate = orig.rate;

    // keep next bracket's min in sync
    if (rates.payeBrackets[idx + 1]) {
        rates.payeBrackets[idx + 1].min = orig.max;
    }

    // rebuild the rows to reflect the reset
    buildBracketRows(rates.payeBrackets, TAX_CONSTANTS.payeBrackets);
}

// ---- helpers ----
function setFieldValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function setDefault(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = 'Default: ' + val;
}

function markFieldModified(input) {
    input.classList.add('settings-field__input--modified');
}
