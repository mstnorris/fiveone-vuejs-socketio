<?php namespace SomethingGoodHappenedToday\Repositories;

use SomethingGoodHappenedToday\User;

class EloquentUserRepository implements UserRepository
{
    public function getAll() {
        return User::all();
    }

    public function show($id)
    {
        return User::find($id);
    }
}