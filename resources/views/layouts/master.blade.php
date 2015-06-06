<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>Something Good Happened Today</title>
    <link rel="stylesheet" href="{{ elixir('css/all.css') }}">
    @yield('header')
</head>
<body>

@include('layouts.partials.navigation')

@yield('content')

<footer class="footer">
    <div class="container">
        <p class="text-muted">Copyright &copy; {{ date('Y') }} Something Good Happened Today. All rights reserved.</p>
    </div>
</footer>
<script src="{{ elixir('js/all.js') }}"></script>
</body>
</html>