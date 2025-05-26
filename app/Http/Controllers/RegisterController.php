<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Company;
use App\Models\Role;
use App\Models\Staff;
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
            $data = (object)[];
            $user = $request->user();
            // $data->user = $user;
            $data = User::where('uuid', $user->uuid)->with(['staff', 'consumer', 'roles', 'permissions'])->first();
            $data->company = isset($data->staff) ? Company::where('uuid', $data->staff->company_uuid)->first() : [];
            $data->userAuthorized = isset($data->company->name) ? $data->company->name === 'inyice-coorporation' : false;
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
            'company_name' => 'required|string|min:5|max:255|unique:companies,name',
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
                    $user = User::create(['uuid' => $company->owner_uuid, ...$validator->validated(), 'password' => $input['password']]);
                    $staffData = $user ? Staff::firstOrCreate(['designation' => 'Director', 'email' => $input['email'], 'user_uuid' => $company->owner_uuid, 'company_uuid' => $company->uuid]) : null;
                    if ($staffData) {
                        $team = Team::firstOrCreate(['name' => 'main', 'display_name' => 'Main']);
                        $adminRole = Role::firstOrCreate(['name' => 'owner', 'display_name' => 'Owner']);
                        $adminPermission = Permission::firstOrCreate(['name' => 'all-access', 'display_name' => 'All Access']);
                        $user->addRole($adminRole, $team);
                        $user->givePermission($adminPermission, $team);
                        // $success['user'] =  ['name' => $user->name, 'email' => $user->email, 'uuid' => $company->user_uuid];
                        // $success['company'] =  ['company_name' => $company->display_name, 'code' => $company->code, 'uuid' => $company->uuid];
                        // $success['staff'] =  ['designation' => $staffData->designation, 'uuid' => $staffData->uuid];
                        // return $loginData;
                        $loginData = $this->login($request);
                        $loginDataArray = json_decode($loginData->getContent(), true);
                        return $this->sendResponse($loginDataArray['data'], 'User register successfully.');
                    }
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong', $ex, 422);
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
                $data = (object)[];
                $user = Auth::user();
                // $data->user = $user;
                $data = User::where('uuid', $user->uuid)->with(['staff', 'consumer', 'roles', 'permissions'])->first();
                // return $user;



                // if ($user->user_type === 0) {
                //     $data->staff = Staff::where('user_uuid', $user->uuid)->first();
                //     unset($data->staff->user_uuid, $data->staff->company_uuid, $data->staff->created_at, $data->staff->updated_at);
                //     unset($data->company->user_uuid, $data->company->created_at, $data->company->updated_at);
                //     unset($data->user->email_verified_at, $data->user->created_at, $data->user->updated_at);
                // }
                // elseif($user->user_type === 1){
                //     $data->staff = Staff::where('user_uuid', $user->uuid)->first();
                //     $data->company = Company::where('uuid', $data->staff->company_uuid)->first();
                //     unset($data->staff->user_uuid, $data->staff->company_uuid, $data->staff->created_at, $data->staff->updated_at);
                //     unset($data->company->user_uuid, $data->company->created_at, $data->company->updated_at);
                //     unset($data->user->email_verified_at, $data->user->created_at, $data->user->updated_at);
                // };


                // Regenerate session ID
                if ($request->hasSession()) {
                    $request->session()->regenerate();
                } else {
                    $data->token =  $user->createToken($user->name)->plainTextToken;
                }
                $data->company = isset($data->staff) ? Company::where('uuid', $data->staff->company_uuid)->first() : [];
                $data->userAuthorized = isset($data->company->name) ? $data->company->name === 'inyice-coorporation' : false;
                // $data->userAuthorized = $data->company->name === 'inyice-coorporation';
                return $this->sendResponse($data, 'User login successfully.');
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
