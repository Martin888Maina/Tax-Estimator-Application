@extends('layouts.app')

@section('title', 'Kenya Tax Estimator — Know Where Every Shilling Goes')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/landing.css') }}">
@endsection

@section('content')

{{-- ===== HERO ===== --}}
<section class="hero">
    <div class="container">
        <div class="hero__content">
            <span class="hero__badge">
                <i class="fa-solid fa-shield-halved"></i>
                KRA 2023 / 2024 Rates — Always Up to Date
            </span>

            <h1 class="hero__title">
                Know exactly where every shilling
                <span class="hero__title--accent">of your salary goes.</span>
            </h1>

            <p class="hero__subtitle">
                Enter your gross salary and instantly see your PAYE tax, SHIF contribution,
                NSSF deductions, Housing Levy, and exact take-home pay — broken down to the last cent.
            </p>

            <div class="hero__actions">
                <a href="{{ url('/calculator') }}" class="btn btn--primary btn--lg">
                    <i class="fa-solid fa-calculator"></i>
                    Calculate My Tax
                </a>
                <a href="{{ url('/about') }}" class="btn btn--outline btn--lg">
                    How It Works
                </a>
            </div>

            <div class="hero__trust">
                <span><i class="fa-solid fa-check-circle"></i> No sign-up required</span>
                <span><i class="fa-solid fa-check-circle"></i> Works entirely offline</span>
                <span><i class="fa-solid fa-check-circle"></i> All calculations in your browser</span>
            </div>
        </div>

        {{-- quick preview card --}}
        <div class="hero__preview">
            <div class="preview-card">
                <div class="preview-card__header">
                    <span class="preview-card__label">Sample Breakdown</span>
                    <span class="preview-card__salary">KES 100,000 / month</span>
                </div>
                <div class="preview-card__rows">
                    <div class="preview-row">
                        <span class="preview-row__label">Gross Salary</span>
                        <span class="preview-row__amount">KES 100,000.00</span>
                    </div>
                    <div class="preview-row preview-row--deduction">
                        <span class="preview-row__label"><span class="preview-dot preview-dot--paye"></span>PAYE Tax</span>
                        <span class="preview-row__amount">− KES 22,354.23</span>
                    </div>
                    <div class="preview-row preview-row--deduction">
                        <span class="preview-row__label"><span class="preview-dot preview-dot--shif"></span>SHIF</span>
                        <span class="preview-row__amount">− KES 2,750.00</span>
                    </div>
                    <div class="preview-row preview-row--deduction">
                        <span class="preview-row__label"><span class="preview-dot preview-dot--nssf"></span>NSSF</span>
                        <span class="preview-row__amount">− KES 5,460.00</span>
                    </div>
                    <div class="preview-row preview-row--deduction">
                        <span class="preview-row__label"><span class="preview-dot preview-dot--levy"></span>Housing Levy</span>
                        <span class="preview-row__amount">− KES 1,500.00</span>
                    </div>
                    <div class="preview-row preview-row--net">
                        <span class="preview-row__label">Net Take-Home</span>
                        <span class="preview-row__amount preview-row__amount--net">KES 67,935.77</span>
                    </div>
                </div>
                <p class="preview-card__note">* Sample figures — enter your salary to get your exact breakdown</p>
            </div>
        </div>
    </div>
</section>

{{-- ===== FEATURES ===== --}}
<section class="features section">
    <div class="container">
        <div class="features__header">
            <h2 class="features__title">Everything you need to understand your payslip</h2>
            <p class="features__subtitle">
                Built specifically for Kenyan employees — covering every statutory deduction in full detail.
            </p>
        </div>

        <div class="features__grid">
            <div class="feature-card">
                <div class="feature-card__icon feature-card__icon--green">
                    <i class="fa-solid fa-chart-pie"></i>
                </div>
                <h3 class="feature-card__title">Visual Income Breakdown</h3>
                <p class="feature-card__desc">
                    See exactly how your gross salary is split across taxes, statutory contributions,
                    and take-home pay through interactive charts.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon feature-card__icon--blue">
                    <i class="fa-solid fa-sliders"></i>
                </div>
                <h3 class="feature-card__title">Editable Tax Rates</h3>
                <p class="feature-card__desc">
                    All tax rates and thresholds are editable. When KRA publishes new rates,
                    update them yourself without waiting for an app update.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon feature-card__icon--amber">
                    <i class="fa-solid fa-toggle-on"></i>
                </div>
                <h3 class="feature-card__title">Monthly / Annual Toggle</h3>
                <p class="feature-card__desc">
                    Switch between monthly and annual salary view in one click.
                    All figures recalculate instantly.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon feature-card__icon--purple">
                    <i class="fa-solid fa-file-pdf"></i>
                </div>
                <h3 class="feature-card__title">PDF Export</h3>
                <p class="feature-card__desc">
                    Download a clean, printable PDF of your full tax breakdown
                    for your records or to share with HR.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon feature-card__icon--teal">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
                <h3 class="feature-card__title">Tax Bracket Visualizer</h3>
                <p class="feature-card__desc">
                    Understand Kenya's graduated PAYE system visually.
                    See which bracket your income falls into and your effective vs. marginal rate.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon feature-card__icon--coral">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <h3 class="feature-card__title">Real-Time Calculation</h3>
                <p class="feature-card__desc">
                    No submit button needed. Results update as you type — see your
                    full breakdown change live as you adjust your salary.
                </p>
            </div>
        </div>
    </div>
</section>

{{-- ===== DEDUCTIONS INFO STRIP ===== --}}
<section class="deductions-strip section--sm">
    <div class="container">
        <h2 class="deductions-strip__title">What gets deducted from your Kenyan salary?</h2>
        <div class="deductions-strip__grid">
            <div class="deduction-item">
                <div class="deduction-item__dot deduction-item__dot--paye"></div>
                <div>
                    <strong>PAYE</strong>
                    <p>Pay As You Earn — graduated income tax on 5 brackets from 10% to 35%</p>
                </div>
            </div>
            <div class="deduction-item">
                <div class="deduction-item__dot deduction-item__dot--shif"></div>
                <div>
                    <strong>SHIF</strong>
                    <p>Social Health Insurance Fund — 2.75% of gross salary (replaced NHIF, Oct 2024)</p>
                </div>
            </div>
            <div class="deduction-item">
                <div class="deduction-item__dot deduction-item__dot--nssf"></div>
                <div>
                    <strong>NSSF</strong>
                    <p>National Social Security Fund — 6% of pensionable pay, Tier I + Tier II</p>
                </div>
            </div>
            <div class="deduction-item">
                <div class="deduction-item__dot deduction-item__dot--levy"></div>
                <div>
                    <strong>Housing Levy</strong>
                    <p>Affordable Housing Levy — 1.5% of gross salary (Affordable Housing Act 2024)</p>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- ===== CTA BANNER ===== --}}
<section class="cta-banner section">
    <div class="container">
        <div class="cta-banner__inner">
            <div class="cta-banner__text">
                <h2 class="cta-banner__title">Ready to see your real take-home pay?</h2>
                <p class="cta-banner__subtitle">
                    Takes less than 10 seconds. No account needed. No data stored.
                </p>
            </div>
            <a href="{{ url('/calculator') }}" class="btn btn--primary btn--lg">
                <i class="fa-solid fa-calculator"></i>
                Start Calculating
            </a>
        </div>
    </div>
</section>

@endsection
