@extends('layouts.app')

@section('title', 'About — Kenya Tax Estimator')

@section('content')
<div class="container section">
    <div class="coming-soon">
        <i class="fa-solid fa-circle-info coming-soon__icon"></i>
        <h1>About This Application</h1>
        <p>The full About page is coming in Phase 5. Check back after the final commit!</p>
        <a href="{{ url('/') }}" class="btn btn--outline">Back to Home</a>
    </div>
</div>
@endsection
