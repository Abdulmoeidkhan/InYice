<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\CompanyConsumer;
use Illuminate\Http\Request;
use App\Models\Consumer;

class ConsumerController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $company = '')
    {
        $company_consumers = CompanyConsumer::where('company_uuid', $company)->pluck('consumer_uuid')->toArray();
        $consumers = Consumer::whereIn('uuid', $company_consumers)->get();
        return $this->sendResponse(UserResource::collection($consumers), 'Consumer retrieved successfully.');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $company = '')
    {
        $validator = Validator::make($request->all(), [
            'user_uuid' => 'required|string|exists:users,uuid|unique:consumers,user_uuid',
            'consumer_contact' => 'nullable|string',
            'consumer_email' => 'nullable|string|max:255',
        ]);
        if (!Company::where('uuid', $company)->exists()) {
            return $this->sendError('Invalid company UUID.', [], 422);
        }
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            try {
                $company = Company::where('uuid', $company)->first();
                // $consumerData=Consumer::where('user_uuid', $request['user_uuid'])->with(['companies'])->first();
                // return $consumerData;
                $consumer = Consumer::create($validator->validated());
                $consumer->companies()->attach([$company->id]);
                // $consumer->company_consumers()->create(['company_uuid' => $company, 'consumer_uuid' => $consumer->uuid]);
                return $this->sendResponse(new UserResource($consumer), 'Consumer created successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Something Went Wrong', $ex, 422);
                }else{
                    return $this->sendError('Database Error: Something Went Wrong', $ex, 422);
                }
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Consumer $consumer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Consumer $consumer)
    {
        //
    }
}
