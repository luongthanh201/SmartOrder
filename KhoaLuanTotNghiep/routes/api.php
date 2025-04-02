<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CateController;
use App\Http\Controllers\API\MenuController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\TableController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/login', [AuthController::class, 'login']);

// Các route yêu cầu xác thực (đã đăng nhập)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Các API khác cần đăng nhập mới được dùng
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🔹 Chỉ admin mới có quyền vào route này
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json(['message' => 'Chào mừng Admin!']);
        });
        // Tai Khoan
        Route::get('/admin/list_user', [AuthController::class, 'index']);
        //add
        Route::post('/add_user', [AuthController::class, 'register']);
        //delete
        Route::delete('/admin/user/{id}', [AuthController::class, 'destroy']);

        // Quan ly ban
        // add
        Route::post('/admin/add_table', [TableController::class, 'store']);
        // update
        Route::put('/admin/update_table/{id}', [TableController::class, 'update']);
        // delete
        Route::delete('/admin/table/{id}', [TableController::class, 'destroy']);

        //Danh muc
        // add
        Route::post('/admin/add_cate', [CateController::class, 'store']);
        // update
        Route::put('/admin/update_cate/{id}', [CateController::class, 'update']);
        // delete
        Route::delete('/admin/delete_cate/{id}', [CateController::class, 'destroy']);
        
        //Menu
        // add
        Route::post('/admin/add_menu', [MenuController::class, 'store']);
        // update
        Route::put('/admin/update_menu/{id}', [MenuController::class, 'update']);
        // delete
        Route::delete('/admin/cate/{id}', [MenuController::class, 'destroy']);

        //Đơn hàng

    });

    // 🔹 Chỉ staff mới có quyền vào route này
    Route::middleware('role:staff')->group(function () {
        Route::get('/staff/dashboard', function () {
            return response()->json(['message' => 'Chào mừng Staff!']);
        });

    });
});


// Danh mục 
Route::get('/cate', [CateController::class, 'index']);

// Bàn
Route::get('/table', [TableController::class, 'index']);

//Menu
Route::get('/list_menu', [MenuController::class, 'index']);

// Đơn hàng
Route::get('/order', [OrderController::class, 'index']);  

// Đơn hàng chi tiết
Route::get('/order_item/{id}', [OrderController::class, 'show']);  
