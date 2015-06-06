<?php namespace SomethingGoodHappenedToday\Repositories;

interface MessageRepository
{
    public function getAll();

    public function show($id);
}