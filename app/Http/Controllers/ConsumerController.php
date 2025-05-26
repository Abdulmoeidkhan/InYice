<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\Consumer;
use App\Models\CompanyConsumer;
use App\Models\User;

class ConsumerController extends BaseApiController
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $company)
    {
        $user = hostUser($req);
        // return $user;
        if (empty($user->staff) || empty($user->staff->company_uuid)) {
            $usersData = User::where('uuid', $user->uuid)->with(['staff', 'consumer'])->get();
            return $this->sendResponse(UserResource::collection($usersData), 'Consumer retrieved successfully, You do not have any company to be associate.');
        }
        try {
            if ($user->isAuthorized) {
                $relationships = ['companies', 'user'];
                $company = Company::where('uuid', $company)->first();
                $company_consumers = CompanyConsumer::where('company_id', $company->id)->pluck('consumer_id')->toArray();
                if (empty($company_consumers)) {
                    return $this->sendError('Consumers not found for company ' . $company->display_name . '.', [], 404);
                }
                $consumers = Consumer::whereIn('id', $company_consumers)->with($relationships)->get();
                return $this->sendResponse(UserResource::collection($consumers), 'All Consumers of given company retrieved successfully.');
            } else {
                $relationships = ['user'];
                $userCompany = Company::where('uuid', $user->staff->company_uuid)->first();
                $company_consumers = CompanyConsumer::where('company_id', $userCompany->id)->pluck('consumer_id')->toArray();
                if ($company_consumers->isEmpty()) {
                    return $this->sendError('Consumers not found.', [], 404);
                }
                $consumers = Consumer::whereIn('id', $company_consumers)->with($relationships)->get();
                $consumers->each(function ($consumers) {
                    $consumers->companies->each->setHidden(['pivot']);
                });
                return $this->sendResponse(UserResource::collection($consumers), 'Consumers retrieved successfully from your organizartion.');
            }
        } catch (\Illuminate\Database\QueryException $ex) {
            // Handle specific database errors
            if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
            }

            // General database error
            return $this->sendError('Database Error.', $ex->getMessage());
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $req, $company)
    {
        $user = hostUser($req);
        $validator = Validator::make($req->all(), [
            'user_uuid' => 'nullable|string|exists:users,uuid|unique:consumers,user_uuid',
            'consumer_name' => 'required|string|max:255',
            'consumer_contact' => 'required|string|max:255',
            'consumer_email' => 'nullable|string|max:255',
            'create_user' => 'required|boolean',
        ]);
        if (empty($user->staff) || empty($user->staff->company_uuid)) {
            $usersData = User::where('uuid', $user->uuid)->with(['staff', 'consumer'])->get();
            return $this->sendResponse(UserResource::collection($usersData), 'Consumer retrieved successfully, You do not have any company to be associate.');
        } else {
            if ($user->isAuthorized || $user->staff->company_uuid == $company) {
                if ($validator->fails()) {
                    return $this->sendError('Validation Error.', $validator->errors());
                } else {
                    try {

                        $company = Company::where('uuid', $company)->first();

                        if (empty($company)) {
                            return $this->sendError('Company Not Found.', [], 404);
                        }

                        if ($validator->validated()['create_user'] == true) {
                            $clonedRequest = clone $req;
                            $clonedRequest->merge([
                                'name' => $clonedRequest->input('consumer_name'),
                                'email' => $clonedRequest->input('consumer_email'),
                            ]);
                            $userController = new UsersController();
                            $userCreated = $userController->store($clonedRequest);
                            $userData = json_decode($userCreated->getContent(), true);
                            $req->merge(['user_uuid' => $userData['data']['uuid']]);
                        }

                        $consumer = Consumer::create($req->all());
                        $consumer->companies()->syncWithoutDetaching([$company->id]);
                        $updatedConsumer = Consumer::where('uuid', $consumer->uuid)->with(['companies', 'user'])->first();
                        return $this->sendResponse(new UserResource($updatedConsumer), 'Consumer created successfully.');
                    } catch (\Illuminate\Database\QueryException $ex) {
                        // Handle specific database errors
                        if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                            return $this->sendError('Database Error: Something Went Wrong', $ex, 422);
                        } else {
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

        $relationships = ['companies', 'user'];

        // return $user;
        if ($user->isAuthorized) {
            $consumer = Consumer::where('uuid', $uid)->with($relationships)->get();
            // return $consumer;
            $consumer->each(function ($consumer) {
                $consumer->companies->each->setHidden(['pivot']);
            });
            return !empty($consumer) ? $this->sendResponse(UserResource::collection($consumer), 'Consumer retrieved successfully.') : $this->sendError('Consumer Not Found', [], 404);
        } else {
            try {
                $companyModel = Company::where('uuid', $company)->first();
                if (!$companyModel) {
                    return $this->sendError('Company Not Found.', [], 404);
                }
                $consumer = Consumer::whereHas('companies', function ($query) use ($companyModel) {
                    $query->where('companies.id', $companyModel->id);
                })->where('uuid', $uid)->with($relationships)->get();

                $consumer->each(function ($consumer) {
                    $consumer->companies->each->setHidden(['pivot']);
                });
                return !empty($consumer) ? $this->sendResponse(UserResource::collection($consumer), 'Consumer retrieved successfully.') : $this->sendError('Consumer Not Found', [], 404);
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
    public function update(Request $req, string $company, string $uid)
    {
        $user = hostUser($req);

        $validator = Validator::make($req->all(), [
            'user_uuid' => 'sometimes|string|exists:users,uuid|unique:consumers,user_uuid,' . $uid . ',uuid',
            'consumer_name' => 'sometimes|string|max:255',
            'consumer_contact' => 'sometimes|string|max:255',
            'consumer_email' => 'sometimes|string|max:255',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }
        // return $user->isAuthorized;
        if ($user->isAuthorized) {
            $consumer = Consumer::where([['uuid', $uid]])->first();
            $consumer->update($validator->validated());
            // return $consumer;
            return !empty($consumer) ? $this->sendResponse(new UserResource($consumer), 'Consumer retrieved successfully.') : $this->sendError('Consumer Not Found', [], 404);
        } else {
            try {
                $companyModel = Company::where('uuid', $company)->first();
                if (!$companyModel) {
                    return $this->sendError('Company Not Found.', [], 404);
                }
                $consumer = Consumer::whereHas('companies', function ($query) use ($companyModel) {
                    $query->where('companies.id', $companyModel->id);
                })->where('uuid', $uid)->first();
                $consumer->update($validator->validated());
                return !empty($consumer) ? $this->sendResponse(new UserResource($consumer), 'Consumer retrieved successfully.') : $this->sendError('Consumer Not Found', [], 404);
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
     * Remove the specified resource from storage.
     */
    public function destroy(Request $req, string $company, string $uuid)
    {
        // Work in progress
        $user = hostUser($req);
        if ($uuid === $user->uuid || $user->isAuthorized) {
            try {
                $consumer = Consumer::where([['uuid', $uuid]])->first();
                if ($consumer && $user->isAuthorized) {
                    $consumer->update(['status' => $consumer->status == 1 ? 0 : 1]);
                    return $this->sendResponse(new UserResource($consumer), 'Consumer deleted/restore successfully.');
                } elseif ($consumer && $consumer->status == 1) {
                    $consumer->update(['status' =>  0]);
                    return $this->sendResponse(new UserResource($consumer), 'Consumer deleted successfully.');
                } else {
                    return $this->sendError('Consumer not found.', [], 404);
                }
            } catch (\Exception $ex) {
                return $this->sendError('An error occurred while deleting the user.', $ex->getMessage(), 422);
            }
        } else {
            return $this->sendError('Unauthorized.', 'You cannot delete this Consumer.');
        }
    }
}
