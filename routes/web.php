<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/cataleg', function() {
    return view('catalog.index');
})->name('catalog.index');
