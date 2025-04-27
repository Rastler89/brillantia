<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SettingResource\Pages;
use App\Filament\Resources\SettingResource\RelationManagers;
use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SettingResource extends Resource
{
    protected static ?string $model = Setting::class;

    protected static ?string $navigationIcon = 'heroicon-o-cog';
    protected static ?string $navigationGroup = 'Ajustes';
    protected static ?string $label = 'Ajustes';
    protected static ?string $navigationLabel = 'Ajustes del sistema';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('key')
                    ->label('Clave')
                    ->required()
                    ->disabledOn('edit') // evita que se edite la clave una vez creada
                    ->unique(Setting::class, 'key', ignoreRecord: true),

                Forms\Components\Placeholder::make('tipo_detectado')
                    ->label('Tipo de campo detectado automáticamente')
                    ->content(fn ($record) => $record ? self::detectFieldType($record->key)::class : 'N/A'),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Fieldset::make('Valor')
                            ->schema(fn ($get) => [
                                $get('key')
                                    ? self::detectFieldType($get('key'))
                                    : Forms\Components\TextInput::make('value')->label('Valor'),
                            ])
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')->label('Clave')->searchable()->sortable(),
                TextColumn::make('value')->label('Valor')->limit(50),
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
            'index' => Pages\ListSettings::route('/'),
            'create' => Pages\CreateSetting::route('/create'),
            'edit' => Pages\EditSetting::route('/{record}/edit'),
        ];
    }

    protected static function detectFieldType(string $key) {
        return match(true) {
            str_contains($key, 'email')     => Forms\Components\TextInput::make('value')->label('Email')->email()->required(),
            str_contains($key, 'phone')     => Forms\Components\TextInput::make('value')->label('Teléfono')->tel(),
            str_contains($key, 'logo'),
            str_contains($key, 'image')     => Forms\Components\FileUpload::make('value')->label('Imagen')->image(),
            str_contains($key, 'url')       => Forms\Components\TextInput::make('value')->label('URL')->url(),
            str_contains($key, 'enable'),
            str_contains($key, 'is_')       => Forms\Components\Toggle::make('value')->label('Activar'),
            str_contains($key, 'description') => Forms\Components\Textarea::make('value')->label('Descripción'),
            default                         => Forms\Components\TextInput::make('value')->label('Valor')->required(),
        };
    }
}
