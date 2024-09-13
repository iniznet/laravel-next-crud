'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { PembayaranAPI } from '@/apis/PembayaranApi';
import { NotaServiceAPI } from '@/apis/NotaServiceApi';
import { formatCurrency } from '@/app/utils/currency';
import { classNames } from 'primereact/utils';
import { Skeleton } from 'primereact/skeleton';
import PembayaranInvoice from '@/app/components/invoices/PembayaranInvoice';
const PembayaranPage = () => {
    const [pembayarans, setPembayarans] = useState([]);
    const [pembayaranDialog, setPembayaranDialog] = useState(false);
    const [deletePembayaranDialog, setDeletePembayaranDialog] = useState(false);
    const [deletePembayaransDialog, setDeletePembayaransDialog] = useState(false);
    const [pembayaran, setPembayaran] = useState({
        FAKTUR: '',
        KODE: '',
        PEMILIK: '',
        TGLBAYAR: new Date().toISOString().split('T')[0],
        ESTIMASISELESAI: new Date().toISOString().split('T')[0],
        DP: 0,
        NOMINALBAYAR: 0,
        ESTIMASIHARGA: 0,
        HARGA: 0,
    });
    const [selectedPembayarans, setSelectedPembayarans] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [notaServiceOptions, setNotaServiceOptions] = useState([]);
    const [selectedNotaService, setSelectedNotaService] = useState(null);
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceNotaService, setInvoiceNotaService] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pembayaranData, notaServiceData] = await Promise.all([
                    PembayaranAPI.getAll(),
                    PembayaranAPI.getServices()
                ]);
                setPembayarans(pembayaranData);
                setNotaServiceOptions(notaServiceData);
                setDataLoaded(true);
            }
            catch (error) {
                console.error('Error loading data:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data pembayaran', life: 3000 });
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const loadPembayarans = async () => {
        try {
            const data = await PembayaranAPI.getAll();
            setPembayarans(data);
        }
        catch (error) {
            console.error('Error loading pembayarans:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data pembayaran', life: 3000 });
        }
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
                HARGA: 0,
            });
            setSelectedNotaService(null);
            setBarangList([]);
            setSubmitted(false);
            setPembayaranDialog(true);
        }
        catch (error) {
            console.error('Error getting new identifiers:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat membuat data pembayaran baru', life: 3000 });
        }
    };
    const hideDialog = () => {
        setSubmitted(false);
        setPembayaranDialog(false);
    };
    const hideDeletePembayaranDialog = () => {
        setDeletePembayaranDialog(false);
    };
    const hideDeletePembayaransDialog = () => {
        setDeletePembayaransDialog(false);
    };
    const savePembayaran = async () => {
        setSubmitted(true);
        try {
            if (pembayaran.FAKTUR.trim()) {
                let savedPembayaran;
                if (pembayaran.FAKTUR) {
                    savedPembayaran = await PembayaranAPI.update(pembayaran.FAKTUR, pembayaran);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil memperbarui pembayaran', life: 3000 });
                }
                else {
                    savedPembayaran = await PembayaranAPI.create(pembayaran);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan pembayaran', life: 3000 });
                }
                loadPembayarans();
                setPembayaranDialog(false);
                setPembayaran({
                    FAKTUR: '',
                    KODE: '',
                    PEMILIK: '',
                    TGLBAYAR: new Date().toISOString().split('T')[0],
                    ESTIMASISELESAI: new Date().toISOString().split('T')[0],
                    DP: 0,
                    NOMINALBAYAR: 0,
                    ESTIMASIHARGA: 0,
                    HARGA: 0,
                });
                const notaService = await NotaServiceAPI.getOne(savedPembayaran.KODE);
                setInvoiceNotaService(notaService);
                setShowInvoice(true);
            }
        }
        catch (error) {
            console.error('Error saving pembayaran:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan pembayaran', life: 3000 });
        }
    };
    const editPembayaran = async (pembayaran) => {
        setPembayaran({ ...pembayaran });
        setPembayaranDialog(true);
        const notaServiceDetails = await PembayaranAPI.getOne(pembayaran.KODE);
        setBarangList(notaServiceDetails.barangList || []);
    };
    const confirmDeletePembayaran = (pembayaran) => {
        setPembayaran(pembayaran);
        setDeletePembayaranDialog(true);
    };
    const deletePembayaran = async () => {
        try {
            await PembayaranAPI.delete(pembayaran.FAKTUR);
            loadPembayarans();
            setDeletePembayaranDialog(false);
            setPembayaran({
                FAKTUR: '',
                KODE: '',
                PEMILIK: '',
                TGLBAYAR: new Date().toISOString().split('T')[0],
                ESTIMASISELESAI: new Date().toISOString().split('T')[0],
                DP: 0,
                NOMINALBAYAR: 0,
                ESTIMASIHARGA: 0,
                HARGA: 0,
            });
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus pembayaran', life: 3000 });
        }
        catch (error) {
            console.error('Error deleting pembayaran:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus pembayaran', life: 3000 });
        }
    };
    const handleShowInvoice = async (rowData) => {
        const notaServiceData = await NotaServiceAPI.getOne(rowData.KODE);
        setInvoiceNotaService(notaServiceData);
        setShowInvoice(true);
    };
    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const confirmDeleteSelected = () => {
        setDeletePembayaransDialog(true);
    };
    const deleteSelectedPembayarans = async () => {
        try {
            await PembayaranAPI.bulkDelete(selectedPembayarans.map(p => p.FAKTUR));
            loadPembayarans();
            setDeletePembayaransDialog(false);
            setSelectedPembayarans([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus pembayaran yang dipilih', life: 3000 });
        }
        catch (error) {
            console.error('Error deleting pembayarans:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus pembayaran yang dipilih', life: 3000 });
        }
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _pembayaran = { ...pembayaran };
        _pembayaran[name] = val;
        setPembayaran(_pembayaran);
    };
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _pembayaran = { ...pembayaran };
        _pembayaran[name] = val;
        setPembayaran(_pembayaran);
    };
    const onNotaServiceChange = async (e) => {
        setSelectedNotaService(e.value);
        try {
            const notaServiceDetails = await PembayaranAPI.getOne(e.value.KODE);
            setPembayaran({
                ...pembayaran,
                KODE: e.value.KODE,
                PEMILIK: notaServiceDetails.PEMILIK,
                ESTIMASIHARGA: notaServiceDetails.ESTIMASIHARGA,
                HARGA: notaServiceDetails.ESTIMASIHARGA,
                DP: notaServiceDetails.DP
            });
            setBarangList(notaServiceDetails.barangList || []);
        }
        catch (error) {
            console.error('Error fetching nota service details:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat mengambil detail nota service', life: 3000 });
        }
    };
    const calculateSisa = () => {
        return (pembayaran.HARGA > pembayaran.ESTIMASIHARGA)
            ? pembayaran.HARGA : pembayaran.ESTIMASIHARGA
            - (pembayaran.DP + pembayaran.NOMINALBAYAR);
    };
    const calculateLunas = () => {
        return calculateSisa() <= 0;
    };
    const leftToolbarTemplate = () => {
        return (<React.Fragment>
                <Button label="Tambah" icon="pi pi-plus" severity="success" onClick={openNew} className="mr-2"/>
                <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPembayarans || !selectedPembayarans.length}/>
            </React.Fragment>);
    };
    const rightToolbarTemplate = () => {
        return (<React.Fragment>
                <Button label="Ekspor" icon="pi pi-u</DataTable>pload" severity="help" onClick={exportCSV}/>
            </React.Fragment>);
    };
    const actionBodyTemplate = (rowData) => {
        return (<React.Fragment>
                <Button icon="pi pi-print" rounded onClick={() => handleShowInvoice(rowData)} className="mr-2"/>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPembayaran(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePembayaran(rowData)}/>
            </React.Fragment>);
    };
    const header = (<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Pembayaran</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..."/>
            </span>
        </div>);
    const pembayaranDialogFooter = (<React.Fragment>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Simpan" icon="pi pi-check" text onClick={savePembayaran}/>
        </React.Fragment>);
    const deletePembayaranDialogFooter = (<React.Fragment>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeletePembayaranDialog}/>
            <Button label="Ya" icon="pi pi-check" text onClick={deletePembayaran}/>
        </React.Fragment>);
    const deletePembayaransDialogFooter = (<React.Fragment>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeletePembayaransDialog}/>
            <Button label="Ya" icon="pi pi-check" text onClick={deleteSelectedPembayarans}/>
        </React.Fragment>);
    return (<div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    {loading
            ?
                (<DataTable value={Array.from({ length: 5 })} header={header}>
                                    <Column style={{ width: '4rem' }} body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} header="Faktur" body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} header="No Servis" body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} header="Pemilik" body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} header="Tanggal Bayar" body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} header="Total Harga" body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} header="Status" body={() => <Skeleton />}/>
                                    <Column style={{ width: '10rem' }} body={() => <Skeleton />}/>
                                </DataTable>)
            :
                (<DataTable ref={dt} value={pembayarans} selection={selectedPembayarans} onSelectionChange={(e) => setSelectedPembayarans(e.value)} dataKey="FAKTUR" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} pembayaran" globalFilter={globalFilter} emptyMessage="Tidak ada data pembayaran yang ditemukan." header={header} responsiveLayout="scroll">
                                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                    <Column field="FAKTUR" header="Faktur" sortable body={(rowData) => <span>{rowData.FAKTUR}</span>}></Column>
                                    <Column field="KODE" header="No Servis" sortable body={(rowData) => <span>{rowData.KODE}</span>}></Column>
                                    <Column field="PEMILIK" header="Pemilik" sortable body={(rowData) => <span>{rowData.PEMILIK}</span>}></Column>
                                    <Column field="TGLBAYAR" header="Tanggal Bayar" sortable body={(rowData) => <span>{new Date(rowData.TGLBAYAR).toLocaleDateString()}</span>}></Column>
                                    <Column field="HARGA" header="Total Harga" sortable body={(rowData) => <span>{formatCurrency(rowData.HARGA)}</span>}></Column>
                                    <Column header="Status" body={(rowData) => <span>{calculateLunas() ? 'Lunas' : 'Belum Lunas'}</span>}></Column>
                                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                </DataTable>)}

                    <Dialog visible={pembayaranDialog} style={{ maxWidth: '800px' }} header="Detail Pembayaran" modal className="p-fluid" footer={pembayaranDialogFooter} onHide={hideDialog}>
                        <div className="flex flex-wrap gap-4">
                            <div className="field">
                                <label htmlFor="faktur">Faktur</label>
                                <InputText id="faktur" value={pembayaran.FAKTUR} readOnly/>
                            </div>
                            <div className="field">
                                <label htmlFor="kode">Kode</label>
                                <Dropdown id="kode" value={selectedNotaService} options={notaServiceOptions} onChange={onNotaServiceChange} optionLabel="KODE" placeholder="Select a Kode" className={classNames({ 'p-invalid': submitted && !pembayaran.KODE })} required/>
                                {submitted && !pembayaran.KODE && <small className="p-error">Kode wajib diisi.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="pemilik">Pemilik</label>
                                <InputText id="pemilik" value={pembayaran.PEMILIK} readOnly/>
                            </div>
                            <div className="field">
                                <label htmlFor="tglbayar">Tanggal Bayar</label>
                                <Calendar id="tglbayar" value={new Date(pembayaran.TGLBAYAR)} onChange={(e) => onInputChange(e, 'TGLBAYAR')} showIcon/>
                            </div>

                            <div className="field flex-1">
                                <DataTable value={barangList} responsiveLayout="scroll">
                                    <Column field="KODE" header="No Barang"/>
                                    <Column field="NAMA" header="Nama Barang"/>
                                    <Column field="QTY" header="Quantity"/>
                                    <Column field="HARGA" header="HARGA" body={(rowData) => <span>{formatCurrency(rowData.HARGA)}</span>}></Column>
                                </DataTable>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="field flex-1">
                                <label htmlFor="harga">Total Harga</label>
                                <InputNumber id="harga" value={pembayaran.ESTIMASIHARGA} onValueChange={(e) => onInputNumberChange(e, 'ESTIMASIHARGA')} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                            </div>
                            <div className="field flex-1">
                                <label htmlFor="dp">DP</label>
                                <InputNumber id="dp" value={pembayaran.DP} onValueChange={(e) => onInputNumberChange(e, 'DP')} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                            </div>
                            <div className="field flex-1">
                                <label htmlFor="nominalbayar">Nominal Bayar</label>
                                <InputNumber id="nominalbayar" value={pembayaran.NOMINALBAYAR} onValueChange={(e) => onInputNumberChange(e, 'NOMINALBAYAR')} mode="currency" currency="IDR" locale="id-ID"/>
                            </div>
                            <div className="field flex-1">
                                <label htmlFor="sisa">Sisa</label>
                                <InputNumber id="sisa" value={calculateSisa()} mode="currency" currency="IDR" locale="id-ID" readOnly/>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deletePembayaranDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePembayaranDialogFooter} onHide={hideDeletePembayaranDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
                            {pembayaran && <span>Apa kamu yakin ingin menghapus pembayaran ini?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePembayaransDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePembayaransDialogFooter} onHide={hideDeletePembayaransDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
                            {pembayaran && <span>Apa kamu yakin ingin menghapus pembayaran yang dipilih?</span>}
                        </div>
                    </Dialog>

                    <PembayaranInvoice notaService={invoiceNotaService} visible={showInvoice} onClose={() => setShowInvoice(false)}/>
                </div>
            </div>
        </div>);
};
export default PembayaranPage;
