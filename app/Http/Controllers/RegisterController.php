<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Team;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;

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
                $company = Company::create(['name' => strtolower(str_replace(' ', '-', $input['company_name'])),'email'=>$input['email']]);
                if($company){
                    $user = User::create($input);
                    $adminRole= Role::where('name', 'admin')->first();
                    $adminPermission= Permission::where('name', 'all-access')->first();
                    $team = Team::where('name', 'main')->first();
                    $user->addRole($adminRole,$team);
                    $user->givePermission($adminPermission,$team);
                    $success['token'] =  $user->createToken($user->name)->plainTextToken;
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
            $success['token'] =  $user->createToken($user->name)->plainTextToken;
            $success['name'] =  $user->name;
            $success['name'] =  $user->company_name;
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
