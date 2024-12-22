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





Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/auth/profile', [AuthController::class, 'profile']);

Route::apiResource('pricing-plans', PricingPlanController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('email-template', EmailTemplateController::class);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('lists', ContactListsController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('campaigns', CampaignsController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('contacts', ContactController ::class);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/campaigns/{campaign}/email-template', [CampaignsController::class, 'showWithEmailTemplate']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/send-campaign-email', [CampaignEmailController::class, 'sendCampaignEmail']);
});