<?php

namespace App\Filament\Resources\MoldResource\Pages;

use App\Filament\Resources\MoldResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMolds extends ListRecords
{
    protected static string $resource = MoldResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
