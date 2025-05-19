<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;

class CatalogController extends Controller
{
    public function index(Request $request) {
        $query = Item::where('is_active', true);

        // Cerca bàsica
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate(12); // Paginació

        return view('catalog.index', compact('products'));
    }
}
