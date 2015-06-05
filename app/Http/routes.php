<?php

get('/', function() {
    return response()->redirectTo('guestbook');
});

get('guestbook', function() {
    return view('guestbook');
});

get('api/messages', function() {
    return App\Message::all();
});

post('api/messages', function() {
    return App\Message::create(Request::all());
});

get('fire', function () {
    event(new App\Events\MyEventNameHere());
    return "event fired";
});

get('test', function () {
    return view('test');
});

// Authentication routes...
get('auth/login', 'Auth\AuthController@getLogin');
post('auth/login', 'Auth\AuthController@postLogin');
get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
get('auth/register', 'Auth\AuthController@getRegister');
post('auth/register', 'Auth\AuthController@postRegister');