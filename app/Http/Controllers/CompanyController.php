<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\User;

class CompanyController extends BaseApiController
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $user = hostUser($req);

        if ($user->isConsumer) {
            $consumerId = $user->consumer ? $user->consumer->id : null;
            if ($consumerId) {
                $companies = Company::whereHas('consumer', function ($query) use ($consumerId) {
                    $query->where('consumer_id', $consumerId);
                })->withCount(['consumer'])->get();
                return $this->sendResponse(UserResource::collection($companies), 'Companies with consumer count retrieved successfully.');
            } else {
                return $this->sendError('Companies Not Found.', 'You do not have any associated company.', 404);
            }
        } elseif ($user->isAuthorized) {
            $relationships = ['staff', 'consumer'];
            try {
                $companies = Company::withCount($relationships)->get();
                return $this->sendResponse(UserResource::collection($companies), 'All Companies data with staff & consumer count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                }
                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        } elseif ($user->isStaff) {
            try {
                $companies = Company::withCount('staff')->get(['email', 'display_name', 'contact', 'industry', 'address', 'city', 'image', 'uuid']);
                return $this->sendResponse(UserResource::collection($companies), 'Companies with staff count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                return $this->sendError('Companies Not Found.', 'Something Went Wrong', 404);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $req, string $uid)
    {
        $user = hostUser($req);

        if ($user->isConsumer) {
            $consumerId = $user->consumer ? $user->consumer->id : null;
            if ($consumerId) {
                $companies = Company::whereHas('consumer', function ($query) use ($consumerId) {
                    $query->where('consumer_id', $consumerId);
                })->where('uuid', $uid)->with(['staff'])->get();
                return $this->sendResponse(UserResource::collection($companies), 'Companies with consumer count retrieved successfully.');
            } else {
                return $this->sendError('Companies Not Found.', 'You do not have any associated company.', 404);
            }
        } elseif ($user->isAuthorized) {
            $relationships = ['staff', 'consumer'];
            try {
                $companies = Company::with($relationships)->where('uuid', $uid)->with(['staff'])->get();
                $companies->each(function ($companies) {
                    $companies->consumer->each->setHidden(['pivot']);
                });
                return $this->sendResponse(UserResource::collection($companies), 'All Companies data with staff & consumer count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                }
                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        } elseif ($user->isStaff) {
            try {
                $companies = Company::with('consumers')->where('uuid', $uid)->with(['staff'])->get(['email', 'display_name', 'contact', 'industry', 'address', 'city', 'image', 'uuid']);
                $companies->each(function ($companies) {
                    $companies->consumer->each->setHidden(['pivot']);
                });
                return $this->sendResponse(UserResource::collection($companies), 'Companies with staff count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                return $this->sendError('Companies Not Found.', 'Something Went Wrong', 404);
            }
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $req, string $uid)
    {

        // Working on this started
        $company = Company::where('uuid', $uid)->first();

        if (is_null($company)) {
            return $this->sendError('Company not found.');
        }
        // return $request->all();
        $validator = Validator::make($req->all(), [
            'contact' => 'nullable|min:9|unique:companies,contact,' . $uid . ',uuid',
            'industry' => 'nullable|string|min:4',
            'address' => 'nullable|string|min:10',
            'city' => 'nullable|string|min:3',
        ]);

        $user = hostUser($req);

        if ($user->isConsumer) {
            $consumerId = $user->consumer ? $user->consumer->id : null;
            if ($consumerId) {
                $companies = Company::whereHas('consumer', function ($query) use ($consumerId) {
                    $query->where('consumer_id', $consumerId);
                })->where('uuid', $uid)->with(['staff'])->get();
                return $this->sendResponse(UserResource::collection($companies), 'Companies with consumer count retrieved successfully.');
            } else {
                return $this->sendError('Companies Not Found.', 'You do not have any associated company.', 404);
            }
        } elseif ($user->isAuthorized) {
            $relationships = ['staff', 'consumer'];
            try {
                $companies = Company::with($relationships)->where('uuid', $uid)->get();
                $companies->each(function ($companies) {
                    $companies->consumer->each->setHidden(['pivot']);
                });
                return $this->sendResponse(UserResource::collection($companies), 'All Companies data with staff & consumer count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong.', $ex->getMessage(), 422);
                }
                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        } elseif ($user->isStaff) {
            try {
                $companies = Company::with('consumers')->where('uuid', $uid)->get(['email', 'display_name', 'contact', 'industry', 'address', 'city', 'image', 'uuid']);
                $companies->each(function ($companies) {
                    $companies->consumer->each->setHidden(['pivot']);
                });
                return $this->sendResponse(UserResource::collection($companies), 'Companies with staff count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                return $this->sendError('Companies Not Found.', 'Something Went Wrong', 404);
            }
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company, string $id)
    {
        // $role = Company::where('uuid', $id)->first();

        // if (is_null($role)) {
        //     return $this->sendError('Company not found.');
        // }

        // $role->delete();

        // return $this->sendResponse([], 'Company deleted successfully.');
    }
}
