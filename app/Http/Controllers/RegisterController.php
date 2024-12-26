<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;

class RegisterController extends BaseApiController
{
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);


        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            $input = $request->all();
            $input['password'] = bcrypt($input['password']);
            $user = User::create($input);
            $success['token'] =  $user->createToken($user->name)->plainTextToken;
            $success['name'] =  $user->name;
            $success['email'] =  $user->email;

            return $this->sendResponse($success, 'User register successfully.');
        }
    }

    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $success['token'] =  $user->createToken($user->name)->plainTextToken;
            $success['name'] =  $user->name;
            $success['email'] =  $user->email;

            return $this->sendResponse($success, 'User login successfully.');
        } else {
            return $this->sendError('Unauthorised.', ['error' => 'Invalid Credentials']);
        }
    }


    // Not tested just created
    /**
     * Logout api
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        // return response()->json($request->user(), 200);
        // $user = auth::user()->tokens;
        // return $request->user()->currentAccessToken()->plainTextToken;
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
            return $this->sendResponse('User Signed Out Successfully', 'Sign Out Successfully');
        } else {
            return $this->sendError('Error occured While Signing Out.', ['error' => 'Something Went Wrong']);
        }
    }
}
