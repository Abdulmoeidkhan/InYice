<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Team;

class TeamsController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teams = Team::all();
        return $this->sendResponse(UserResource::collection($teams), 'Teams retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:teams,name',
            'display_name' => 'string|min:3|unique:teams,display_name',
            'description' => 'nullable|string|min:10',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        } else {
            try {
                $newTeam = Team::create($validator->validated());
                return $this->sendResponse($newTeam, 'Team saved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Duplicate entry for team name.', $ex->getMessage(), 422);
                }

                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $teams = Team::where('id', $id)->get();
        return $this->sendResponse(UserResource::collection($teams), 'Teams retrieved successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $team = Team::find($id);

        if (is_null($team)) {
            return $this->sendError('Team not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:teams,name,' . $id . ',id',
            'display_name' => 'sometimes|string|min:3|unique:teams,display_name,' . $id . ',id',
            'description' => 'nullable|string|min:10',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        try {
            $team->update($validator->validated());
            return $this->sendResponse(new UserResource($team), 'Team updated successfully.');
        } catch (\Illuminate\Database\QueryException $ex) {
            if ($ex->getCode() == 23000) {
                return $this->sendError('Database Error: Duplicate entry for team name.', $ex->getMessage(), 422);
            }
            return $this->sendError('Database Error.', $ex->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $team = Team::find($id);

        if (is_null($team)) {
            return $this->sendError('Team not found.');
        }

        $team->delete();

        return $this->sendResponse([], 'Team deleted successfully.');
    }
}
