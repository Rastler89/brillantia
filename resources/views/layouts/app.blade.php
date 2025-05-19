<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brillantia</title>

    @livewireStyles
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-900 text-white min-h-screen flex flex-col">

{{-- Navbar --}}
<nav class="bg-gray-800 shadow mb-6">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" class="text-2xl font-semibold text-white hover:text-blue-400 transition">
            Brillantia
        </a>
    </div>
</nav>

{{-- Contingut principal --}}
<main class="flex-1 max-w-7xl mx-auto px-4">
    @yield('content')
</main>

{{-- Footer opcional --}}
<footer class="bg-gray-800 mt-8 py-4 text-center text-sm text-gray-400">
    &copy; {{ date('Y') }} Brillantia. Tots els drets reservats.
</footer>

@livewireScripts
</body>
</html>
