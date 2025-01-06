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
    function fetchDataAsPerAuthority(string $modelClass, array $relationship = null, ?string $uuidIdentifier = 'company_uuid')
    {
        $user = auth()->user();

        // Check if the provided class is a valid model
        if (!is_subclass_of($modelClass, Model::class)) {
            throw new InvalidArgumentException("The class $modelClass is not a valid Eloquent model.");
        }

        // Search Parameter 
        $dataToBeCheck = Company::where('name', 'inyice-coorporation')->first('uuid');

        // Handle data fetching based on user type
        if ($user->company_uuid === $dataToBeCheck->uuid) {
            // Fetch all data for primary users
            return $relationship ? $modelClass::with($relationship)->get() : $modelClass::all();
        } else {
            // Fetch selective data for other users
            return $relationship ? $modelClass::where($uuidIdentifier, $dataToBeCheck->uuid)->with($relationship)->get() : $modelClass::where($uuidIdentifier, $dataToBeCheck->uuid)->get();
            // return $modelClass::where($uuidIdentifier, $dataToBeCheck->uuid)->get();
        }
    }
}
