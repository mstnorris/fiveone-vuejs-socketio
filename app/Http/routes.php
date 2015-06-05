<?php

get('guestbook', function() {
    return view('guestbook');
});

get('api/messages', function() {
    return App\Message::all();
});

post('api/messages', function() {
    return App\Message::create(Request::all());
});

Route::get('fire', function () {
    event(new App\Events\MyEventNameHere());
    return "event fired";
});

Route::get('test', function () {
    return view('test');
});