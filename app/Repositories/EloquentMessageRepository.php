<?php namespace SomethingGoodHappenedToday\Repositories;

use SomethingGoodHappenedToday\Message;

class EloquentMessageRepository implements MessageRepository
{
    public function getAll() {
        return Message::all();
    }

    public function show($id)
    {
        return Message::find($id);
    }
}