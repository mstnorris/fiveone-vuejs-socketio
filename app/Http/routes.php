<?php

// auth()->loginUsingId(1);

get('/', function() {
    return response()->redirectTo('guestbook');
});

Route::group(['middleware' => 'auth'], function () {

    get('guestbook', function() {
        return view('guestbook');
    });

    get('messages', 'MessagesController@index');

    get('users', 'UsersController@index');

    get('api/messages', function() {
        return SomethingGoodHappenedToday\Message::all();
    });

    post('api/messages', function() {
        return SomethingGoodHappenedToday\Message::create(Request::all());
    });


    get('fire', function () {
        event(new SomethingGoodHappenedToday\Events\MyEventNameHere());
        return "event fired";
    });

    get('test', function () {
        return view('test');
    });

});

// Authentication routes...
get('auth/login', 'Auth\AuthController@getLogin');
post('auth/login', 'Auth\AuthController@postLogin');
get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
get('auth/register', 'Auth\AuthController@getRegister');
post('auth/register', 'Auth\AuthController@postRegister');