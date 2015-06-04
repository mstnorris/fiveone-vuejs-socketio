<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta id="token" name="token" value="{{ csrf_token() }}">
    <title>Laravel Vue Guestbook</title>
    <link rel="stylesheet" href="{{ elixir('css/all.css') }}">
</head>
<body>
<div id="guestbook" class="container">

    <form method="POST" v-on="submit: onSubmitForm">

        <div class="form-group">
            <label for="name">
                Name:
                <span class="error" v-if="! newMessage.name">*</span>
            </label>
            <input type="text" name="name" id="name" class="form-control" v-model="newMessage.name">
        </div>

        <div class="form-group">
            <label for="email">
                Email:
                <span class="error" v-if="! newMessage.email">*</span>
            </label>
            <input type="email" name="email" id="email" class="form-control" v-model="newMessage.email">
        </div>

        <div class="form-group">
            <label for="message">
                Message:
                <span class="error" v-if="! newMessage.message">*</span>
            </label>
            <textarea name="message" id="message" class="form-control" v-model="newMessage.message"></textarea>
        </div>

        <div class="form-group" v-if="! submitted">
            <button type="submit" class="btn btn-default" v-attr="disabled: errors">Sign Guestbook</button>
        </div>

        <div class="alert alert-success animated fadeIn" v-if="submitted">Thanks!</div>

    </form>

    <hr/>

    <article v-repeat="messages">
        <h3>@{{ name }} <small>@{{ email }}</small></h3>
        <div class="body">@{{ message }}</div>
    </article>

    <pre>@{{ $data | json }}</pre>
</div>

<script src="{{ elixir('js/all.js') }}"></script>
</body>
</html>