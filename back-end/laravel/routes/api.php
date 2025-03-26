<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\ContactListsController;
use App\Http\Controllers\EmailTemplateController;
use App\Http\Controllers\PricingPlanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CampaignEmailController;
use App\Http\Controllers\ContactController;

use Illuminate\Support\Facades\Route;




Route::middleware('auth:api')->group(function () {
    Route::apiResource('email-template', EmailTemplateController::class);
});


Route::middleware('auth:api')->group(function () {
    Route::apiResource('lists', ContactListsController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('campaigns', CampaignsController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('contacts', ContactController ::class);
    Route::put('/contacts/{id}/status', [ContactController::class, 'updateStatus']);
    Route::get('/contact/{id}/statistics', [ContactController::class, 'getMonthlyStatistics']);

});


Route::middleware('auth:api')->group(function () {
    Route::get('/campaigns/{campaign}/email-template', [CampaignsController::class, 'showWithEmailTemplate']);
});


Route::middleware('auth:api')->group(function () {
    Route::post('/send-campaign-email', [CampaignEmailController::class, 'sendCampaignEmail']);
    Route::post('/upload-image', [CampaignEmailController::class, 'uploadImage']);
});

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::apiResource('lists', ContactListsController::class);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
//

});