<?php namespace SomethingGoodHappenedToday;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'name',
        'email',
        'message'
    ];
}
