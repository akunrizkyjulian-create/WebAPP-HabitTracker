<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Habit Tracker</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="header">
        <h1 class="page-title">Today</h1>
        <div id="circle-progress"></div>
    </div>

    <div id="date-nav"></div>

    <div id="app">
        <p>Loading...</p>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>