<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use App\Http\Resources\UserResource;
use App\Models\User as ModelsUser;
use Illuminate\Http\Request;

class UsersController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $relationships = ['roles', 'permissions'];
        $users = fetchDataAsPerAuthority(ModelsUser::class, $relationships);
        return $this->sendResponse(UserResource::collection($users), 'Users retrieved successfully.');
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
    public function show(string $id)
    {
        $relationships = ['roles', 'permissions'];
        $users = fetchDataAsPerAuthority(ModelsUser::class, $relationships);
        return $this->sendResponse(UserResource::collection($users), 'Users retrieved successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
