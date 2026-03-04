@extends('layouts.app')

@section('title', 'Tax Calculator — Kenya Tax Estimator')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/calculator.css') }}">
@endsection

@section('content')
<div class="container section">
    <div class="coming-soon">
        <i class="fa-solid fa-calculator coming-soon__icon"></i>
        <h1>Tax Calculator</h1>
        <p>The full calculator is coming in Phase 2. Check back after the next commit!</p>
        <a href="{{ url('/') }}" class="btn btn--outline">Back to Home</a>
    </div>
</div>
@endsection
