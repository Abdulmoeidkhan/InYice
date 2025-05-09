<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Staff;

class StaffController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $company)
    {
        $registration = new RegisterController();
        $registerd_user = json_decode(($registration->validateUser($req))->getContent(), true);
        $registerd_user_company_uid = $registerd_user['data']['company']['uuid'];
        $staffs = Staff::with('user')->where('company_uuid', $registerd_user_company_uid)->get();
        return $this->sendResponse(UserResource::collection($staffs), 'Staff retrieved successfully.');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $company)
    {
        $userController = new UsersController();
        $user = $userController->store($request);
        $userData = json_decode($user->getContent(), true);
        $request->merge(['user_uuid' => $userData['data']['uuid'], 'company_uuid' => $company]);

        $validator = Validator::make($request->all(), [
            'designation' => 'required|string|max:255',
            'email' => 'required|email',
            'contact' => 'nullable|string',
            'wage' => 'required|integer',
            'start_time' => 'nullable|date_format:H:i:s',
            'end_time' => 'nullable|date_format:H:i:s',
            'remarks' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                $staff = Staff::create($request->all());
                return $this->sendResponse(new UserResource($staff), 'Staff created successfully.');
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

    /**
     * Display the specified resource.
     */
    public function show(string $company, string $id)
    {
        $staff = Staff::with('user')->where([['uuid', $id], ['company_uuid', $company]])->first();
        if (!$staff) {
            return $this->sendError('Staff not found.');
        }
        return $this->sendResponse(new UserResource($staff), 'Staff retrieved successfully.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $company, string $id)
    {
        $staff = Staff::where([['uuid', $id], ['company_uuid', $company]])->first();
        
        if (!$staff) {
            return $this->sendError('Staff not found.');
        } else {
            unset($request['uuid'], $request['user_uuid'], $request['company_uuid'], $request['status']);
            $validator = Validator::make($request->all(), [
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
                    $staff->update($request->all());
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
    public function destroy(Request $request, string $company, string $id)
    {
        $staff = Staff::where([['uuid', $id], ['company_uuid', $company]])->first();
        if (!$staff) {
            return $this->sendError('Staff not found.');
        }
        $staff->update(['status' => 0, 'company_uuid' => null]);
        return $this->sendResponse($staff, 'Staff deleted successfully.');
    }
}
