'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { AutoComplete } from 'primereact/autocomplete';
import { InvoiceAPI } from '@/apis/InvoiceApi';
import { StockAPI } from '@/apis/StockApi';
import { ServiceAPI } from '@/apis/ServiceApi';
import { classNames } from 'primereact/utils';
import { Skeleton } from 'primereact/skeleton';
import { InputTextarea } from 'primereact/inputtextarea';
import TagihanInvoice from '@/app/components/invoices/TagihanInvoice';
import { InputSwitch } from 'primereact/inputswitch';
const InvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [invoiceDialog, setInvoiceDialog] = useState(false);
    const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState(false);
    const [deleteInvoicesDialog, setDeleteInvoicesDialog] = useState(false);
    const [invoice, setInvoice] = useState({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: null,
        from: '',
        phone_number: '',
        notes: '',
        queued: false,
        subtotal: 0,
        tax: 11,
        total: 0,
        amount_paid: 0,
        balance_due: 0,
        items: []
    });
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [stocks, setStocks] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [tagihanInvoice, setTagihanInvoice] = useState(null);
    const calculateInvoiceTotals = (invoice) => {
        const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
        const taxAmount = (subtotal * invoice.tax) / 100;
        const total = subtotal + taxAmount;
        const balanceDue = total - invoice.amount_paid;
        return {
            ...invoice,
            subtotal,
            total,
            balance_due: balanceDue
        };
    };
    const fetchInvoices = async () => {
        try {
            let data = await InvoiceAPI.getAll();
            data = data.map(invoice => calculateInvoiceTotals(invoice));
            setInvoices(data);
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data Tagihan', life: 3000 });
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const [stocksData, servicesData] = await Promise.all([
                StockAPI.getAll(),
                ServiceAPI.getAll()
            ]);
            setStocks(stocksData);
            setServices(servicesData);
            await fetchInvoices();
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data Sparepart dan Jasa', life: 3000 });
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const openNew = async () => {
        try {
            const { KODE } = await InvoiceAPI.getNewIdentifiers();
            setInvoice({
                invoice_number: KODE,
                invoice_date: new Date().toISOString().split('T')[0],
                due_date: null,
                from: '',
                phone_number: '',
                notes: '',
                queued: false,
                subtotal: 0,
                tax: 11,
                total: 0,
                amount_paid: 0,
                balance_due: 0,
                items: []
            });
            setSubmitted(false);
            setInvoiceDialog(true);
        }
        catch (error) {
            console.error('Error getting new identifiers:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat membuat tagihan baru', life: 3000 });
        }
    };
    const hideDialog = () => {
        setSubmitted(false);
        setInvoiceDialog(false);
    };
    const hideDeleteInvoiceDialog = () => {
        setDeleteInvoiceDialog(false);
    };
    const hideDeleteInvoicesDialog = () => {
        setDeleteInvoicesDialog(false);
    };
    const saveInvoice = async () => {
        setSubmitted(true);
        try {
            if (invoice.invoice_number.trim()) {
                let savedInvoice;
                if (invoice.id) {
                    savedInvoice = await InvoiceAPI.update(invoice.id, invoice);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil memperbarui tagihan', life: 3000 });
                }
                else {
                    savedInvoice = await InvoiceAPI.create(invoice);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil membuat tagihan', life: 3000 });
                }
                await fetchInvoices();
                setInvoiceDialog(false);
                setInvoice({
                    invoice_number: '',
                    invoice_date: new Date().toISOString().split('T')[0],
                    due_date: null,
                    from: '',
                    phone_number: '',
                    notes: '',
                    queued: false,
                    subtotal: 0,
                    tax: 11,
                    total: 0,
                    amount_paid: 0,
                    balance_due: 0,
                    items: []
                });
            }
        }
        catch (error) {
            console.error('Error saving invoice:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan tagihan', life: 3000 });
        }
    };
    const editInvoice = (invoice) => {
        setInvoice({ ...invoice });
        setInvoiceDialog(true);
    };
    const confirmDeleteInvoice = (invoice) => {
        setInvoice(invoice);
        setDeleteInvoiceDialog(true);
    };
    const deleteInvoice = async () => {
        try {
            await InvoiceAPI.delete(invoice.id);
            await fetchInvoices();
            setDeleteInvoiceDialog(false);
            setInvoice({
                invoice_number: '',
                invoice_date: new Date().toISOString().split('T')[0],
                due_date: null,
                from: '',
                phone_number: '',
                notes: '',
                queued: false,
                subtotal: 0,
                tax: 11,
                total: 0,
                amount_paid: 0,
                balance_due: 0,
                items: []
            });
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus tagihan', life: 3000 });
        }
        catch (error) {
            console.error('Error deleting invoice:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus tagihan', life: 3000 });
        }
    };
    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const confirmDeleteSelected = () => {
        setDeleteInvoicesDialog(true);
    };
    const deleteSelectedInvoices = async () => {
        try {
            await InvoiceAPI.bulkDelete(selectedInvoices.map(i => i.id));
            await fetchInvoices();
            setDeleteInvoicesDialog(false);
            setSelectedInvoices([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus tagihan yang dipilih', life: 3000 });
        }
        catch (error) {
            console.error('Error deleting invoices:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus tagihan yang dipilih', life: 3000 });
        }
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _invoice = { ...invoice };
        _invoice[name] = val;
        setInvoice(_invoice);
    };
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _invoice = { ...invoice, [name]: val };
        setInvoice(_invoice);
    };
    const onItemInputChange = (e, index, field) => {
        const updatedItems = invoice.items.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [field]: e.value };
                if (field === 'quantity' || field === 'price') {
                    updatedItem.amount = updatedItem.quantity * updatedItem.price;
                }
                return updatedItem;
            }
            return item;
        });
        setInvoice({
            ...invoice,
            items: updatedItems,
        });
    };
    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { description: '', quantity: 1, price: 0, amount: 0 }]
        });
    };
    const removeItem = (index) => {
        setInvoice({
            ...invoice,
            items: invoice.items.filter((_, i) => i !== index)
        });
    };
    const searchItems = (event) => {
        const query = event.query.toLowerCase();
        const allItems = [...stocks, ...services];
        const filtered = allItems.filter(item => {
            const stockName = item.NAMA?.toLowerCase();
            const serviceName = item.KETERANGAN?.toLowerCase();
            return stockName?.includes(query) || serviceName?.includes(query);
        }).map(item => {
            return {
                ...item,
                label: item.NAMA || item.KETERANGAN || 'N/A'
            };
        });
        setFilteredItems(filtered);
    };
    const onItemSelect = (e, index) => {
        const selectedItem = e.value;
        const updatedItems = invoice.items.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    description: selectedItem.NAMA || selectedItem.KETERANGAN,
                    price: selectedItem.HJ || selectedItem.ESTIMASIHARGA,
                    amount: (selectedItem.HJ || selectedItem.ESTIMASIHARGA) * item.quantity
                };
            }
            return item;
        });
        setInvoice({ ...invoice, items: updatedItems });
    };
    const handleShowInvoice = async (rowData) => {
        let invoice = await InvoiceAPI.getOne(rowData.id);
        invoice = calculateInvoiceTotals(invoice);
        setTagihanInvoice(invoice);
        setShowInvoice(true);
    };
    useEffect(() => {
        const updatedInvoice = calculateInvoiceTotals(invoice);
        setInvoice(updatedInvoice);
    }, [invoice.items, invoice.tax, invoice.amount_paid]);
    const leftToolbarTemplate = () => {
        return (<React.Fragment>
                <Button label="Tambah" icon="pi pi-plus" severity="success" onClick={openNew} className="mr-2"/>
                <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedInvoices || !selectedInvoices.length}/>
            </React.Fragment>);
    };
    const rightToolbarTemplate = () => {
        return (<React.Fragment>
                <Button label="Ekspor" icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>);
    };
    const actionBodyTemplate = (rowData) => {
        return (<React.Fragment>
                <Button icon="pi pi-print" rounded onClick={() => handleShowInvoice(rowData)} className="mr-2"/>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editInvoice(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteInvoice(rowData)}/>
            </React.Fragment>);
    };
    const header = (<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tagihan</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..."/>
            </span>
        </div>);
    const invoiceDialogFooter = (<React.Fragment>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Simpan" icon="pi pi-check" text onClick={saveInvoice}/>
        </React.Fragment>);
    const deleteInvoiceDialogFooter = (<React.Fragment>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteInvoiceDialog}/>
            <Button label="Ya" icon="pi pi-check" text onClick={deleteInvoice}/>
        </React.Fragment>);
    const deleteInvoicesDialogFooter = (<React.Fragment>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteInvoicesDialog}/>
            <Button label="Ya" icon="pi pi-check" text onClick={deleteSelectedInvoices}/>
        </React.Fragment>);
    return (<div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {loading ? (<DataTable value={Array.from({ length: 5 })} header={header}>
                            <Column style={{ width: '4rem' }} body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Invoice Number" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="From" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Invoice Date" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Due Date" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Items" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Total" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Actions" body={() => <Skeleton />}/>
                        </DataTable>) : (<DataTable ref={dt} value={invoices} selection={selectedInvoices} onSelectionChange={(e) => setSelectedInvoices(e.value)} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} tagihan" globalFilter={globalFilter} emptyMessage="Tidak ada tagihan yang ditemukan." header={header} responsiveLayout="scroll" selectionMode="multiple">
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="invoice_number" header="No Tagihan" sortable body={(rowData) => <span>{rowData.invoice_number}</span>}></Column>
                            <Column field="from" header="Kustomer" sortable body={(rowData) => <span>{rowData.from}</span>}></Column>
                            <Column field="invoice_date" header="Tanggal" sortable body={(rowData) => <span>{new Date(rowData.invoice_date).toLocaleDateString()}</span>}></Column>
                            <Column field="due_date" header="Estimasi Selesai" sortable body={(rowData) => <span>{rowData.due_date ? new Date(rowData.due_date).toLocaleDateString() : ''}</span>}></Column>
                            <Column header="Jumlah" body={(rowData) => rowData.items.length}></Column>
                            <Column field="total" header="Total" sortable body={(rowData) => <span>{rowData.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>)}

                    <Dialog visible={invoiceDialog} style={{ width: '70vw' }} header="Detail Tagihan" modal className="p-fluid" footer={invoiceDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="invoice_number">No Tagihan</label>
                                <InputText id="invoice_number" value={invoice.invoice_number} onChange={(e) => onInputChange(e, 'invoice_number')} required autoFocus className={classNames({ 'p-invalid': submitted && !invoice.invoice_number })}/>
                                {submitted && !invoice.invoice_number && <small className="p-error">No Tagihan wajib diisi.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="invoice_date">Tanggal</label>
                                <Calendar id="invoice_date" value={new Date(invoice.invoice_date)} onChange={(e) => onInputChange(e, 'invoice_date')} showIcon/>
                            </div>
                            <div className="field col">
                                <label htmlFor="due_date">Estimasi Selesai</label>
                                <Calendar id="due_date" value={invoice.due_date ? new Date(invoice.due_date) : null} onChange={(e) => onInputChange(e, 'due_date')} showIcon/>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="from">Kustomer</label>
                                <InputText id="from" value={invoice.from} onChange={(e) => onInputChange(e, 'from')} required className={classNames({ 'p-invalid': submitted && !invoice.from })}/>
                                {submitted && !invoice.from && <small className="p-error">From is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="phone_number">Nomor Telepon</label>
                                <InputText id="phone_number" value={invoice.phone_number} onChange={(e) => onInputChange(e, 'phone_number')} required/>
                            </div>
                        </div>

                        <h3>Items</h3>
                        {invoice.items.map((item, index) => (<div key={index} className="formgrid grid">
                                <div className="field col-5">
                                    <label htmlFor={`item-description-${index}`}>Deskripsi</label>
                                    <AutoComplete value={item.description} suggestions={filteredItems} completeMethod={searchItems} field="label" dropdown onChange={(e) => onItemInputChange(e, index, 'description')} onSelect={(e) => onItemSelect(e, index)}/>
                                </div>
                                <div className="field col-2">
                                    <label htmlFor={`item-quantity-${index}`}>Jumlah</label>
                                    <InputNumber type="number" id={`item-quantity-${index}`} value={item.quantity} onValueChange={(e) => onItemInputChange(e, index, 'quantity')}/>
                                </div>
                                <div className="field col-2">
                                    <label htmlFor={`item-price-${index}`}>Harga</label>
                                    <InputNumber id={`item-price-${index}`} value={item.price} mode="currency" currency="IDR" locale="id-ID" onValueChange={(e) => onItemInputChange(e, index, 'price')}/>
                                </div>
                                <div className="field col-2">
                                    <label htmlFor={`item-amount-${index}`}>Total</label>
                                    <InputNumber id={`item-amount-${index}`} value={item.amount} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                                </div>
                                <div className="field col-1 flex align-items-end">
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => removeItem(index)}/>
                                </div>
                            </div>))}
                        <Button label="Add Item" icon="pi pi-plus" onClick={addItem} className="mt-2"/>

                        <div className="formgrid grid mt-4">
                            <div className="field col-6">
                                <div className="mb-2">
                                    <label htmlFor="queued" className="block">Masukkan ke dalam Antrian</label>
                                    <InputSwitch id="queued" checked={invoice.queued} onChange={(e) => onInputChange(e, 'queued')}/>
                                </div>

                                <div>
                                    <label htmlFor="notes">Catatan</label>
                                    <InputTextarea id="notes" value={invoice.notes} onChange={(e) => onInputChange(e, 'notes')} autoResize rows={5}/>
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="formgrid grid">
                                    <div className="field col-12">
                                        <label htmlFor="subtotal">Subtotal</label>
                                        <InputNumber id="subtotal" value={invoice.subtotal} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                                    </div>
                                    <div className="field col-12">
                                        <label htmlFor="tax">Pajak (%)</label>
                                        <InputNumber id="tax" value={invoice.tax} onValueChange={(e) => onInputNumberChange(e, 'tax')} mode="decimal" minFractionDigits={2} maxFractionDigits={2} suffix="%"/>
                                    </div>
                                    <div className="field col-12">
                                        <label htmlFor="total">Total</label>
                                        <InputNumber id="total" value={invoice.total} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                                    </div>
                                    <div className="field col-12">
                                        <label htmlFor="amount_paid">Jumlah Dibayar</label>
                                        <InputNumber id="amount_paid" value={invoice.amount_paid} onValueChange={(e) => onInputNumberChange(e, 'amount_paid')} mode="currency" currency="IDR" locale="id-ID"/>
                                    </div>
                                    <div className="field col-12">
                                        <label htmlFor="balance_due">Sisa</label>
                                        <InputNumber id="balance_due" value={invoice.balance_due} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteInvoiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInvoiceDialogFooter} onHide={hideDeleteInvoiceDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
                            {invoice && <span>Apa kamu yakin ingin menghapus tagihan ini?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteInvoicesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInvoicesDialogFooter} onHide={hideDeleteInvoicesDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
                            {invoice && <span>Apa kamu yakin ingin menghapus tagihan yang dipilih?</span>}
                        </div>
                    </Dialog>

                    <TagihanInvoice invoice={tagihanInvoice} visible={showInvoice} onClose={() => setShowInvoice(false)}/>
                </div>
            </div>
        </div>);
};
export default InvoicePage;
