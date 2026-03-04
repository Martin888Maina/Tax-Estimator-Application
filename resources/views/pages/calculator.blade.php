@extends('layouts.app')

@section('title', 'Tax Calculator — Kenya Tax Estimator')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/calculator.css') }}">
    <link rel="stylesheet" href="{{ asset('css/settings.css') }}">
@endsection

@section('content')

<div class="calc-page">
    <div class="container">

        {{-- ===== PAGE HEADER ===== --}}
        <div class="calc-page__header">
            <h1 class="calc-page__title">Kenya Tax Calculator</h1>
            <p class="calc-page__subtitle">
                Enter your gross salary to see your full PAYE breakdown — updated in real time.
            </p>
        </div>

        {{-- ===== SALARY INPUT SECTION ===== --}}
        <section class="salary-section card" id="salarySection">
            <div class="salary-section__inner">

                <div class="salary-input-group">
                    <label class="salary-input-group__label" for="salaryInput">
                        Gross Salary
                    </label>
                    <div class="salary-input-group__field">
                        <span class="salary-input-group__prefix">KES</span>
                        <input
                            type="number"
                            id="salaryInput"
                            class="salary-input-group__input"
                            placeholder="e.g. 75000"
                            min="0"
                            max="100000000"
                            step="1"
                            autocomplete="off"
                        >
                    </div>
                    <p class="salary-input-group__error" id="salaryError" aria-live="polite"></p>
                </div>

                {{-- monthly / annual toggle --}}
                <div class="period-toggle">
                    <span class="period-toggle__label period-toggle__label--active" id="toggleLabelMonthly">Monthly</span>
                    <label class="toggle-switch" aria-label="Switch between monthly and annual salary">
                        <input type="checkbox" id="periodToggle">
                        <span class="toggle-switch__slider"></span>
                    </label>
                    <span class="period-toggle__label" id="toggleLabelAnnual">Annual</span>
                </div>

            </div>

            <p class="salary-section__hint" id="salaryHint">
                Enter your gross salary above to see your full tax breakdown.
            </p>
        </section>

        {{-- ===== SETTINGS OVERRIDE PANEL ===== --}}
        @include('components.settings-panel')

        {{-- ===== RESULTS AREA (populated by JS) ===== --}}
        <div class="results-area" id="resultsArea" aria-live="polite">

            {{-- ---- SUMMARY CARDS ---- --}}
            <div class="summary-cards" id="summaryCards">

                <div class="results-card results-card--gross">
                    <div class="results-card__icon"><i class="fa-solid fa-money-bill-wave"></i></div>
                    <div class="results-card__body">
                        <span class="results-card__label">Gross Salary</span>
                        <span class="results-card__amount" id="cardGross">KES 0.00</span>
                        <span class="results-card__sub" id="cardGrossSub">per month</span>
                    </div>
                </div>

                <div class="results-card results-card--paye">
                    <div class="results-card__icon"><i class="fa-solid fa-landmark"></i></div>
                    <div class="results-card__body">
                        <span class="results-card__label">PAYE Tax</span>
                        <span class="results-card__amount" id="cardPAYE">KES 0.00</span>
                        <span class="results-card__sub" id="cardPAYERate">0.0% effective rate</span>
                    </div>
                </div>

                <div class="results-card results-card--shif">
                    <div class="results-card__icon"><i class="fa-solid fa-heart-pulse"></i></div>
                    <div class="results-card__body">
                        <span class="results-card__label">SHIF</span>
                        <span class="results-card__amount" id="cardSHIF">KES 0.00</span>
                        <span class="results-card__sub" id="cardSHIFSub">2.75% of gross</span>
                    </div>
                </div>

                <div class="results-card results-card--nssf">
                    <div class="results-card__icon"><i class="fa-solid fa-umbrella"></i></div>
                    <div class="results-card__body">
                        <span class="results-card__label">NSSF</span>
                        <span class="results-card__amount" id="cardNSSF">KES 0.00</span>
                        <span class="results-card__sub" id="cardNSSFSub">Tier I + Tier II</span>
                    </div>
                </div>

                <div class="results-card results-card--levy">
                    <div class="results-card__icon"><i class="fa-solid fa-house"></i></div>
                    <div class="results-card__body">
                        <span class="results-card__label">Housing Levy</span>
                        <span class="results-card__amount" id="cardLevy">KES 0.00</span>
                        <span class="results-card__sub">1.5% of gross</span>
                    </div>
                </div>

                <div class="results-card results-card--net results-card--highlight">
                    <div class="results-card__icon"><i class="fa-solid fa-wallet"></i></div>
                    <div class="results-card__body">
                        <span class="results-card__label">Net Take-Home Pay</span>
                        <span class="results-card__amount results-card__amount--large" id="cardNet">KES 0.00</span>
                        <span class="results-card__sub" id="cardNetSub">per month</span>
                    </div>
                </div>

            </div>

            {{-- ---- DETAILED BREAKDOWN TABLE ---- --}}
            <div class="breakdown-section card" id="breakdownSection">
                <div class="breakdown-section__header">
                    <h2 class="breakdown-section__title">
                        <i class="fa-solid fa-table-list"></i>
                        Detailed Breakdown
                    </h2>
                    <span class="breakdown-section__period" id="breakdownPeriodLabel">Monthly</span>
                </div>

                <div class="breakdown-table-wrapper">
                    <table class="breakdown-table">
                        <thead>
                            <tr>
                                <th class="breakdown-table__th">Item</th>
                                <th class="breakdown-table__th">Rate / Formula</th>
                                <th class="breakdown-table__th breakdown-table__th--amount">Amount (KES)</th>
                            </tr>
                        </thead>
                        <tbody id="breakdownBody"></tbody>
                        <tfoot id="breakdownFoot"></tfoot>
                    </table>
                </div>
            </div>

            {{-- ---- PAYE BRACKET DETAIL ---- --}}
            <div class="bracket-detail card" id="bracketDetail">
                <div class="bracket-detail__header">
                    <h2 class="bracket-detail__title">
                        <i class="fa-solid fa-stairs"></i>
                        PAYE Bracket Calculation
                    </h2>
                    <div class="bracket-detail__rates">
                        <div class="rate-badge rate-badge--effective">
                            <span class="rate-badge__label">Effective Rate</span>
                            <span class="rate-badge__value" id="effectiveRate">0.0%</span>
                        </div>
                        <div class="rate-badge rate-badge--marginal">
                            <span class="rate-badge__label">Marginal Rate</span>
                            <span class="rate-badge__value" id="marginalRate">0.0%</span>
                        </div>
                    </div>
                </div>
                <p class="bracket-detail__explainer">
                    Kenya uses a graduated PAYE system — you only pay each rate on the income
                    <em>within that bracket</em>, not on your entire salary.
                </p>
                <div class="bracket-table-wrapper">
                    <table class="bracket-table">
                        <thead>
                            <tr>
                                <th>Bracket (KES)</th>
                                <th>Rate</th>
                                <th>Taxable in Bracket</th>
                                <th>Tax in Bracket</th>
                            </tr>
                        </thead>
                        <tbody id="bracketTableBody"></tbody>
                    </table>
                </div>
                <div class="bracket-detail__summary" id="bracketSummary"></div>
            </div>

        </div>
        {{-- end #resultsArea --}}

        {{-- ===== DEDUCTION EXPLANATIONS ACCORDION ===== --}}
        <div class="explanations-panel" id="explanationsPanel">
            <button class="explanations-panel__toggle" id="explanationsToggle"
                    aria-expanded="false" aria-controls="explanationsBody">
                <span class="explanations-panel__toggle-title">
                    <i class="fa-solid fa-circle-question"></i>
                    Understanding Your Deductions
                </span>
                <i class="fa-solid fa-chevron-down explanations-panel__chevron"></i>
            </button>

            <div class="explanations-panel__body" id="explanationsBody" hidden>

                <div class="explanation-item">
                    <div class="explanation-item__header">
                        <span class="explanation-item__dot explanation-item__dot--paye"></span>
                        <span class="explanation-item__name">PAYE — Pay As You Earn</span>
                    </div>
                    <p class="explanation-item__text">
                        PAYE is Kenya's income tax on employment income, administered by KRA.
                        It uses five graduated brackets — you pay a lower rate on the first portion
                        of your income and a higher rate only on the excess above each threshold.
                        Your personal relief of KES 2,400/month is subtracted from the raw tax,
                        meaning low earners often owe zero PAYE.
                    </p>
                    <span class="explanation-item__formula">Gross PAYE − Personal Relief = PAYE Payable</span>
                </div>

                <div class="explanation-item">
                    <div class="explanation-item__header">
                        <span class="explanation-item__dot explanation-item__dot--shif"></span>
                        <span class="explanation-item__name">SHIF — Social Health Insurance Fund</span>
                    </div>
                    <p class="explanation-item__text">
                        SHIF replaced the National Hospital Insurance Fund (NHIF) effective
                        1 October 2024 under the Social Health Insurance Act 2023. The rate is
                        a flat 2.75% of your gross salary with a minimum of KES 300/month.
                        It is fully tax-deductible, reducing your taxable income before PAYE is computed.
                    </p>
                    <span class="explanation-item__formula">max(Gross × 2.75%, KES 300)</span>
                </div>

                <div class="explanation-item">
                    <div class="explanation-item__header">
                        <span class="explanation-item__dot explanation-item__dot--nssf"></span>
                        <span class="explanation-item__name">NSSF — National Social Security Fund</span>
                    </div>
                    <p class="explanation-item__text">
                        Under the NSSF Act 2013 (fully enforced from February 2026), contributions
                        are 6% of pensionable pay split across two tiers. Tier I covers the first
                        KES 9,000 and Tier II covers KES 9,001 to KES 108,000, giving a maximum
                        employee contribution of KES 6,480/month. The employee contribution is
                        fully tax-deductible.
                    </p>
                    <span class="explanation-item__formula">6% × Tier I (≤9K) + 6% × Tier II (9K–108K)</span>
                </div>

                <div class="explanation-item">
                    <div class="explanation-item__header">
                        <span class="explanation-item__dot explanation-item__dot--levy"></span>
                        <span class="explanation-item__name">Affordable Housing Levy</span>
                    </div>
                    <p class="explanation-item__text">
                        Reintroduced on 19 March 2024 under the Affordable Housing Act 2024, this
                        levy funds the government's affordable housing programme. It is charged at
                        1.5% of your gross salary and is fully tax-deductible since 27 December 2024.
                    </p>
                    <span class="explanation-item__formula">Gross × 1.5%</span>
                </div>

                <div class="explanation-item">
                    <div class="explanation-item__header">
                        <span class="explanation-item__dot explanation-item__dot--relief"></span>
                        <span class="explanation-item__name">Personal Relief</span>
                    </div>
                    <p class="explanation-item__text">
                        Personal relief is a fixed monthly credit of KES 2,400 (KES 28,800 annually)
                        that every Kenyan employee is entitled to. It is subtracted directly from
                        your gross PAYE after bracket computation. If your gross PAYE is below
                        KES 2,400, you owe zero PAYE.
                    </p>
                    <span class="explanation-item__formula">Fixed: KES 2,400 / month (since April 2020)</span>
                </div>

            </div>
        </div>

    </div>
</div>

@endsection

@section('scripts')
    <script src="{{ asset('js/tax-constants.js') }}"></script>
    <script src="{{ asset('js/currency-formatter.js') }}"></script>
    <script src="{{ asset('js/tax-calculator.js') }}"></script>
    <script src="{{ asset('js/settings-override.js') }}"></script>
    <script src="{{ asset('js/ui-helpers.js') }}"></script>
@endsection
