<?php namespace SomethingGoodHappenedToday\Repositories;

interface UserRepository
{
    public function getAll();

    public function show($id);
}