<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Models\User as ModelsUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Permission;
use App\Models\Company;
use App\Models\Role;
use App\Models\Team;

class UsersController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $company)
    {
        $relationships = ['roles', 'permissions'];
        $users = fetchDataAsPerAuthority(ModelsUser::class, $relationships, $req, $company);
        $sortedUsers = [];
        foreach ($users as $key => $user) {
            $requiredKeys = ['uuid', 'name', 'email', 'company_name', 'company_uuid', 'user_type'];

            // Filter the user's data
            $sortedData = array_intersect_key($user->toArray(), array_flip($requiredKeys));

            if (!empty($user->roles)) {
                $sortedData['role_name'] = $user->roles[0]['name'];
                $sortedData['role_display_name'] = $user->roles[0]['display_name'];
                $sortedData['branch_id'] = $user->roles[0]['pivot']['team_id']; // Access team_id from the pivot
            } else {
                $sortedData['role_name'] = null;
                $sortedData['branch_id'] = null;
            }

            if (!empty($user->permissions)) {
                $sortedData['permission_name'] = $user->permissions[0]['name'];
                $sortedData['permission_display_name'] = $user->permissions[0]['display_name'];
            } else {
                $sortedData['permission_name'] = null;
            }

            // Add the filtered user to the sortedUsers array
            $sortedUsers[] = $sortedData;
        }
        return $this->sendResponse(UserResource::collection($sortedUsers), 'Users retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // return $request->user();
        // $registerController = new RegisterController();
        // // return $registerController->register($request);
        $request['company_name'] = $request->user()->company_name;
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'company_name' => 'required|string|min:5|max:255',
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                if ($request->user()->company_name) {
                    $user = ModelsUser::create(['company_uuid' => $request->user()->company_uuid, ...$validator->validated(), 'password' => bcrypt(Str::random(8))]);
                    $team = Team::where('id', $request->branch_id)->first();
                    $role = Role::where('name', $request->role_name)->first();
                    $permission = Permission::where('name', $request->permission_name)->first();
                    $user->addRole($role, $team);
                    $user->givePermission($permission, $team);
                    return $this->sendResponse($user, 'User register successfully.');
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $relationships = ['roles', 'permissions'];
        $users = fetchDataAsPerAuthority(ModelsUser::class, $relationships);
        return $this->sendResponse(UserResource::collection($users), 'Users retrieved successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
