@extends('layouts.app')

@section('title', 'About — Kenya Tax Estimator')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/about.css') }}">
@endsection

@section('content')

<div class="about-page">
    <div class="container">

        {{-- ===== HERO ===== --}}
        <div class="about-hero">
            <div class="about-hero__icon">
                <i class="fa-solid fa-calculator"></i>
            </div>
            <h1 class="about-hero__title">About Kenya Tax Estimator</h1>
            <p class="about-hero__subtitle">
                A free, open-source tax calculator built specifically for Kenyan employees —
                no sign-up, no data stored, everything runs in your browser.
            </p>
        </div>

        {{-- ===== WHAT IT DOES ===== --}}
        <section class="about-section card">
            <h2 class="about-section__title">
                <i class="fa-solid fa-circle-info"></i>
                What This Application Does
            </h2>
            <p class="about-section__body">
                Kenya Tax Estimator helps Kenyan employees understand their full payslip deduction
                picture. Enter your gross monthly or annual salary and the calculator instantly
                computes every statutory deduction — PAYE tax across all five KRA graduated brackets,
                SHIF contribution, NSSF Tier I and Tier II contributions, and the Affordable Housing
                Levy — then shows you your exact net take-home pay.
            </p>
            <p class="about-section__body">
                What makes this tool different from a simple salary calculator is the depth of the
                breakdown. You see exactly how much tax you owe at each PAYE bracket, which portions
                of your income are tax-deductible, and how your effective tax rate compares to your
                marginal rate. Visual charts make the proportions immediately obvious.
            </p>
            <p class="about-section__body">
                All tax rates and thresholds are editable through the Settings Override panel.
                When the Kenya Revenue Authority publishes amended rates after a Finance Act update,
                you can enter the new figures immediately without waiting for an app update.
            </p>
        </section>

        {{-- ===== CALCULATION METHODOLOGY ===== --}}
        <section class="about-section card">
            <h2 class="about-section__title">
                <i class="fa-solid fa-function"></i>
                Calculation Methodology
            </h2>
            <p class="about-section__body">
                All calculations follow the official KRA order of operations. The steps below apply
                to monthly figures; when annual mode is selected, the monthly result is multiplied
                by twelve.
            </p>

            <div class="method-steps">
                <div class="method-step">
                    <div class="method-step__num">1</div>
                    <div class="method-step__content">
                        <h3>Compute statutory deductible items</h3>
                        <p>
                            SHIF is calculated at 2.75% of gross salary with a minimum of KES 300/month.
                            NSSF is calculated at 6% of pensionable pay split across Tier I (first KES 9,000)
                            and Tier II (KES 9,001 to KES 108,000), capping employee contribution at KES 6,480/month.
                            The Affordable Housing Levy is 1.5% of gross salary. All three are fully tax-deductible.
                        </p>
                    </div>
                </div>
                <div class="method-step">
                    <div class="method-step__num">2</div>
                    <div class="method-step__content">
                        <h3>Determine taxable income</h3>
                        <p>
                            Taxable Income = Gross Salary − SHIF − NSSF (employee) − Housing Levy.
                            These three deductions reduce the income on which PAYE is computed.
                        </p>
                    </div>
                </div>
                <div class="method-step">
                    <div class="method-step__num">3</div>
                    <div class="method-step__content">
                        <h3>Apply the five PAYE brackets</h3>
                        <p>
                            Kenya uses a graduated tax system. Each bracket applies only to the income
                            within that band — not to the total salary. The first KES 24,000 is taxed at 10%,
                            the next KES 8,333 at 25%, the next KES 467,667 at 30%, the next KES 300,000 at
                            32.5%, and anything above KES 800,000 at 35%.
                        </p>
                    </div>
                </div>
                <div class="method-step">
                    <div class="method-step__num">4</div>
                    <div class="method-step__content">
                        <h3>Subtract personal relief</h3>
                        <p>
                            Every Kenyan employee is entitled to a personal relief of KES 2,400/month
                            (KES 28,800/year). This is deducted directly from the gross PAYE computed
                            in step 3. If the result is negative, PAYE payable is set to zero — low
                            earners pay no income tax.
                        </p>
                    </div>
                </div>
                <div class="method-step">
                    <div class="method-step__num">5</div>
                    <div class="method-step__content">
                        <h3>Calculate net take-home pay</h3>
                        <p>
                            Net Pay = Gross Salary − PAYE Payable − SHIF − NSSF (employee) − Housing Levy.
                            This is the amount the employee actually receives.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {{-- ===== PAYE BRACKETS TABLE ===== --}}
        <section class="about-section card">
            <h2 class="about-section__title">
                <i class="fa-solid fa-table"></i>
                PAYE Tax Brackets (Effective 1 July 2023)
            </h2>
            <div class="about-table-wrap">
                <table class="about-table">
                    <thead>
                        <tr>
                            <th>Monthly Taxable Income (KES)</th>
                            <th>Annual Taxable Income (KES)</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Up to 24,000</td>
                            <td>Up to 288,000</td>
                            <td class="about-table__rate">10%</td>
                        </tr>
                        <tr>
                            <td>24,001 – 32,333</td>
                            <td>288,001 – 388,000</td>
                            <td class="about-table__rate">25%</td>
                        </tr>
                        <tr>
                            <td>32,334 – 500,000</td>
                            <td>388,001 – 6,000,000</td>
                            <td class="about-table__rate">30%</td>
                        </tr>
                        <tr>
                            <td>500,001 – 800,000</td>
                            <td>6,000,001 – 9,600,000</td>
                            <td class="about-table__rate">32.5%</td>
                        </tr>
                        <tr>
                            <td>Above 800,000</td>
                            <td>Above 9,600,000</td>
                            <td class="about-table__rate">35%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="about-section__note">
                Source: Kenya Revenue Authority / Finance Act 2023
            </p>
        </section>

        {{-- ===== DATA SOURCES ===== --}}
        <section class="about-section card">
            <h2 class="about-section__title">
                <i class="fa-solid fa-book"></i>
                Data Sources and Legal References
            </h2>
            <div class="sources-grid">
                <div class="source-item">
                    <div class="source-item__icon"><i class="fa-solid fa-gavel"></i></div>
                    <div>
                        <strong>Finance Act 2023</strong>
                        <p>Established the current five-tier PAYE bracket structure and rates effective 1 July 2023.</p>
                    </div>
                </div>
                <div class="source-item">
                    <div class="source-item__icon"><i class="fa-solid fa-gavel"></i></div>
                    <div>
                        <strong>Tax Laws (Amendment) Act 2024</strong>
                        <p>Confirmed SHIF and Housing Levy as fully tax-deductible items effective 27 December 2024.</p>
                    </div>
                </div>
                <div class="source-item">
                    <div class="source-item__icon"><i class="fa-solid fa-heart-pulse"></i></div>
                    <div>
                        <strong>Social Health Insurance Act 2023</strong>
                        <p>Established SHIF at 2.75% of gross salary (minimum KES 300), replacing NHIF from 1 October 2024.</p>
                    </div>
                </div>
                <div class="source-item">
                    <div class="source-item__icon"><i class="fa-solid fa-umbrella"></i></div>
                    <div>
                        <strong>NSSF Act 2013 (enforced February 2026)</strong>
                        <p>Mandates 6% of pensionable pay across Tier I (≤KES 9,000) and Tier II (≤KES 108,000).</p>
                    </div>
                </div>
                <div class="source-item">
                    <div class="source-item__icon"><i class="fa-solid fa-house"></i></div>
                    <div>
                        <strong>Affordable Housing Act 2024</strong>
                        <p>Reintroduced the Housing Levy at 1.5% of gross salary from 19 March 2024.</p>
                    </div>
                </div>
                <div class="source-item">
                    <div class="source-item__icon"><i class="fa-solid fa-landmark"></i></div>
                    <div>
                        <strong>Kenya Revenue Authority (KRA)</strong>
                        <p>Official rates, forms, and PAYE guidance available at kra.go.ke.</p>
                    </div>
                </div>
            </div>
        </section>

        {{-- ===== TECH STACK ===== --}}
        <section class="about-section card">
            <h2 class="about-section__title">
                <i class="fa-solid fa-code"></i>
                Technology Stack
            </h2>
            <p class="about-section__body">
                This application is intentionally simple — no build pipeline, no JavaScript framework,
                no database. Laravel is used purely as a templating engine for clean Blade views and
                route-to-view mapping. All tax logic runs in vanilla JavaScript in the browser.
            </p>
            <div class="tech-grid">
                <div class="tech-item">
                    <strong>Laravel Blade</strong>
                    <span>HTML templating, layout inheritance, component reuse</span>
                </div>
                <div class="tech-item">
                    <strong>Pure CSS</strong>
                    <span>External stylesheets with CSS custom properties — no Tailwind, no Bootstrap</span>
                </div>
                <div class="tech-item">
                    <strong>Vanilla JavaScript</strong>
                    <span>All tax calculations and DOM updates — no framework dependency</span>
                </div>
                <div class="tech-item">
                    <strong>Chart.js</strong>
                    <span>Donut and stacked bar charts for income breakdown visualisation</span>
                </div>
                <div class="tech-item">
                    <strong>html2canvas + jsPDF</strong>
                    <span>Client-side PDF generation — no server processing required</span>
                </div>
                <div class="tech-item">
                    <strong>Font Awesome</strong>
                    <span>Icon set used throughout the interface</span>
                </div>
            </div>
            <p class="about-section__body" style="margin-top: var(--space-lg);">
                Source code:
                <a href="https://github.com/Martin888Maina/Tax-Estimator-Application"
                   target="_blank" rel="noopener noreferrer" class="about-link">
                    github.com/Martin888Maina/Tax-Estimator-Application
                    <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75em;"></i>
                </a>
            </p>
        </section>

        {{-- ===== DISCLAIMER ===== --}}
        @include('partials.tax-disclaimer')

        {{-- ===== CTA ===== --}}
        <div class="about-cta">
            <a href="{{ url('/calculator') }}" class="btn btn--primary btn--lg">
                <i class="fa-solid fa-calculator"></i>
                Go to the Calculator
            </a>
        </div>

    </div>
</div>

@endsection
