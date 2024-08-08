export interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    amount: number;
}

export interface Invoice {
    id?: string;
    invoice_number: string;
    invoice_date: string;
    due_date: Date | null;
    from: string;
    phone_number: string;
    notes: string;
    subtotal: number;
    tax: number;
    total: number;
    amount_paid: number;
    balance_due: number;
    items: InvoiceItem[];
}