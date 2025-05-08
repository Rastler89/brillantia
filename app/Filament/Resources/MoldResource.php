<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MoldResource\Pages;
use App\Filament\Resources\MoldResource\RelationManagers;
use App\Models\Mold;
use App\MoldStatus;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MoldResource extends Resource
{
    protected static ?string $model = Mold::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Moldes';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required(),
                TextInput::make('reference')
                    ->label('Codigo referencia')
                    ->required(),
                FileUpload::make('image')
                    ->label('Imagen')
                    ->image()
                    ->directory('molds'),
                TextInput::make('localization')
                    ->label('Localizacion'),
                Textarea::make('description')
                    ->label('Descripcion'),
                Select::make('status')
                    ->label('Estado')
                    ->options(collect(MoldStatus::cases())->mapWithKeys(fn ($case) => [
                        $case->value => ucfirst(strtolower(str_replace('_', ' ', $case->name))),
                    ])->toArray())
                    ->required()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('reference')
                    ->label('Codigo referencia'),
                TextColumn::make('localization')->label('Localizacion'),
                TextColumn::make('status')
                    ->label('Estado')
                    ->formatStateUsing(fn (MoldStatus $state) => $state->label())
                    ->badge()
                    ->color(fn (MoldStatus $state) => $state->color()),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListMolds::route('/'),
            'create' => Pages\CreateMold::route('/create'),
            'edit' => Pages\EditMold::route('/{record}/edit'),
        ];
    }
}
