<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Kenya Tax Estimator — calculate your PAYE, SHIF, NSSF, Housing Levy, and net take-home pay instantly.">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Martin Maina">
    <meta name="theme-color" content="#16a34a">

    {{-- Open Graph --}}
    <meta property="og:type" content="website">
    <meta property="og:title" content="Kenya Tax Estimator — Know Where Every Shilling Goes">
    <meta property="og:description" content="Calculate your PAYE, SHIF, NSSF, Housing Levy, and net take-home pay instantly. Built for Kenyan employees using 2023/2024 KRA rates.">
    <meta property="og:url" content="https://tax-estimator.martinmaina.dev">
    <meta property="og:site_name" content="Kenya Tax Estimator">

    {{-- Twitter/X Card --}}
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Kenya Tax Estimator">
    <meta name="twitter:description" content="Calculate PAYE, SHIF, NSSF, Housing Levy instantly. No sign-up. All in your browser.">

    <link rel="canonical" href="https://tax-estimator.martinmaina.dev{{ request()->getPathInfo() }}">

    <title>@yield('title', 'Kenya Tax Estimator')</title>

    {{-- font awesome for icons --}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    {{-- global styles first, then page-specific overrides --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/responsive.css') }}">
    @yield('styles')
</head>
<body>
    @include('partials.navbar')

    <main class="main-content">
        @yield('content')
    </main>

    @include('partials.footer')

    {{-- chart.js — only pages that need it will use it --}}
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    {{-- pdf export libs —loaded at bottom so they don't block rendering --}}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    @yield('scripts')
</body>
</html>
