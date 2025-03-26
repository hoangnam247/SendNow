<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh']]);
    }

    public function login()
    {
        $credentials = request(['email', 'password']);

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            
            $refreshToken = $this->createRefreshToken();
            return $this->respondWithToken($token, $refreshToken);
            
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    public function profile()
    {
        try {
            $user = JWTAuth::user(); // Sử dụng JWTAuth thay vì auth('api')
            return response()->json($user);
        } catch (JWTException $exception) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout()
    {
        try {
            $token = JWTAuth::getToken();
            JWTAuth::invalidate($token);
            return response()->json(['message' => 'Successfully logged out']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout'], 500);
        }
    }

    public function refresh()
    {
        $refreshToken = request()->refresh_token;
        
        try {
            // Kiểm tra refresh token có tồn tại
            if (!$refreshToken) {
                return response()->json(['error' => 'Refresh token not provided'], 400);
            }

            $decoded = JWTAuth::getJWTProvider()->decode($refreshToken);
            
            // Kiểm tra thời gian hết hạn
            if (isset($decoded['exp']) && $decoded['exp'] < time()) {
                return response()->json(['error' => 'Refresh token expired'], 401);
            }

            // Kiểm tra user tồn tại
            $user = User::find($decoded['sub'] ?? null);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Vô hiệu hóa token cũ
            JWTAuth::invalidate(JWTAuth::getToken());

            // Tạo token mới
            $token = JWTAuth::fromUser($user);
            $newRefreshToken = $this->createRefreshToken();

            return $this->respondWithToken($token, $newRefreshToken);
            
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }
    }

    protected function respondWithToken($token, $refreshToken)
    {
        $user = JWTAuth::user();
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ]);
    }

    private function createRefreshToken()
    {
        $user = JWTAuth::user();
        $data = [
            'sub' => $user->id,
            'jti' => bin2hex(random_bytes(32)), // Unique identifier
            'iat' => time(),
            'exp' => time() + config('jwt.refresh_ttl')
        ];
        
        return JWTAuth::getJWTProvider()->encode($data);
    }
}