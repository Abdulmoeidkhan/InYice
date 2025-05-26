<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Staff;
use App\Models\Team;
use App\Models\User;

class StaffController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $company)
    {
        $user = hostUser($req);

        if (empty($user->staff) || empty($user->staff->company_uuid)) {
            $usersData = User::where('uuid', $user->uuid)->with(['staff', 'consumer'])->get();
            return $this->sendResponse(UserResource::collection($usersData), 'Staff retrieved successfully, You do not have any company to be associate.');
        } else {
            $relationships = ['user', 'company'];
            if ($user->isAuthorized) {
                $staffs = Staff::where('company_uuid', $company)->with($relationships)->get();
                return $this->sendResponse(UserResource::collection($staffs), 'All Staff retrieved successfully.');
            } else {
                try {
                    $staffUuids = Staff::where('company_uuid', $user->staff->company_uuid)->pluck('user_uuid')->toArray();
                    if (empty($staffUuids)) {
                        return $this->sendError('Staff not found.', [], 404);
                    }
                    $staffs = User::whereIn('uuid', $staffUuids)->where('status', 1)->with($relationships)->get();
                    return $this->sendResponse(UserResource::collection($staffs), 'Staff retrieved successfully from your organizartion.');
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
    public function store(Request $req, $company)
    {
        // return $request->all();
        $user = hostUser($req);

        $validator = Validator::make($req->all(), [
            'designation' => 'required|string|max:255',
            'name' => 'required|string|max:24',
            'email' => 'required|email|unique:users,email',
            'contact' => 'nullable|string',
            'wage' => 'required|integer',
            'start_time' => 'nullable|date_format:H:i:s',
            'end_time' => 'nullable|date_format:H:i:s',
            'remarks' => 'nullable|string|max:255',
            'branch_id' => 'required|integer',
            'permission_id' => 'required|integer',
            'role_id' => 'required|integer',
        ]);

        if (empty($user->staff) || empty($user->staff->company_uuid)) {
            $usersData = User::where('uuid', $user->uuid)->with(['staff', 'consumer'])->get();
            return $this->sendResponse(UserResource::collection($usersData), 'Staff retrieved successfully, You do not have any company to be associate.');
        } else {
            if ($user->isAuthorized || $user->staff->company_uuid == $company) {
                if ($validator->fails()) {
                    return $this->sendError('Validation Error.', $validator->errors());
                } else {
                    try {
                        $userController = new UsersController();
                        $userCreated = $userController->store($req);
                        $userData = json_decode($userCreated->getContent(), true);
                        $userToBeUpdated = User::where('uuid', $userData['data']['uuid'])->first();
                        $req->merge(['user_uuid' => $userData['data']['uuid'], 'company_uuid' => $company]);
                        $staff = Staff::create($req->all());
                        $team = Team::where('id', $req->branch_id)->first();
                        $role = Role::where('id', $req->role_id)->first();
                        $permission = Permission::where('id', $req->permission_id)->first();
                        $userToBeUpdated->addRole($role, $team);
                        $userToBeUpdated->givePermission($permission, $team);
                        $createdStaff = Staff::where('user_uuid', $userData['data']['uuid'])->with(['user', 'company'])->first();
                        return $this->sendResponse(new UserResource($createdStaff), 'Staff created successfully.');
                    } catch (\Illuminate\Database\QueryException $ex) {
                        // Handle specific database errors
                        if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                            return $this->sendError('Database Error: Something Went Wrong', $ex, 422);
                        }
                    }
                }
            } else {
                return $this->sendError('You are not authorized to access this company.', [], 403);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $req, string $company, string $uid)
    {
        $user = hostUser($req);

        $relationships = ['user', 'company'];
        if ($user->isAuthorized) {
            $staffs = Staff::where([['uuid', $uid], ['company_uuid', $company]])->with($relationships)->get();
            // $users = User::where('uuid', $uuid)->with($relationships)->get();
            return $this->sendResponse(UserResource::collection($staffs), 'Staff retrieved successfully.');
        } else {
            try {
                $staffs = Staff::where([['uuid', $uid], ['company_uuid', $user->staff->company_uuid], ['status', 1]])->get();
                return $this->sendResponse(UserResource::collection($staffs), 'Staff retrieved successfully.');
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
    public function update(Request $req, string $company, string $id)
    {
        $user = hostUser($req);

        $staff = Staff::where([['uuid', $id], ['company_uuid', $company]])->first();

        if (!$staff) {
            return $this->sendError('Staff not found.');
        } else {
            unset($req['uuid'], $req['user_uuid'], $req['company_uuid'], $req['status']);
            $validator = Validator::make($req->all(), [
                'designation' => 'sometimes|string|max:255',
                'wage' => 'sometimes|integer',
                'contact' => 'sometimes|string',
                'start_time' => 'sometimes|date_format:H:i:s',
                'end_time' => 'sometimes|date_format:H:i:s',
                'remarks' => 'sometimes|string|max:255',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error.', $validator->errors());
            } else {
                try {
                    $staff->update($req->all());
                    return $this->sendResponse(new UserResource($staff), 'Staff updated successfully.');
                } catch (\Illuminate\Database\QueryException $ex) {
                    // Handle specific database errors
                    if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                        return $this->sendError('Database Error: Something Went Wrong', $ex, 422);
                    }
                }
                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $req, string $company, string $uuid)
    {
        $user = hostUser($req);
        // return $user;
        if ($uuid === $user->uuid || $user->isAuthorized) {
            if ($user && (!$user->staff || $user->isAuthorized)) {
                try {
                    $staff = Staff::where([['uuid', $uuid], ['company_uuid', $company]])->first();
                    //  return $staff;
                    if ($staff && $user->isAuthorized) {
                        $staff->update(['status' => $staff->status == 1 ? 0 : 1]);
                        return $this->sendResponse(new UserResource($staff), 'Staff deleted/restore successfully.');
                    } elseif ($staff && $staff->status == 1) {
                        $staff->update(['status' =>  0]);
                        return $this->sendResponse(new UserResource($staff), 'Staff deleted successfully.');
                    } else {
                        return $this->sendError('Staff not found.', [], 404);
                    }
                } catch (\Exception $ex) {
                    return $this->sendError('An error occurred while deleting the user.', $ex->getMessage(), 422);
                }
            } else {
                return $this->sendError('Unauthorized.', 'You cannot delete this user.');
            }
        }
    }
}
