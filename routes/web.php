<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect()->route('client.index');
});

Route::get('/client/{any?}', function () {
    return view('app');
})->where('any', '.*')->name('client.index');
