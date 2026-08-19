<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Habit Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-white rounded-full shadow-sm px-6 py-3 flex items-center justify-between max-w-4xl mx-auto mt-6">
        <span class="font-bold text-lg">Habit Tracker</span>
        <div id="circle-progress" class="w-12 h-12 rounded-full flex items-center justify-center"></div>
    </nav>

    <div class="max-w-4xl mx-auto px-6">
        <div id="date-nav" class="mt-6"></div>

        <div id="app" class="mt-6 pb-12">
            <p>Loading...</p>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>