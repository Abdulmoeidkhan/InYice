<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Consumer;

class ConsumerController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req, $consumer = '')
    {
        $staffs = fetchDataAsPerAuthority(Consumer::class, [], $req, $consumer, 'uuid');
        // $companies = Company::all();
        return $this->sendResponse(UserResource::collection($staffs), 'Staff retrieved successfully.');
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
    public function show(Consumer $consumer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consumer $consumer)
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
