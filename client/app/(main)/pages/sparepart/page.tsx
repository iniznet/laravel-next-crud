'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { StockAPI } from '@/apis/StockApi';
import { Stock } from '@/types/stock';
import { formatCurrency } from '@/app/utils/currency';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';

const StockPage = () => {
    let emptyStock: Stock = {
        KODE: '',
        KODE_TOKO: '',
        NAMA: '',
        HB: 0,
        HJ: 0,
    };

    const [stocks, setStocks] = useState<Stock[]>([]);
    const [stockDialog, setStockDialog] = useState(false);
    const [deleteStockDialog, setDeleteStockDialog] = useState(false);
    const [deleteStocksDialog, setDeleteStocksDialog] = useState(false);
    const [stock, setStock] = useState<Stock>(emptyStock);
    const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingKode, setLoadingKode] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        setLoading(true);
        try {
            const data = await StockAPI.getAll();
            setStocks(data);
        } catch (error) {
            console.error('Error loading stocks:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data sparepart', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = async () => {
        setLoadingKode(true);
        try {
            const newKode = await StockAPI.getNewKode();
            setStock({ ...emptyStock, KODE: newKode });
        } catch (error) {
            console.error('Error fetching new KODE:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat mengambil kode baru', life: 3000 });
        } finally {
            setLoadingKode(false);
        }
        setSubmitted(false);
        setStockDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStockDialog(false);
    };

    const hideDeleteStockDialog = () => {
        setDeleteStockDialog(false);
    };

    const hideDeleteStocksDialog = () => {
        setDeleteStocksDialog(false);
    };

    const saveStock = async () => {
        setSubmitted(true);

        if (stock.KODE.trim()) {
            try {
                let response;
                if (stock.ID) {
                    response = await StockAPI.update(stock.ID.toString(), stock);
                } else {
                    response = await StockAPI.create(stock);
                }

                loadStocks();
                setStockDialog(false);
                setStock(emptyStock);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: `Berhasil ${stock.ID ? 'memperbarui' : 'menambahkan'} sparepart`, life: 3000 });
            } catch (error) {
                console.error('Error saving stock:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan sparepart', life: 3000 });
            }
        }
    };

    const editStock = (stock: Stock) => {
        setStock({ ...stock });
        setStockDialog(true);
    };

    const confirmDeleteStock = (stock: Stock) => {
        setStock(stock);
        setDeleteStockDialog(true);
    };

    const deleteStock = async () => {
        try {
            await StockAPI.delete(stock.ID!.toString());
            loadStocks();
            setDeleteStockDialog(false);
            setStock(emptyStock);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus sparepart', life: 3000 });
        } catch (error) {
            console.error('Error deleting stock:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus sparepart', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteStocksDialog(true);
    };

    const deleteSelectedStocks = async () => {
        try {
            await StockAPI.bulkDelete(selectedStocks.map(s => s.ID!.toString()));
            loadStocks();
            setDeleteStocksDialog(false);
            setSelectedStocks([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus sparepart yang dipilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting stocks:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus sparepart yang dipilih', life: 3000 });
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Stock) => {
        const val = (e.target && e.target.value) || '';
        let _stock = { ...stock, [name]: val };
        setStock(_stock);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: keyof Stock) => {
        const val = e.value ?? 0;
        let _stock = { ...stock, [name]: val };
        setStock(_stock);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Tambah" icon="pi pi-plus" severity="success" onClick={openNew} className="mr-2" />
                <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStocks || !selectedStocks.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Ekspor" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Stock) => {
        return (
            <>
                <span className="p-column-title">Kode</span>
                {rowData.KODE}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Stock) => {
        return (
            <>
                <span className="p-column-title">Nama</span>
                {rowData.NAMA}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Stock) => {
        return (
            <>
                <span className="p-column-title">Harga</span>
                {formatCurrency(rowData.HJ)}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Stock) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editStock(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteStock(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Master Sparepart</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const stockDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveStock} />
        </>
    );

    const deleteStockDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteStockDialog} />
            <Button label="Ya" icon="pi pi-check" text onClick={deleteStock} />
        </>
    );

    const deleteStocksDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteStocksDialog} />
            <Button label="Ya" icon="pi pi-check" text onClick={deleteSelectedStocks} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {loading ? (
                        <DataTable
                            value={Array.from({ length: 5 }) as DataTableValueArray}
                            header={header}
                        >
                            <Column style={{ width: '4rem' }} body={() => <Skeleton />} />
                            <Column style={{ width: '10rem' }} header="Kode" body={() => <Skeleton />} />
                            <Column header="Nama" body={() => <Skeleton />} />
                            <Column header="Harga" body={() => <Skeleton />} />
                            <Column body={() => <Skeleton />} />
                        </DataTable>
                    ) : (

                        <DataTable
                            ref={dt}
                            value={stocks}
                            selection={selectedStocks}
                            onSelectionChange={(e) => setSelectedStocks(e.value)}
                            dataKey="ID"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} spareparts"
                            globalFilter={globalFilter}
                            emptyMessage="Sparepart tidak ditemukan."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="KODE" header="Kode" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="NAMA" header="Nama" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="HB" header="Modal" body={priceBodyTemplate} sortable></Column>
                            <Column field="HJ" header="Harga" body={priceBodyTemplate} sortable></Column>
                            <Column body={actionBodyTemplate}></Column>
                        </DataTable>

                    )}

                    <Dialog visible={stockDialog} style={{ width: '450px' }} header="Detail Sparepart" modal className="p-fluid" footer={stockDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="KODE">Kode</label>
                            <InputText id="KODE" value={stock.KODE} onChange={(e) => onInputChange(e, 'KODE')} required autoFocus className={classNames({ 'p-invalid': submitted && !stock.KODE })} />
                            {submitted && !stock.KODE && <small className="p-error">Kode wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="KODE_TOKO">Kode Toko</label>
                            <InputText id="KODE_TOKO" value={stock.KODE_TOKO} onChange={(e) => onInputChange(e, 'KODE_TOKO')} />
                        </div>
                        <div className="field">
                            <label htmlFor="NAMA">Nama</label>
                            <InputText id="NAMA" value={stock.NAMA} onChange={(e) => onInputChange(e, 'NAMA')} required className={classNames({ 'p-invalid': submitted && !stock.NAMA })} />
                            {submitted && !stock.NAMA && <small className="p-invalid">Nama wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="HB">Modal</label>
                            <InputNumber id="HB" value={stock.HB} onValueChange={(e) => onInputNumberChange(e, 'HB')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="HJ">Harga</label>
                            <InputNumber id="HJ" value={stock.HJ} onValueChange={(e) => onInputNumberChange(e, 'HJ')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStockDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStockDialogFooter} onHide={hideDeleteStockDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {stock && (
                                <span>
                                    Apakah Anda yakin ingin menghapus sparepart <b>{stock.NAMA}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStocksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStocksDialogFooter} onHide={hideDeleteStocksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {stock && <span>Apakah Anda yakin ingin menghapus sparepart yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default StockPage;