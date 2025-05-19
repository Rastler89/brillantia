@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Catàleg de productes</h1>
        @livewire('catalog-filter')
    </div>
@endsection
