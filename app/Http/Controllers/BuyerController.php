<?php

namespace App\Http\Controllers;


use App\Http\Controllers\BaseApiController as BaseApiController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Buyer;

class BuyerController extends BaseApiController
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
                $buyers = Buyer::where('buyer_uuid', $user->consumer->uuid)->get();
                return $this->sendResponse(UserResource::collection($buyers), 'Buyers retrieved successfully.');
            } else {
                return $this->sendError('Buyers Not Found.', 'Buyers You do not have invoices.', 404);
            }
        } elseif ($user->isAuthorized) {
            
            $relationships = ['seller', 'buyer'];
            try {
                $buyers = Buyer::withCount($relationships)->get();
                return $this->sendResponse(UserResource::collection($buyers), 'All Buyers data with seller & buyer.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        } elseif ($user->isStaff) {
            try {
                $buyers = Buyer::withCount('buyer')->where('buyer_uuid', $user->staff->company_uuid)->get();
                return $this->sendResponse(UserResource::collection($buyers), 'Buyers with staff count retrieved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                return $this->sendError('Buyers Not Found.', 'Something Went Wrong', 404);
            }
        }
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
    public function show(Buyer $buyer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Buyer $buyer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Buyer $buyer)
    {
        //
    }
}
