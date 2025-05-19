<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Pages\Page;
use Filament\Forms;
use App\Models\Item;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Client;

class TPV extends Page implements Forms\Contracts\HasForms
{
    use Forms\Concerns\InteractsWithForms;

    protected static string $resource = SaleResource::class;
    protected static ?string $navigationIcon = 'heroicon-o-calculator'; // icona (opcional)

    protected static ?string $navigationLabel = 'TPV';

    protected static ?string $navigationGroup = 'Vendes'; // Grup del menú (opcional)

    protected static bool $shouldRegisterNavigation = true;

    protected static string $view = 'filament.resources.sale-resource.pages.t-p-v';

    public ?array $data = [];
    public ?int $client_id = null;
    public array $items = [];

    public function mount(): void {
        $this->form->fill();
    }

    protected function getFormSchema(): array {
        return [
            Select::make('client_id')
                ->label('Cliente')
                ->options(Client::all()->pluck('name', 'id'))
                ->searchable()
                ->reactive()
                ->required(),
            Repeater::make('items')
                ->label('Linea de productos')
                ->schema([
                    Select::make('product_id')
                        ->label('Producto')
                        ->options(Item::all()->pluck('name', 'id'))
                        ->reactive()
                        ->required()
                        ->searchable()
                        ->afterStateUpdated(function ($state, callable $get, callable $set) {
                            $clientId = $get('../../client_id');

                            $item = Item::find($state);
                            $client = Client::find($clientId);
                            $qty = (float) $get('quantity');

                            if ($item && $client) {
                                /*$price = $client->is_shop
                                    ? $item->price
                                    : $item->price - $item->price * 0.2;*/
                                $price = $item->price;
                                $set('unit_price', number_format($price, 2));
                                $set('line_total', number_format($price*$qty, 2));
                            } else {
                                $set('unit_price', number_format(0, 2));
                                $set('line_total', number_format(0, 2));
                            }


                        }),
                    TextInput::make('quantity')
                        ->label('Cantidad')
                        ->numeric()
                        ->default(1)
                        ->reactive()
                        ->required()
                        ->afterStateUpdated(function ($state, callable $get, callable $set) {
                            $qty = (float) $get('quantity');
                            $unit = (float) $get('unit_price');

                            $set('line_total', number_format($qty*$unit, 2));
                        }),
                    TextInput::make('unit_price')
                        ->label('Precio unitario (€)')
                        ->disabled()
                        ->dehydrated(),
                    TextInput::make('line_total')
                        ->label('Total')
                        ->disabled()
                        ->dehydrated(),

                ])
                ->default([])
                ->columns(4)
                ->reactive()
                ->afterStateUpdated(function ($state, callable $get, callable $set) {
                    $items = $get('items') ?? [];
                    $total = 0;

                    foreach ($items as $item) {
                        $qty = $item['quantity'] ?? 0;
                        $price = $item['unit_price_hidden'] ?? 0;
                        $total += $qty * $price;
                    }

                    $set('total_general', '💰 ' . number_format($total, 2) . ' €');
                }),
                TextInput::make('total_general')
                    ->label('TOTAL VENDA (€)')
                    ->disabled()
                    ->dehydrated(),
        ];
    }
}
