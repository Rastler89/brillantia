<?php

namespace App\Filament\Resources\ItemResource\Widgets;

use App\Models\Item;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class ItemsWithZeroPrice extends BaseWidget
{

    protected static ?string $heading = 'Articulos con precio 0';

    protected function getTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return Item::query()->where('price', 0);
    }

    protected function getTableColumns(): array
    {
        return [
            TextColumn::make('name')->label('Nom'),
            TextColumn::make('quantity')->label('Stock'),
        ];
    }
}
