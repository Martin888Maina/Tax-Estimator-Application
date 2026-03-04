<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Kenya Tax Estimator — calculate your PAYE, SHIF, NSSF, Housing Levy, and net take-home pay instantly.">
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
