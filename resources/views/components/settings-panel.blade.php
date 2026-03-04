{{--
    settings-panel.blade.php
    collapsible accordion — all tax constants are editable here
    JS in settings-override.js reads and writes these fields
--}}
<div class="settings-panel" id="settingsPanel">

    <button class="settings-panel__toggle" id="settingsPanelToggle" aria-expanded="false" aria-controls="settingsPanelBody">
        <span class="settings-panel__toggle-left">
            <i class="fa-solid fa-sliders"></i>
            <span>Tax Rate Settings</span>
            <span class="settings-panel__badge">Based on Finance Act 2023 / Tax Laws Amendment Act 2024</span>
        </span>
        <span class="settings-panel__toggle-right">
            <span class="settings-panel__toggle-hint">Click to customise rates</span>
            <i class="fa-solid fa-chevron-down settings-panel__chevron"></i>
        </span>
    </button>

    <div class="settings-panel__body" id="settingsPanelBody" hidden>

        <div class="settings-panel__intro">
            <i class="fa-solid fa-circle-info"></i>
            All values below match the current gazetted KRA rates. Edit any field to override
            for a custom scenario. Changes apply immediately to the calculation.
            <button class="btn btn--outline btn--sm settings-panel__reset-all" id="resetAllBtn">
                <i class="fa-solid fa-rotate-left"></i>
                Reset All to Defaults
            </button>
        </div>

        {{-- ===== PAYE BRACKETS ===== --}}
        <div class="settings-group">
            <h3 class="settings-group__title">
                <i class="fa-solid fa-stairs"></i>
                PAYE Tax Brackets
            </h3>
            <p class="settings-group__desc">Monthly taxable income thresholds and rates (Finance Act 2023)</p>

            <div class="settings-brackets">
                {{-- bracket rows built by JS from tax-constants.js --}}
                <div class="settings-brackets__header">
                    <span>Bracket</span>
                    <span>Upper Threshold (KES)</span>
                    <span>Rate (%)</span>
                    <span></span>
                </div>
                <div id="bracketSettingsRows">
                    {{-- injected by settings-override.js --}}
                </div>
            </div>
        </div>

        {{-- ===== PERSONAL RELIEF ===== --}}
        <div class="settings-group">
            <h3 class="settings-group__title">
                <i class="fa-solid fa-hand-holding-heart"></i>
                Personal Relief
            </h3>
            <div class="settings-fields">
                <div class="settings-field">
                    <label class="settings-field__label" for="sfPersonalRelief">
                        Monthly Personal Relief (KES)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfPersonalRelief" class="settings-field__input"
                               min="0" step="1" data-key="personalRelief">
                        <button class="settings-field__reset" data-reset="sfPersonalRelief" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfPersonalReliefDefault"></span>
                </div>
            </div>
        </div>

        {{-- ===== SHIF ===== --}}
        <div class="settings-group">
            <h3 class="settings-group__title">
                <i class="fa-solid fa-heart-pulse"></i>
                SHIF (Social Health Insurance Fund)
            </h3>
            <p class="settings-group__desc">Replaced NHIF effective 1 October 2024</p>
            <div class="settings-fields">
                <div class="settings-field">
                    <label class="settings-field__label" for="sfShifRate">
                        Contribution Rate (%)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfShifRate" class="settings-field__input"
                               min="0" max="100" step="0.01" data-key="shif.rate">
                        <button class="settings-field__reset" data-reset="sfShifRate" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfShifRateDefault"></span>
                </div>
                <div class="settings-field">
                    <label class="settings-field__label" for="sfShifMin">
                        Minimum Contribution (KES)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfShifMin" class="settings-field__input"
                               min="0" step="1" data-key="shif.minimum">
                        <button class="settings-field__reset" data-reset="sfShifMin" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfShifMinDefault"></span>
                </div>
            </div>
        </div>

        {{-- ===== NSSF ===== --}}
        <div class="settings-group">
            <h3 class="settings-group__title">
                <i class="fa-solid fa-umbrella"></i>
                NSSF (National Social Security Fund)
            </h3>
            <p class="settings-group__desc">New Act rates effective February 2026</p>
            <div class="settings-fields">
                <div class="settings-field">
                    <label class="settings-field__label" for="sfNssfRate">
                        Contribution Rate (%)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfNssfRate" class="settings-field__input"
                               min="0" max="100" step="0.01" data-key="nssf.rate">
                        <button class="settings-field__reset" data-reset="sfNssfRate" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfNssfRateDefault"></span>
                </div>
                <div class="settings-field">
                    <label class="settings-field__label" for="sfNssfTierOne">
                        Tier I Cap (KES)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfNssfTierOne" class="settings-field__input"
                               min="0" step="1" data-key="nssf.tierOneCap">
                        <button class="settings-field__reset" data-reset="sfNssfTierOne" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfNssfTierOneDefault"></span>
                </div>
                <div class="settings-field">
                    <label class="settings-field__label" for="sfNssfTierTwo">
                        Tier II Cap (KES)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfNssfTierTwo" class="settings-field__input"
                               min="0" step="1" data-key="nssf.tierTwoCap">
                        <button class="settings-field__reset" data-reset="sfNssfTierTwo" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfNssfTierTwoDefault"></span>
                </div>
            </div>
        </div>

        {{-- ===== HOUSING LEVY ===== --}}
        <div class="settings-group">
            <h3 class="settings-group__title">
                <i class="fa-solid fa-house"></i>
                Affordable Housing Levy
            </h3>
            <p class="settings-group__desc">Reintroduced 19 March 2024 under the Affordable Housing Act 2024</p>
            <div class="settings-fields">
                <div class="settings-field">
                    <label class="settings-field__label" for="sfLevyRate">
                        Levy Rate (%)
                    </label>
                    <div class="settings-field__input-wrap">
                        <input type="number" id="sfLevyRate" class="settings-field__input"
                               min="0" max="100" step="0.01" data-key="housingLevy.rate">
                        <button class="settings-field__reset" data-reset="sfLevyRate" title="Reset to default">
                            <i class="fa-solid fa-rotate-left"></i>
                        </button>
                    </div>
                    <span class="settings-field__default" id="sfLevyRateDefault"></span>
                </div>
            </div>
        </div>

    </div>
    {{-- end settings-panel__body --}}

</div>
