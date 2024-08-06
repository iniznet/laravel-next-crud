'use client';

import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';

const InvoicePage: React.FC = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('1');
    const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [queueNumber, setQueueNumber] = useState('');
    const [from, setFrom] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [items, setItems] = useState([{ service: '', description: '', quantity: 1, price: 0, amount: 0 }]);
    const [notes, setNotes] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [balanceDue, setBalanceDue] = useState(0);
    const [loading, setLoading] = useState(true);

    const toast = useRef<Toast>(null);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateTotals = () => {
            const newSubtotal = items.reduce((sum, item) => sum + item.amount, 0);
            setSubtotal(newSubtotal);
            const newTotal = newSubtotal - (newSubtotal * discount / 100) + (newSubtotal * tax / 100);
            setTotal(newTotal);
            setBalanceDue(newTotal - amountPaid);
        };

        calculateTotals();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [items, discount, tax, amountPaid]);

    const addLineItem = () => {
        setItems([...items, { service: '', description: '', quantity: 1, price: 0, amount: 0 }]);
    };

    const removeLineItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const updateLineItem = (index: number, field: keyof { service: string; description: string; quantity: number; price: number; amount: number; }, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value as never;
        if (field === 'quantity' || field === 'price') {
            newItems[index].amount = newItems[index].quantity * newItems[index].price;
        }
        setItems(newItems);
    };

    const printInvoice = () => {
        if (printRef.current) {
            const content = printRef.current;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                    <head>
                        <title>Print Invoice</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                            }
                            .invoice-container {
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ddd;
                            }
                            .invoice-header {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                margin-bottom: 20px;
                                background-color: #4338ca;
                                color: white;
                                padding: 20px;
                            }
                            .invoice-title {
                                font-size: 28px;
                                font-weight: bold;
                            }
                            .invoice-number {
                                font-size: 18px;
                            }
                            .invoice-details {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 20px;
                            }
                            .invoice-details-column {
                                flex: 1;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 20px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 10px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                            .total-section {
                                display: flex;
                                justify-content: flex-end;
                            }
                            .total-column {
                                width: 300px;
                            }
                            .total-row {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 5px;
                            }
                            .notes {
                                margin-top: 20px;
                                border-top: 1px solid #ddd;
                                padding-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="invoice-container">
                            <div class="invoice-header">
                                <div>
                                    <div class="invoice-title">INVOICE</div>
                                    <div class="invoice-number">#${invoiceNumber}</div>
                                </div>
                                <div>
                                    <div>Antrian</div>
                                    <div style="font-size: 24px; font-weight: bold;">${queueNumber}</div>
                                </div>
                            </div>
                            <div class="invoice-details">
                                <div class="invoice-details-column">
                                    <strong>Nama:</strong> ${from}<br>
                                    <strong>No. Handphone:</strong> ${phoneNumber}
                                </div>
                                <div class="invoice-details-column" style="text-align: right;">
                                    <strong>Tanggal Invoice:</strong> ${invoiceDate?.toLocaleDateString()}<br>
                                    <strong>Tanggal Tenggat:</strong> ${dueDate?.toLocaleDateString()}
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${items.map(item => `
                                        <tr>
                                            <td>${item.service}</td>
                                            <td>${item.description}</td>
                                            <td>${item.quantity}</td>
                                            <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</td>
                                            <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div class="total-section">
                                <div class="total-column">
                                    <div class="total-row">
                                        <strong>Subtotal:</strong>
                                        <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal)}</span>
                                    </div>
                                    <div class="total-row">
                                        <strong>Discount:</strong>
                                        <span>${discount}%</span>
                                    </div>
                                    <div class="total-row">
                                        <strong>Tax:</strong>
                                        <span>${tax}%</span>
                                    </div>
                                    <div class="total-row">
                                        <strong>Total:</strong>
                                        <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
                                    </div>
                                    <div class="total-row">
                                        <strong>Amount Paid:</strong>
                                        <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amountPaid)}</span>
                                    </div>
                                    <div class="total-row">
                                        <strong>Balance Due:</strong>
                                        <span>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(balanceDue)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="notes">
                                <strong>Notes:</strong><br>
                                ${notes}
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
        toast.current?.show({severity: 'success', summary: 'Success', detail: 'Invoice printed successfully', life: 3000});
    };

    return (
        <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen flex justify-content-center align-items-center">
            <Toast ref={toast} />
            <Card className="shadow-lg w-full max-w-5xl bg-white">
                {loading ? (
                    <div className="p-4">
                        <Skeleton width="100%" height="150px" className="mb-2"></Skeleton>
                        <Skeleton width="100%" height="50px" className="mb-2"></Skeleton>
                        <Skeleton width="100%" height="150px" className="mb-2"></Skeleton>
                        <Skeleton width="100%" height="200px" className="mb-2"></Skeleton>
                        <Skeleton width="100%" height="100px"></Skeleton>
                    </div>
                ) : (
                    <>
                        <div ref={printRef}>
                            <div className="flex justify-content-between align-items-center mb-4 bg-indigo-700 p-4 rounded-t-lg">
                                <div>
                                    <h1 className="text-4xl font-bold m-0 text-white">INVOICE</h1>
                                    <div className="p-inputgroup mt-2 w-12rem">
                                        <span className="p-inputgroup-addon bg-indigo-200 text-indigo-800">#</span>
                                        <InputText value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="bg-indigo-100" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-bold m-0 text-indigo-200">Antrian</h2>
                                    <div className="p-inputgroup mt-2">
                                        <InputText id="queueNumber" value={queueNumber} onChange={(e) => setQueueNumber(e.target.value)} className="text-center font-bold bg-indigo-200 text-indigo-800" style={{fontSize: '1.5rem', width: '100px'}} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <div className="p-field mb-3">
                                            <label htmlFor="from" className="font-bold text-indigo-800">Nama</label>
                                            <InputText id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="phoneNumber" className="font-bold text-indigo-800">No. Handphone</label>
                                            <InputText id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-indigo-50" />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <div className="p-field mb-3">
                                            <label htmlFor="invoiceDate" className="font-bold text-indigo-800">Tanggal Invoice</label>
                                            <Calendar id="invoiceDate" value={invoiceDate} onChange={(e) => setInvoiceDate(e.value as Date | null)} showTime hourFormat="24" className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field">
                                            <label htmlFor="dueDate" className="font-bold text-indigo-800">Tanggal Tenggat</label>
                                            <Calendar id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.value as Date | null)} showTime hourFormat="24" className="w-full bg-indigo-50" />
                                        </div>
                                    </div>
                                </div>

                                <Divider className="my-4" />

                                <DataTable value={items} className="mt-4">
                                    <Column header="Service" body={(rowData, options) => (
                                        <InputText value={rowData.service} onChange={(e) => updateLineItem(options.rowIndex, 'service', e.target.value)} className="w-full bg-indigo-50" />
                                    )} />
                                    <Column header="Description" body={(rowData, options) => (
                                        <InputText value={rowData.description} onChange={(e) => updateLineItem(options.rowIndex, 'description', e.target.value)} className="w-full bg-indigo-50" />
                                    )} />
                                    <Column header="Quantity" body={(rowData, options) => (
                                        <InputNumber value={rowData.quantity} onValueChange={(e) => updateLineItem(options.rowIndex, 'quantity', e.value)} mode="decimal" minFractionDigits={0} maxFractionDigits={0} className="w-full bg-indigo-50" />
                                    )} />
                                    <Column header="Price" body={(rowData, options) => (
                                        <InputNumber value={rowData.price} onValueChange={(e) => updateLineItem(options.rowIndex, 'price', e.value)} mode="currency" currency="IDR" locale="id-ID" className="w-full bg-indigo-50" />
                                        )} />
                                    <Column header="Amount" body={(rowData: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(rowData.amount)} />
                                    <Column body={(rowData, options) => (
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text"
                                                onClick={() => removeLineItem(options.rowIndex)}
                                                disabled={items.length === 1} />
                                    )} headerStyle={{ width: '3rem' }} />
                                </DataTable>

                                <Button label="Add Item" icon="pi pi-plus" onClick={addLineItem} className="p-button-outlined mt-2 bg-indigo-100 text-indigo-800" />

                                <Divider className="my-4" />

                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <div className="p-field">
                                            <label htmlFor="notes" className="font-bold text-indigo-800">Notes</label>
                                            <InputTextarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-indigo-50" placeholder="Any relevant information" />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <div className="p-field mb-2">
                                            <label className="font-bold text-indigo-800">Subtotal</label>
                                            <InputNumber value={subtotal} mode="currency" currency="IDR" locale="id-ID" readOnly className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field mb-2">
                                            <label className="font-bold text-indigo-800">Discount</label>
                                            <InputNumber value={discount} onValueChange={(e) => setDiscount(e.value || 0)} suffix="%" className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field mb-2">
                                            <label className="font-bold text-indigo-800">Tax</label>
                                            <InputNumber value={tax} onValueChange={(e) => setTax(e.value || 0)} suffix="%" className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field mb-2">
                                            <label className="font-bold text-indigo-800">Total</label>
                                            <InputNumber value={total} mode="currency" currency="IDR" locale="id-ID" readOnly className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field mb-2">
                                            <label className="font-bold text-indigo-800">Amount Paid</label>
                                            <InputNumber value={amountPaid} onValueChange={(e) => setAmountPaid(e.value || 0)} mode="currency" currency="IDR" locale="id-ID" className="w-full bg-indigo-50" />
                                        </div>
                                        <div className="p-field">
                                            <label className="font-bold text-indigo-800">Balance Due</label>
                                            <InputNumber value={balanceDue} mode="currency" currency="IDR" locale="id-ID" readOnly className="w-full bg-indigo-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider className="my-4" />

                        <Button label="Print Invoice" icon="pi pi-print" onClick={printInvoice} className="p-button-raised w-full bg-indigo-500 hover:bg-indigo-600" />
                    </>
                )}
            </Card>
        </div>
    );
};

export default InvoicePage;