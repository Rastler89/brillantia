<?php

namespace App\Filament\Resources\ItemResource\Widgets;

use App\Models\Category;
use App\Models\Item;
use Filament\Forms\Components\Select;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TotalItemValue extends BaseWidget
{
    public ?string $category = null;

    protected function getCards(): array
    {
        $query = Item::query();

        if ($this->category) {
            $query->where('category_id', $this->category);
        }

        $totalValue = $query->sum(\DB::raw('quantity * price'));

        return [
            Card::make('Valor total d\'articulos', '€' . number_format($totalValue, 2, ',', '.'))
                ->description($this->category ? ' Filtrado por categoria': 'Todos los articulos')
                ->color('primary'),
        ];
    }

    protected function getFormSchema(): array
    {
        return [
            Select::make('category')
                ->label('Categoria')
                ->options(Category::all()->pluck('name','id'))
                ->searchable()
                ->placeholder('Todas las categorias')
        ];
    }

    protected function getColumns(): int
    {
        return 1;
    }
}
