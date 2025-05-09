<?php

use App\Models\Company;
use Illuminate\Database\Eloquent\Model;


if (!function_exists('fetchDataAsPerAuthority')) {
    /**
     * Fetch data based on user type and UUID.
     *
     * @param string $modelClass The fully qualified class name of the model.
     * @param string $uuid The UUID to check against.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    function fetchDataAsPerAuthority(string $modelClass, array $relationship = [], ?object $req = null, ?string $company = '', ?string $identifier = 'company_uuid',)
    {

        // Check if the provided class is a valid model
        if (!is_subclass_of($modelClass, Model::class)) {
            throw new InvalidArgumentException("The class $modelClass is not a valid Eloquent model.");
        }

        // Search Parameter 
        $dataToBeCheck = Company::where('name', 'inyice-coorporation')->first('uuid');
        // $user
        $user = null;
        if ($req) {
            $user = $req->user();
        } else {
            $user = auth()->user();
        }

        // Handle data fetching based on user type
        if ($company === $dataToBeCheck->uuid) {

            $validCompanyData = strlen($company) > 0 ? Company::where('uuid', $company)->first('uuid') : false;
            // Fetch all data for primary users
            if ($validCompanyData) {
                return $relationship ? $modelClass::with($relationship)->where($identifier, $company)->get() : $modelClass::where($identifier, $company)->get();
            } else {
                return $relationship ? $modelClass::with($relationship)->get() : $modelClass::all();
            }
        } else {
            // Fetch selective data for other users
            return $relationship ? $modelClass::where($identifier, $company)->with($relationship)->get() : $modelClass::where($identifier, $company)->get();
            // return $modelClass::where($identifier, $dataToBeCheck->uuid)->get();
        }
    }
}
