<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Company;

class CompanyController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $company)
    {
        $companies = fetchDataAsPerAuthority(Company::class, null, $req, $company='', 'uuid');
        // $companies = Company::all();
        return $this->sendResponse(UserResource::collection($companies), 'Company retrieved successfully.');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $company = Company::where('uuid', $id)->first();

        if (is_null($company)) {
            return $this->sendError('Company not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:companies,name,' . $id . ',uuid',
            'display_name' => 'required|string|max:255|unique:companies,display_name,' . $id . ',uuid',
            'email' => 'required|email|unique:companies,email,' . $id . ',uuid',
            'contact' => 'min:9|unique:companies,contact,' . $id . ',uuid',
            'address' => 'nullable|string|min:10',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        try {
            $company_name = strtolower(str_replace(' ', '-', $request['name']));
            $company->update([...$validator->validated(), 'name' => $company_name]);
            return $this->sendResponse(new UserResource($company), 'Company updated successfully.');
        } catch (\Illuminate\Database\QueryException $ex) {
            if ($ex->getCode() == 23000) {
                return $this->sendError('Database Error: Duplicate entry for company Name,Email,Contact.', $ex->getMessage(), 422);
            }
            return $this->sendError('Database Error.', $ex->getMessage());
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
