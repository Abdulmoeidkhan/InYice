<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Company;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;

class RegisterController extends BaseApiController
{

    /**
     * User Auth Checker api
     *
     * @return \Illuminate\Http\Response
     */



    /**
     * Validate the Sanctum token and get the associated user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateUser(Request $request)
    {
        if ($request->user()) {
            return $this->sendResponse($request->user(), 'Authenticated user retrieved successfully.');
        } else {
            return $this->sendError('No User Found.', ['error' => 'Unable to Find User'],401);
        }
        // $user = auth()->user;
        // return $user;
        // // Get the token from the request header
        // $token = $request->bearerToken();

        // // Check if the token exists and is valid
        // if (!$token) {
        //     return $this->sendError('Unauthenticated.', ['error' => 'Token not provided']);
        // }

        // // Retrieve the token from the database using Sanctum's PersonalAccessToken model
        // $personalAccessToken = PersonalAccessToken::findToken($token);

        // // If the token is not found or is invalid, return an error
        // if (!$personalAccessToken) {
        //     return $this->sendError('Unauthenticated.', ['error' => 'Invalid token']);
        // }

        // // Get the associated user
        // $user = $personalAccessToken->tokenable;
        // if ($user) {
        //     $userWithRoles = User::where('uuid', $user->uuid)->with(['roles'])->first();
        //     // Return the user information as a response
        //     return $this->sendResponse($userWithRoles, 'Authenticated user retrieved successfully.');
        // } else {
        //     return $this->sendError('Unauthenticated.', ['error' => 'Unable to Find User']);
        // }
    }


    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'company_name' => 'required|string|min:5|max:255|unique:users,company_name',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);


        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                $input = $request->all();
                $input['password'] = bcrypt($input['password']);
                $company = Company::create(['name' => strtolower(str_replace(' ', '-', $input['company_name'])), 'display_name' => $input['company_name'], 'email' => $input['email']]);
                if ($company) {
                    $user = User::create(['company_uuid' => $company->uuid, ...$validator->validated(), 'password' => $input['password']]);
                    // $adminRole = Role::where('name', 'admin')->first();
                    // $adminPermission = Permission::where('name', 'all-access')->first();
                    // $team = Team::where('name', 'main')->first();
                    $team = Team::firstOrCreate(['name' => 'main', 'display_name' => 'Main']);
                    $adminRole = Role::firstOrCreate(['name' => 'owner', 'display_name' => 'Owner']);
                    $adminPermission = Permission::firstOrCreate(['name' => 'all-access', 'display_name' => 'All Access']);
                    $user->addRole($adminRole, $team);
                    $user->givePermission($adminPermission, $team);
                    // $success['token'] =  $user->createToken($user->name)->plainTextToken;
                    $success['name'] =  $user->name;
                    $success['company'] =  $user->company_name;
                    $success['email'] =  $user->email;
                    return $this->sendResponse($success, 'User register successfully.');
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Duplicate entry for role name.', $ex->getMessage(), 422);
                }

                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
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
            // $success['token'] =  $user->createToken($user->name)->plainTextToken;
            $success['name'] =  $user->name;
            $success['uuid'] =  $user->uuid;
            $success['email'] =  $user->email;
            $success['company_uuid'] =  $user->uuid;
            $success['company_name'] =  $user->company_name;

            $request->session()->regenerate();
            return $this->sendResponse($success, 'User login successfully.');
        } else {
            return $this->sendError('Unauthorised.', ['error' => 'Invalid Credentials']);
        }
    }


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
            // Auth::logout();
            $request->session()->flush();
            $request->session()->regenerate();
            return $this->sendResponse('User Signed Out Successfully', 'Sign Out Successfully');
        } else {
            return $this->sendError('Error occured While Signing Out.', ['error' => 'Something Went Wrong']);
        }
    }
}
