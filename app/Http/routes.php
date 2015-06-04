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