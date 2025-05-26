<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Models\User as ModelsUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Company;
use App\Models\Staff;


class UsersController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    private function dataSortingForAPIResponse($users)
    {
        $sortedUsers = [];
        foreach ($users as $key => $user) {
            $requiredKeys = ['uuid', 'name', 'email', 'contact', 'company_name', 'company_uuid', 'user_type', 'role_id', 'consumer', 'staff'];

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
                $sortedData['permission_id'] = $user->permissions[0]['id'];
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



    public function index(Request $req)
    {
        // This can be used to get data in the same table to get same other columns value which has in common
        // $userUuids = Staff::where('company_uuid', function ($query) use ($req) {
        //     $query->select('company_uuid')
        //         ->from('staff')
        //         ->where('user_uuid', $req->user()->uuid)
        //         ->limit(1);
        // })->pluck('user_uuid')->toArray();
        // Check if the user has a staff record with a company_uuid
        $user = hostUser($req);
        if (empty($user->staff) || empty($user->staff->company_uuid)) {
            $users = ModelsUser::where('uuid', $user->uuid)->with(['staff', 'consumer'])->get();
            return $this->sendResponse(UserResource::collection($users), 'User retrieved successfully, You do not have any company to be associate.');
        } else {
            $company = Company::where('uuid', $user->staff->company_uuid)->first();
            $isAuthorized = $company->name == 'inyice-coorporation' ? true : false;
            $relationships = ['staff', 'consumer'];
            if ($user->isAuthorized) {
                $users = ModelsUser::with($relationships)->get();
                return $this->sendResponse(UserResource::collection($users), 'All Users retrieved successfully.');
            } else {
                try {
                    $userUuids = Staff::where('company_uuid', $req->user()->load(['staff'])->staff->company_uuid)->pluck('user_uuid')->toArray();
                    if (empty($userUuids)) {
                        return $this->sendError('Staff not found.', [], 404);
                    }
                    $users = ModelsUser::whereIn('uuid', $userUuids)->where('status', 1)->with($relationships)->get();
                    $sortedUsers = $this->dataSortingForAPIResponse($users);
                    return $this->sendResponse(UserResource::collection($sortedUsers), 'Users retrieved successfully from your organizartion.');
                } catch (\Illuminate\Database\QueryException $ex) {
                    // Handle specific database errors
                    if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                        return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                    }

                    // General database error
                    return $this->sendError('Database Error.', $ex->getMessage());
                }
            }
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'contact' => 'nullable|string',
            // 'branch_id' => 'required|integer',
            // 'permission_id' => 'required|integer',
            // 'role_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                $user = ModelsUser::create([...$validator->validated(), 'password' => bcrypt(Str::random(8))]);
                // $user = ModelsUser::create([...$validator->validated(), 'password' => 'Abcd123456']);
                // $team = Team::where('id', $request->branch_id)->first();
                // $role = Role::where('id', $request->role_id)->first();
                // $permission = Permission::where('id', $request->permission_id)->first();
                // $user->addRole($role, $team);
                // $user->givePermission($permission, $team);
                return $this->sendResponse($user, 'User register successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                }

                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $req, string $uuid)
    {
        $user = hostUser($req);
        $relationships = ['roles', 'permissions', 'staff', 'consumer'];
        if ($user->isAuthorized) {
            $users = ModelsUser::where('uuid', $uuid)->with($relationships)->get();
            return $this->sendResponse(UserResource::collection($users), 'User retrieved successfully.');
        } else {
            try {
                $userUuids = Staff::where('company_uuid', $req->user()->load(['staff'])->staff->company_uuid)->pluck('user_uuid')->toArray();
                if (!empty($userUuids)) {
                    if (in_array($uuid, $userUuids)) {
                        $users = ModelsUser::where('uuid', $uuid)->where('status', 1)->with($relationships)->get();
                        $sortedUsers = $this->dataSortingForAPIResponse($users);
                        return $this->sendResponse(UserResource::collection($sortedUsers), 'Users retrieved successfully from your organizartion.');
                    } else {
                        return $this->sendError('User not found in your organization.', [], 404);
                    }
                }
                return $this->sendError('Staff not found.', [], 404);
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                }

                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $req, string $uuid)
    {
        $user = hostUser($req);
        if ($uuid == $req->user()->uuid || $user->isAuthorized) {
            $validator = Validator::make($req->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email',
                'contact' => 'sometimes|string',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error.', $validator->errors());
            } else {
                try {
                    $userData = ModelsUser::where('uuid', $uuid)->where('status', 1)->first();
                    if (is_null($userData)) {
                        return $this->sendError('User not found.', [], 404);
                    } else {

                        $userData->update([...$validator->validated()]);
                        return $this->sendResponse(new UserResource($userData), 'User updated successfully.');
                    }
                } catch (\Illuminate\Database\QueryException $ex) {
                    if ($ex->getCode() == 23000) {
                        return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                    }
                    return $this->sendError('Database Error.', $ex->getMessage());
                }
            }
        } else {
            return $this->sendError('Authority Error.', "You can not update any user information");
        }



        // $userToBeChanged = ModelsUser::where('uuid', $uuid)->first();
        // $user = $request->user()->load(['roles', 'permissions']);
        // $teamName = Team::where('id', $user->roles[0]->pivot->team_id)->first();

        // if ($request->user()->load(['roles', 'permissions'])->roles[0]->pivot->team_id == $userToBeChanged->roles[0]->pivot->team_id || $request->user()->load(['roles', 'permissions'])->roles[0]->pivot->team_id == 1) {
        //     return $this->sendError('Unauthorised.', 'You Can not update this user');
        // }
        // // $user->ability(['owner', 'admin'], ['all-access'], $teamName->name);
        // return $user->hasRole(['owner', 'admin'], 'my-awesome-team', true);
        // if ($request->user()->load(['roles', 'permissions'])->roles[0]->pivot->team_id == $userToBeChanged->roles[0]->pivot->team_id || $request->user()->load(['roles', 'permissions'])->roles[0]->pivot->team_id == 1) {
        //     return $this->sendError('Unauthorised.', 'You Can not update this user');
        // } else {
        //     return $this->sendResponse([], 'You are authorized to make changes');
        // }
        // return $request->user()->load(['roles', 'permissions'])->roles;
        // return [$user, $request->user()->load(['roles', 'permissions'])];
        // if (!$request->user()->roles || !$request->user()->permissions) {
        //     return $this->sendError('Unauthorized.', 'You do not have the required roles or permissions.', 403);
        // }

        // if (is_null($user)) {
        //     return $this->sendError('User not found.');
        // }
        // // return $request->all();
        // $validator = Validator::make($request->all(), [
        //     'branch_id' => 'sometimes|min:1',
        //     'role_id' => 'sometimes|min:1',
        //     'permission_id' => 'sometimes|min:1',
        // ]);


        // if ($validator->fails()) {
        //     return $this->sendError('Validation Error.', $validator->errors(), 422);
        // }

        // if (!$request->has('branch_id') || empty($request->branch_id)) {
        //     $request['branch_id'] = $request->user()->roles[0]->team_id;
        // }

        // if (!$request->has('role_id') || empty($request->role_id)) {
        //     $request['role_id'] = $request->user()->roles[0]->role_id;
        // }

        // if (!$request->has('permission_id') || empty($request->permission_id)) {
        //     $request['permission_id'] = $request->user()->permissions[0]->permission_id;
        // }
        // if ($request->has('branch_id') && !empty($request->branch_id)) {
        //     $team = Team::where('id', $request->branch_id)->orWhere('display_name', $request->branch_id)->first();
        // }
        // if ($request->has('role_id') && !empty($request->role_id)) {
        //     $role = Role::where('id', $request->role_id)->orWhere('display_name', $request->role_display_name)->first();
        // }
        // if ($request->has('permission_id') && !empty($request->permission_id)) {
        //     $permission = Permission::where('id', $request->permission_id)->orWhere('display_name', $request->permission_display_name)->first();
        // }


        // return $request->user();
        // if (is_null($team) || is_null($role) || is_null($permission)) {
        //     return $this->sendError('Validation Error.', 'Invalid team, role, or permission.', 422);
        // }


        // try {
        //     $user->update(['name' => $request['name'], 'email' => $request['email'], 'contact' => $request['contact']]);
        //     $user->roles()->detach();
        //     $user->permissions()->detach();
        //     $user->addRole($role, $team);
        //     $user->givePermission($permission, $team);

        //     $responseUser = $this->dataSortingForAPIResponse([$user]);
        //     return $this->sendResponse(new UserResource($responseUser[0]), 'User updated successfully.');
        // } catch (\Illuminate\Database\QueryException $ex) {
        //     if ($ex->getCode() == 23000) {
        //         return $this->sendError('Database Error: Duplicate entry for team name.', $ex->getMessage(), 422);
        //     }
        //     return $this->sendError('Database Error.', $ex->getMessage());
        // }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $req, string $uuid)
    {
        $user = hostUser($req);

        // Check if the user is authorized to delete
        if ($uuid === $user->uuid || $user->isAuthorized) {
            // return $user;
            if ($user && (!$user->staff || $user->isAuthorized)) {
                try {
                    $userData = ModelsUser::where('uuid', $uuid)->first();
                    if ($userData && $user->isAuthorized) {
                        $userData->update(['status' => $userData->status == 1 ? 0 : 1]);
                        return $this->sendResponse(new UserResource($userData), 'User deleted/restore successfully.');
                    } elseif ($userData && $userData->status == 1) {
                        $userData->update(['status' =>  0]);
                        return $this->sendResponse(new UserResource($userData), 'User deleted successfully.');
                    } else {
                        return $this->sendError('User not found.', [], 404);
                    }
                } catch (\Exception $ex) {
                    return $this->sendError('An error occurred while deleting the user.', $ex->getMessage(), 422);
                }
            } else {
                return $this->sendError('Unauthorized.', 'You cannot delete this user.');
            }
        }

        return $this->sendError('Unauthorized.', 'You cannot delete other users.');
    }
}
