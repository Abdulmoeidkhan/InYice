<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Company;
use App\Models\ImageCollection;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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
            $data = $request->user();
            $company = Company::where('uuid', $request->user()->company_uuid)->first();
            $company->ProfilePicture = ImageCollection::where('assoc_uuid', $company->uuid)->where('belongs_to','organization')->first(['image_uuid','path']);
            $data->company;
            $data->userAuthorized = $company->name === 'inyice-coorporation';
            return $this->sendResponse($data, 'Authenticated user retrieved successfully.');
        } else {
            return $this->sendError('No User Found.', ['error' => 'Unable to Find User'], 401);
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
            'password' => 'required|min:8',
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
                    $this->login($request);
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
     * Login api for SPA 
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = Auth::user();
                // Prepare response data
                $user->ProfilePicture = ImageCollection::where('assoc_uuid', $user->uuid)->where('belongs_to','userprofile')->first(['image_uuid','path']);
                $user->CompanyProfilePicture = ImageCollection::where('assoc_uuid', $user->company_uuid)
                    ->where('belongs_to', 'organization')
                    ->first(['image_uuid','path']) ?? null;                
                $success = [
                    'name' => $user->name,
                    'uuid' => $user->uuid,
                    'email' => $user->email,
                    'company_uuid' => $user->company_uuid,
                    'company_name' => $user->company_name,
                    'profile_picture' => $user->ProfilePicture,
                    'company_profile_picture' => $user->CompanyProfilePicture,
                ];

                // Check company authorization
                $company = Company::where('uuid', $user->company_uuid)->first();
                $success['userAuthorized'] = $company && $company->name === 'inyice-coorporation';

                // Regenerate session ID
                if ($request->hasSession()) {
                    $request->session()->regenerate();
                } else {
                    $success['token'] =  $user->createToken($user->name)->plainTextToken;
                }

                return $this->sendResponse($success, 'User login successfully.');
            } else {
                return $this->sendError('Unauthorised.', ['error' => 'Invalid Credentials']);
            }
        }
    }

    
    /**
     * Login api for Third Party 
     *
     * @return \Illuminate\Http\Response
     */
    // public function loginThirdParty(Request $request)
    // {

    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email',
    //         'password' => 'required|min:8',
    //     ]);
    //     if ($validator->fails()) {
    //         return $this->sendError('Validation Error.', $validator->errors());
    //     } else {
    //         if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
    //             $user = Auth::user();
    //             $success['token'] =  $user->createToken($user->name)->plainTextToken;
    //             $success['name'] =  $user->name;
    //             $success['uuid'] =  $user->uuid;
    //             $success['email'] =  $user->email;
    //             $success['company_uuid'] =  $user->company_uuid;
    //             $success['company_name'] =  $user->company_name;

    //             $company = Company::where('uuid', $success['company_uuid'])->first();
    //             $success['userAuthorized'] = $company->name === 'inyice-coorporation';

    //             // $request->session()->regenerate();
    //             return $this->sendResponse($success, 'User login successfully.');
    //         } else {
    //             return $this->sendError('Unauthorised.', ['error' => 'Invalid Credentials']);
    //         }
    //     }
    // }



    /**
     * Reset api
     *
     * @return \Illuminate\Http\Response
     */
    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                $status = Password::sendResetLink(
                    $request->only('email')
                );
                $status === Password::RESET_LINK_SENT;
                // return $status;
                return $this->sendResponse($status, 'Password Link Sent.');
            } catch (\Illuminate\Database\QueryException $ex) {

                // General database error
                return $this->sendError('Authentication Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Reset Password api
     *
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8',
            'c_password' => 'required|same:password',
        ]);


        if ($validator->fails()) {
            return $this->sendError('Invalid Token / Request.', $validator->errors());
        } else {
            try {
                $updatePassword = DB::table('password_reset_tokens')->where([
                    'email' => $request->email,
                ])->first();
                if ($updatePassword && Hash::check($request->token, $updatePassword->token)) {
                    $user = User::where('email', $request->email)->update(['password' => bcrypt($request->password)]);
                    $user ? DB::table('password_reset_tokens')->where(['email' => $request->email])->delete() : null;
                } else {
                    return $this->sendError('User Not Updated Error.', 'User Not Found');
                }
                return $this->sendResponse([], 'Password Updated Successfully');
            } catch (\Illuminate\Database\QueryException $ex) {

                // General database error
                return $this->sendError('User Not Updated Error.', $ex->getMessage());
            }
        }
    }


    /**
     * Logout api SPA
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        // return response()->json($request->user(), 200);
        // $user = auth::user()->tokens;
        // return $request->user()->currentAccessToken()->plainTextToken;
        // Regenerate session ID
        if ($request->user()) {
            if ($request->hasSession()) {
                $request->session()->flush();
                $request->session()->regenerate();
            } else {
                $request->user()->currentAccessToken()->delete();
            }
            // Auth::logout();
            return $this->sendResponse('User Signed Out Successfully', 'Sign Out Successfully');
        } else {
            return $this->sendError('Error occured While Signing Out.', ['error' => 'Something Went Wrong']);
        }
    }

    // /**
    //  * Logout api ThirdParty
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function logoutThirdParty(Request $request)
    // {
    //     if ($request->user()->currentAccessToken()) {
    //         $request->user()->currentAccessToken()->delete();
    //         return $this->sendResponse('User Signed Out Successfully', 'Sign Out Successfully');
    //     } else {
    //         return $this->sendError('Error occured While Signing Out.', ['error' => 'Something Went Wrong']);
    //     }
    // }
}
