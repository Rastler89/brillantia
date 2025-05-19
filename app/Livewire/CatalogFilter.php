<?php

namespace App\Livewire;

use App\Models\Category;
use App\Models\Item;
use Livewire\Component;
use Livewire\WithPagination;

class CatalogFilter extends Component
{
    use WithPagination;

    public $search = '';
    public $type;
    public $items = 12;

    public function updatingSearch() {
        $this->resetPage();
    }

    public function render()
    {
        $categories = $this->getAllCategoryIds((int) $this->type);

        $products = Item::where('is_active', true)
            ->when($this->type, fn($query) => $query->whereIn('category_id', $categories))
            ->when($this->search, fn($query) =>
            $query->where(function($q) {
                $q->where('name', 'like', '%'.$this->search.'%')
                    ->orWhere('description', 'like', '%'.$this->search.'%');
            }))
            ->paginate((int) $this->items);

        return view('livewire.catalog-filter', [
            'products' => $products,
            'types' => Category::all(),
            'filter' => $categories,
        ]);
    }


    function getAllCategoryIds($categoryId)
    {
        $ids = [$categoryId]; // Incloure la categoria actual
        $children = Category::where('parent_id', $categoryId)->get();

        foreach ($children as $child) {
            $ids = array_merge($ids, $this->getAllCategoryIds($child->id));
        }

        return $ids;
    }
}
