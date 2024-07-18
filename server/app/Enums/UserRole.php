<?php

enum UserRole: string {
    case ADMIN = 'admin';
    case CUSTOMER = 'customer';

    public function label(): string {
        return match ($this) {
            UserRole::ADMIN => 'Admin',
            UserRole::CUSTOMER => 'Customer',
        };
    }

    public function isCustomer(): bool {
        return $this === UserRole::CUSTOMER;
    }

    public function isAdmin(): bool {
        return $this === UserRole::ADMIN;
    }
}