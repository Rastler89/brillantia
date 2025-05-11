<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ItemResource\Pages;
use App\Filament\Resources\ItemResource\RelationManagers;
use App\Models\Category;
use App\Models\Item;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ItemResource extends Resource
{
    protected static ?string $model = Item::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationGroup = 'Tienda';
    protected static ?string $label = 'Producto';
    protected static ?string $navigationLabel = 'Productos';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->label('Nombre')
                    ->required(),
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Categoria')
                    ->required(),
                FileUpload::make('image')
                    ->label('Imagen')
                    ->image()
                    ->directory('items'),
                Textarea::make('materials')
                    ->label('Materiales'),
                TextInput::make('weight')
                    ->label('Peso')
                    ->numeric()
                    ->suffix('g'),
                TextInput::make('price')
                    ->label('Precio')
                    ->numeric()
                    ->prefix('€')
                    ->required(),
                TextInput::make('quantity')
                    ->label('Cantidad')
                    ->numeric(),
                Textarea::make('description')
                    ->label('Descripcion'),
                Toggle::make('is_active')
                    ->label('Activo')
                    ->default(true)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')->label('Imagen')->circular(),
                TextColumn::make('name')->label('Nombre')->searchable(),
                TextColumn::make('price')
                    ->label('Precio')
                    ->sortable()
                    ->money('eur', true),
                TextColumn::make('quantity')->label('Stock'),
                IconColumn::make('is_active')->boolean()->label('Activo'),//
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Action::make('Añadir stock')
                    ->form([
                        TextInput::make('amount')
                            ->label('Cantidad a añadir')
                            ->numeric()
                            ->required(),
                    ])
                    ->action(function (array $data, \App\Models\Item $record) {
                        $record->increment('quantity',$data['amount']);
                        $record->save();
                    })
                    ->color('success')
                    ->icon('heroicon-o-plus')
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListItems::route('/'),
            'create' => Pages\CreateItem::route('/create'),
            'edit' => Pages\EditItem::route('/{record}/edit'),
        ];
    }
}
