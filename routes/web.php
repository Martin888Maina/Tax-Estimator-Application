<?php

use Illuminate\Support\Facades\Route;

// three public pages — no controllers, just views
Route::view('/', 'pages.landing');
Route::view('/calculator', 'pages.calculator');
Route::view('/about', 'pages.about');
