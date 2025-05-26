<?php

use App\Models\Company;


if (!function_exists('hostUser')) {
    function hostUser($req)
    {
        $user = $req->user()->load(['staff', 'consumer']);
        $companyData = !empty($user->staff) && !empty($user->staff->company_uuid)
            ? Company::where('uuid', $user->staff->company_uuid)->first()
            : [];

        if (!empty($user->staff)) {
            unset($user->staff->created_at, $user->staff->updated_at, $user->staff->user_uuid);
        }
        if (!empty($user->consumer)) {
            unset($user->consumer->created_at, $user->consumer->updated_at, $user->consumer->user_uuid);
        }
        if (!empty($user)) {
            unset($user->created_at, $user->updated_at, $user->email_verified_at);
        }
        if (!empty($companyData)) {
            unset($companyData->created_at, $companyData->updated_at);
            $user->company = $companyData;
        }
        $user->company = $companyData;
        $user->isAuthorized = !empty($companyData) && isset($companyData->name) ? true : false;
        $user->isStaff = !empty($user->staff) ? true : false;
        $user->isConsumer = !empty($user->consumer) ? true : false;
        return $user;
    }
}
