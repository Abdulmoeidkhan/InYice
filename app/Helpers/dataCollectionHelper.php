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
    function fetchDataAsPerAuthority(string $modelClass, array $relationship = null, ?object $req = null, ?string $company = '', ?string $uuidIdentifier = 'company_uuid',)
    {

        // Check if the provided class is a valid model
        if (!is_subclass_of($modelClass, Model::class)) {
            throw new InvalidArgumentException("The class $modelClass is not a valid Eloquent model.");
        }

        // Search Parameter 
        $dataToBeCheck = Company::where('name', 'inyice-coorporation')->first('uuid');
        $user = null;
        if ($req) {
            $user = $req->user();
        } else {
            $user = auth()->user();
        }

        // Handle data fetching based on user type
        if ($user->company_uuid === $dataToBeCheck->uuid) {

            $validCompanyData = strlen($company) > 0 ? Company::where('uuid', $company)->first('uuid') : false;
            // Fetch all data for primary users
            if ($validCompanyData) {
                return $relationship ? $modelClass::with($relationship)->where($uuidIdentifier, $company)->get() : $modelClass::where($uuidIdentifier, $company)->get();
            } else {
                return $relationship ? $modelClass::with($relationship)->get() : $modelClass::all();
            }
        } else {
            // Fetch selective data for other users
            return $relationship ? $modelClass::where($uuidIdentifier, $user->company_uuid)->with($relationship)->get() : $modelClass::where($uuidIdentifier, $user->company_uuid)->get();
            // return $modelClass::where($uuidIdentifier, $dataToBeCheck->uuid)->get();
        }
    }
}
