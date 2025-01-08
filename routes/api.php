<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\TeamsController;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::controller(RegisterController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login')->name('login');
    Route::post('loginThirdParty', 'loginThirdParty')->name('loginThirdParty');
    Route::post('reset', 'reset')->name('password.reset');
    Route::post('resetPassword', 'resetPassword')->name('resetPassword');
    // Route::get('checkUser', 'validateUser')->name('checkUser');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('checkUser', [RegisterController::class, 'validateUser'])->name('checkUser');
    Route::post('logoutThirdParty', [RegisterController::class, 'logoutThirdParty']);
    Route::post('logout', [RegisterController::class, 'logout']);
    Route::resource('/{company}/users', UsersController::class);
    Route::resource('usersRoles', RolesController::class);
    Route::resource('usersPermissions', PermissionsController::class);
    Route::resource('usersTeams', TeamsController::class);
    Route::resource('usersCompanies', CompanyController::class);
});
