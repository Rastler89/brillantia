<?php

namespace App;

enum MoldStatus: string
{
    case Stored = 'stored';
    case InUse = 'in_use';
    case Retired = 'retired';
    case Loaned = 'loaned';
    case Rented = 'rented';
    case Repair = 'repair';
    case Missing = 'missing';
    case Cleaning = 'cleaning';
    case UnderReview = 'under_review';

    public function label(): string
    {
        return match ($this) {
            self::Stored => 'Guardado',
            self::InUse => 'En uso',
            self::Retired => 'Descatalogado',
            self::Loaned => 'Prestado',
            self::Rented => 'Alquilado',
            self::Repair => 'Reparación',
            self::Missing => 'Desaparecido',
            self::Cleaning => 'Limpieza',
            self::UnderReview => 'Revisión',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Stored => 'gray',
            self::InUse => 'blue',
            self::Retired => 'gray',
            self::Loaned => 'yellow',
            self::Rented => 'amber',
            self::Repair => 'orange',
            self::Missing => 'red',
            self::Cleaning => 'purple',
            self::UnderReview => 'indigo',
        };
    }
}
