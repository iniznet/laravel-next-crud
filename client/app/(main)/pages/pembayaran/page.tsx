'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { PembayaranAPI } from '@/apis/PembayaranApi';
import { NotaServiceAPI } from '@/apis/NotaServiceApi';
import { Pembayaran, NotaService, BarangService } from '@/types/notaservice';
import { formatCurrency } from '@/app/utils/currency';
import { classNames } from 'primereact/utils';
import { Skeleton } from 'primereact/skeleton';
import PembayaranInvoice from '@/app/components/invoices/PembayaranInvoice';

const PembayaranPage: React.FC = () => {
    const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
    const [notaServiceOptions, setNotaServiceOptions] = useState<NotaService[]>([]);
    const [pembayaranDialog, setPembayaranDialog] = useState(false);
    const [deletePembayaranDialog, setDeletePembayaranDialog] = useState(false);
    const [deletePembayaransDialog, setDeletePembayaransDialog] = useState(false);
    const [pembayaran, setPembayaran] = useState<Pembayaran>({
        FAKTUR: '',
        KODE: '',
        PEMILIK: '',
        TGLBAYAR: new Date().toISOString().split('T')[0],
        ESTIMASISELESAI: new Date().toISOString().split('T')[0],
        DP: 0,
        NOMINALBAYAR: 0,
        ESTIMASIHARGA: 0,
        HARGA: 0
    });
    const [selectedPembayarans, setSelectedPembayarans] = useState<Pembayaran[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [selectedNotaService, setSelectedNotaService] = useState<NotaService | null>(null);
    const [barangList, setBarangList] = useState<BarangService[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceNotaService, setInvoiceNotaService] = useState<NotaService | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pembayaranData, notaServiceData] = await Promise.all([PembayaranAPI.getAll(), PembayaranAPI.getServices()]);
                setPembayarans(pembayaranData || []);
                setNotaServiceOptions((notaServiceData as NotaService[]) || []);
                setDataLoaded(true);
            } catch (error) {
                handleError('Terjadi kesalahan saat memuat data pembayaran', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadPembayarans = async () => {
        try {
            const data = await PembayaranAPI.getAll();
            setPembayarans(data);
        } catch (error) {
            handleError('Terjadi kesalahan saat memuat data pembayaran', error);
        }
    };

    const handleError = (message: string, error: any) => {
        console.error(message, error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    };

    const openNew = async () => {
        try {
            const { FAKTUR } = await PembayaranAPI.getNewIdentifiers();
            setPembayaran({
                FAKTUR,
                KODE: '',
                PEMILIK: '',
                TGLBAYAR: new Date().toISOString().split('T')[0],
                ESTIMASISELESAI: new Date().toISOString().split('T')[0],
                DP: 0,
                NOMINALBAYAR: 0,
                ESTIMASIHARGA: 0,
                HARGA: 0
            });
            setSelectedNotaService(null);
            setBarangList([]);
            setSubmitted(false);
            setPembayaranDialog(true);
        } catch (error) {
            handleError('Terjadi kesalahan saat membuat data pembayaran baru', error);
        }
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPembayaranDialog(false);
    };

    const savePembayaran = async () => {
        setSubmitted(true);

        if (!pembayaran.FAKTUR.trim()) return;

        try {
            let savedPembayaran: Pembayaran;
            if (pembayaran.FAKTUR) {
                savedPembayaran = await PembayaranAPI.update(pembayaran.FAKTUR, pembayaran);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil memperbarui pembayaran', life: 3000 });
            } else {
                savedPembayaran = await PembayaranAPI.create(pembayaran);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan pembayaran', life: 3000 });
            }

            loadPembayarans();
            setPembayaranDialog(false);
            resetPembayaran();
            const notaService = await NotaServiceAPI.getOne(savedPembayaran.KODE);
            setInvoiceNotaService(notaService);
            setShowInvoice(true);
        } catch (error) {
            handleError('Terjadi kesalahan saat menyimpan pembayaran', error);
        }
    };

    const resetPembayaran = () => {
        setPembayaran({
            FAKTUR: '',
            KODE: '',
            PEMILIK: '',
            TGLBAYAR: new Date().toISOString().split('T')[0],
            ESTIMASISELESAI: new Date().toISOString().split('T')[0],
            DP: 0,
            NOMINALBAYAR: 0,
            ESTIMASIHARGA: 0,
            HARGA: 0
        });
    };

    const editPembayaran = async (pembayaran: Pembayaran) => {
        setPembayaran({ ...pembayaran });
        setPembayaranDialog(true);
        try {
            const notaServiceDetails = await PembayaranAPI.getOne(pembayaran.KODE);
            setBarangList(notaServiceDetails.barangList || []);
        } catch (error) {
            handleError('Terjadi kesalahan saat mengambil detail nota service', error);
        }
    };

    const confirmDeletePembayaran = (pembayaran: Pembayaran) => {
        setPembayaran(pembayaran);
        setDeletePembayaranDialog(true);
    };

    const deletePembayaran = async () => {
        try {
            await PembayaranAPI.delete(pembayaran.FAKTUR);
            loadPembayarans();
            setDeletePembayaranDialog(false);
            resetPembayaran();
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus pembayaran', life: 3000 });
        } catch (error) {
            handleError('Terjadi kesalahan saat menghapus pembayaran', error);
        }
    };

    const handleShowInvoice = async (rowData: Pembayaran) => {
        try {
            const notaServiceData = await NotaServiceAPI.getOne(rowData.KODE);
            setInvoiceNotaService(notaServiceData);
            setShowInvoice(true);
        } catch (error) {
            handleError('Terjadi kesalahan saat memuat data invoice', error);
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePembayaransDialog(true);
    };

    const deleteSelectedPembayarans = async () => {
        try {
            await PembayaranAPI.bulkDelete(selectedPembayarans.map((p) => p.FAKTUR));
            loadPembayarans();
            setDeletePembayaransDialog(false);
            setSelectedPembayarans([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus pembayaran yang dipilih', life: 3000 });
        } catch (error) {
            handleError('Terjadi kesalahan saat menghapus pembayaran yang dipilih', error);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Pembayaran) => {
        setPembayaran((prevState) => ({
            ...prevState,
            [name]: e.target.value
        }));
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: keyof Pembayaran) => {
        setPembayaran((prevState) => ({
            ...prevState,
            [name]: e.value || 0
        }));
    };

    const handleGlobalFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setGlobalFilter(value);
        }, 300);
    }, []);

    const pembayaranDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={savePembayaran} />
        </>
    );

    const deletePembayaranDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" className="p-button-text" onClick={() => setDeletePembayaranDialog(false)} />
            <Button label="Ya" icon="pi pi-check" className="p-button-text" onClick={deletePembayaran} />
        </>
    );

    const deletePembayaransDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" className="p-button-text" onClick={() => setDeletePembayaransDialog(false)} />
            <Button label="Ya" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPembayarans} />
        </>
    );

    const actionBodyTemplate = (rowData: Pembayaran) => (
        <div className="flex items-center">
            <Button icon="pi pi-eye" className="p-button-rounded p-button-text p-button-info mr-2" onClick={() => handleShowInvoice(rowData)} />
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning mr-2" onClick={() => editPembayaran(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeletePembayaran(rowData)} />
        </div>
    );

    const customFilter = (value: any, filter: string): boolean => {
        if (filter === undefined || filter === null || filter.trim() === '') {
            return true;
        }
    
        if (value === undefined || value === null) {
            return false;
        }
    
        return String(value).toLowerCase().includes(filter.toLowerCase());
    };

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <Toolbar
                className="mb-4"
                left={() => (
                    <div className="flex">
                        <Button label="Tambah" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                        <Button label="Hapus" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedPembayarans || !selectedPembayarans.length} />
                    </div>
                )}
                right={() => <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />}
            />
            {loading ? (
                <Skeleton width="100%" height="300px" />
            ) : (
                <DataTable
                    ref={dt}
                    value={pembayarans}
                    selection={selectedPembayarans}
                    onSelectionChange={(e) => setSelectedPembayarans(e.value)}
                    dataKey="FAKTUR"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Menampilkan {first} hingga {last} dari {totalRecords} pembayaran"
                    globalFilter={globalFilter}
                    emptyMessage="Tidak ada data pembayaran yang ditemukan"
                    filterLocale="en"
                    globalFilterFields={['FAKTUR', 'PEMILIK', 'TGLBAYAR', 'HARGA']}
                    filters={{}}
                    header={
                        <div className="table-header">
                            <h5 className="mx-0 my-1">Manajemen Pembayaran</h5>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText type="search" onInput={handleGlobalFilterChange} placeholder="Cari..." />
                            </span>
                        </div>
                    }
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="FAKTUR" header="Faktur" sortable style={{ minWidth: '12rem' }} />
                    <Column field="PEMILIK" header="Pemilik" sortable style={{ minWidth: '12rem' }} />
                    <Column field="TGLBAYAR" header="Tanggal Bayar" sortable style={{ minWidth: '12rem' }} />
                    <Column field="HARGA" header="Harga" body={(rowData) => formatCurrency(rowData.HARGA)} sortable style={{ minWidth: '10rem' }} />
                    <Column body={actionBodyTemplate} style={{ minWidth: '8rem' }} />
                </DataTable>
            )}
            <Dialog visible={pembayaranDialog} style={{ width: '450px' }} header="Detail Pembayaran" modal className="p-fluid" footer={pembayaranDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="FAKTUR">Faktur</label>
                    <InputText id="FAKTUR" value={pembayaran.FAKTUR} onChange={(e) => onInputChange(e, 'FAKTUR')} required autoFocus />
                    {submitted && !pembayaran.FAKTUR && <small className="p-error">Faktur wajib diisi.</small>}
                </div>
                <div className="field">
                    <label htmlFor="PEMILIK">Pemilik</label>
                    <InputText id="PEMILIK" value={pembayaran.PEMILIK} onChange={(e) => onInputChange(e, 'PEMILIK')} required />
                    {submitted && !pembayaran.PEMILIK && <small className="p-error">Pemilik wajib diisi.</small>}
                </div>
                <div className="field">
                    <label htmlFor="TGLBAYAR">Tanggal Bayar</label>
                    <Calendar id="TGLBAYAR" value={new Date(pembayaran.TGLBAYAR)} onChange={(e) => setPembayaran({ ...pembayaran, TGLBAYAR: e.value?.toString() || '' })} showIcon />
                </div>
                <div className="field">
                    <label htmlFor="HARGA">Harga</label>
                    <InputNumber id="HARGA" value={pembayaran.HARGA} onValueChange={(e) => onInputNumberChange(e, 'HARGA')} mode="currency" currency="IDR" locale="id-ID" />
                </div>
            </Dialog>

            <Dialog visible={deletePembayaranDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deletePembayaranDialogFooter} onHide={() => setDeletePembayaranDialog(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {pembayaran && (
                        <span>
                            Anda yakin ingin menghapus pembayaran <b>{pembayaran.FAKTUR}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deletePembayaransDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deletePembayaransDialogFooter} onHide={() => setDeletePembayaransDialog(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedPembayarans && selectedPembayarans.length > 0 && <span>Anda yakin ingin menghapus pembayaran yang dipilih?</span>}
                </div>
            </Dialog>

            {showInvoice && invoiceNotaService && <PembayaranInvoice notaService={invoiceNotaService} onClose={() => setShowInvoice(false)} visible={showInvoice} />}
        </div>
    );
};

export default PembayaranPage;
