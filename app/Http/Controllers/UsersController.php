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
    private function dataSortingForAPIResponse($users)
    {
        $sortedUsers = [];
        // return $users;
        foreach ($users as $key => $user) {
            $requiredKeys = ['uuid', 'name', 'email', 'company_name', 'company_uuid', 'user_type','role_id'];

            // Filter the user's data
            $sortedData = array_intersect_key($user->toArray(), array_flip($requiredKeys));

            if (!empty($user->roles)) {
                $sortedData['role_id'] = $user->roles[0]['id'];
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
        return $sortedUsers;
    }



    public function index(Request $req, $company)
    {
        $relationships = ['roles', 'permissions'];
        $users = fetchDataAsPerAuthority(ModelsUser::class, $relationships, $req, $company);
        $sortedUsers = $this->dataSortingForAPIResponse($users);
        // foreach ($users as $key => $user) {
        //     $requiredKeys = ['uuid', 'name', 'email', 'company_name', 'company_uuid', 'user_type'];

        //     // Filter the user's data
        //     $sortedData = array_intersect_key($user->toArray(), array_flip($requiredKeys));

        //     if (!empty($user->roles)) {
        //         $sortedData['role_name'] = $user->roles[0]['name'];
        //         $sortedData['role_display_name'] = $user->roles[0]['display_name'];
        //         $sortedData['branch_id'] = $user->roles[0]['pivot']['team_id']; // Access team_id from the pivot
        //     } else {
        //         $sortedData['role_name'] = null;
        //         $sortedData['branch_id'] = null;
        //     }

        //     if (!empty($user->permissions)) {
        //         $sortedData['permission_name'] = $user->permissions[0]['name'];
        //         $sortedData['permission_display_name'] = $user->permissions[0]['display_name'];
        //     } else {
        //         $sortedData['permission_name'] = null;
        //     }

        //     // Add the filtered user to the sortedUsers array
        //     $sortedUsers[] = $sortedData;
        // }
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
        $request['company_name'] = $request->user()->company_name;
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'company_name' => 'required|string|min:5|max:255',
            'email' => 'required|email',
            'branch_id' => 'required|integer',
            'permission_name' => 'required|integer',
            'role_name' => 'required|integer',
        ]);
        // return $request->all();
        // return $validator->validated();
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                if ($request->user()->company_name) {
                    // return $validator->validated();
                    // return bcrypt(Str::random(8));
                    // return ['company_uuid' => $request->user()->company_uuid, ...$validator->validated()];
                    $user = ModelsUser::create(['company_uuid' => $request->user()->company_uuid, ...$validator->validated(), 'password' => bcrypt(Str::random(8))]);
                    $team = Team::where('id', $request->branch_id)->first();
                    $role = Role::where('id', $request->role_name)->first();
                    $permission = Permission::where('id', $request->permission_name)->first();
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
    public function update(Request $request, string $company, string $id)
    {
        $user = ModelsUser::where('uuid', $id)->with(['roles', 'permissions'])->first();

        if (is_null($user)) {
            return $this->sendError('User not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'branch_id' => 'required|min:1',
            'permission_display_name' => 'required|min:1',
            'role_display_name' => 'required|min:1',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        $team = Team::where('id', $request->branch_id)->orWhere('display_name', $request->branch_id)->first();
        $role = Role::where('id', $request->role_display_name)->orWhere('display_name', $request->role_display_name)->first();
        $permission = Permission::where('id', $request->permission_display_name)->orWhere('display_name', $request->permission_display_name)->first();

        if (is_null($team) || is_null($role) || is_null($permission)) {
            return $this->sendError('Validation Error.', 'Invalid team, role, or permission.', 422);
        }

        try {
            $user->update(['name' => $request['name'], 'email' => $request['email']]);
            $user->roles()->detach();
            $user->permissions()->detach();
            $user->addRole($role, $team);
            $user->givePermission($permission, $team);

            $responseUser = $this->dataSortingForAPIResponse([$user]);
            return $this->sendResponse(new UserResource($responseUser[0]), 'User updated successfully.');
        } catch (\Illuminate\Database\QueryException $ex) {
            if ($ex->getCode() == 23000) {
                return $this->sendError('Database Error: Duplicate entry for team name.', $ex->getMessage(), 422);
            }
            return $this->sendError('Database Error.', $ex->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $company, string $id)
    {
        $user = ModelsUser::where('uuid', $id)->with('roles')->first();
        $role = $user->roles[0]->name;
        if ($role == 'owner' || $role == 'admin') {
            return $this->sendError('Unauthorised.', 'You Can not delete Owner or Admin');
        }
        try {
            // Perform the deletion
            $user->delete();
            return  $this->sendResponse(UserResource::collection($user), 'Users deleted successfully.');
        } catch (\Exception $ex) {
            return $this->sendError('An error occurred while deleting the user.', $ex->getMessage(), 422);
        }
        // return $request->all();
    }
}
