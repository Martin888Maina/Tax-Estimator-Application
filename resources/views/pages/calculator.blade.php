@extends('layouts.app')

@section('title', 'Tax Calculator — Kenya Tax Estimator')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/calculator.css') }}">
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
                        <span class="results-card__sub">2.75% of gross</span>
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
                        <tbody id="breakdownBody">
                            {{-- rows injected by JS --}}
                        </tbody>
                        <tfoot id="breakdownFoot">
                            {{-- totals injected by JS --}}
                        </tfoot>
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
                        <tbody id="bracketTableBody">
                            {{-- injected by JS --}}
                        </tbody>
                    </table>
                </div>
                <div class="bracket-detail__summary" id="bracketSummary">
                    {{-- injected by JS --}}
                </div>
            </div>

        </div>
        {{-- end #resultsArea --}}

    </div>
</div>

@endsection

@section('scripts')
    <script src="{{ asset('js/tax-constants.js') }}"></script>
    <script src="{{ asset('js/currency-formatter.js') }}"></script>
    <script src="{{ asset('js/tax-calculator.js') }}"></script>
    <script src="{{ asset('js/ui-helpers.js') }}"></script>
@endsection
