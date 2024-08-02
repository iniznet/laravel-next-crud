'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import Api from '@/apis/Api';
import { ServiceAPI } from '@/apis/ServiceApi';
import { formatCurrency } from '@/app/utils/currency';
import { BarangService, BarangWithServices, NotaService } from '@/types/notaservice';
import { Service } from '@/types/service';
import { NotaServiceAPI } from '@/apis/NotaServiceApi';
import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import PilihJasaBarang from '@/app/components/PilihJasaBarang';
import { InputNumber } from 'primereact/inputnumber';
import { FieldErrors } from '@/types/message';

const NotaServicePage: React.FC = () => {
    const [notaServices, setNotaServices] = useState<NotaService[]>([]);
    const [nota, setNota] = useState<NotaService>({
        STATUS: 0,
        FAKTUR: '',
        KODE: 'Loading...',
        TGL: new Date().toISOString().split('T')[0],
        TGLBAYAR: new Date().toISOString().split('T')[0],
        PEMILIK: '',
        NOTELEPON: '',
        ESTIMASISELESAI: new Date().toISOString().split('T')[0],
        ESTIMASIHARGA: 0,
        HARGA: 0,
        NOMINALBAYAR: 0,
        DP: 0,
        PENERIMA: '',
    });
    const [services, setServices] = useState<Service[]>([]);
    const [barangList, setBarangList] = useState<BarangWithServices[]>([
        { KODE: '1', NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian', services: [], ESTIMASIHARGA: 0 }
    ]);
    const [notaServiceDialog, setNotaServiceDialog] = useState(false);
    const [deleteNotaServiceDialog, setDeleteNotaServiceDialog] = useState(false);
    const [deleteNotaServicesDialog, setDeleteNotaServicesDialog] = useState(false);
    const [selectedNotaServices, setSelectedNotaServices] = useState<NotaService[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [isNewRecord, setIsNewRecord] = useState(true);
    const [errors, setErrors] = useState<FieldErrors>({});

    useEffect(() => {
        fetchServices();
        loadNotaServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await ServiceAPI.getAll();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch services', life: 3000 });
        }
    };

    const loadNotaServices = async () => {
        setLoading(true);

        try {
            const data = await NotaServiceAPI.getAll();
            setNotaServices(data);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error loading nota services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load nota services', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: { target: { name: string; value: string | number } }) => {
        const { name, value } = e.target;
        setNota(prev => ({ ...prev, [name]: value }));
    };

    const openNew = async () => {
        try {
            const { KODE } = await NotaServiceAPI.getNewIdentifiers();
            setNota({
                STATUS: 0,
                FAKTUR: '',
                KODE,
                TGL: new Date().toISOString().split('T')[0],
                TGLBAYAR: new Date().toISOString().split('T')[0],
                PEMILIK: '',
                NOTELEPON: '',
                ESTIMASISELESAI: new Date().toISOString().split('T')[0],
                ESTIMASIHARGA: 0,
                HARGA: 0,
                NOMINALBAYAR: 0,
                DP: 0,
                PENERIMA: '',
            });
            setBarangList([{
                KODE: '1', NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian',
                services: [],
                ESTIMASIHARGA: 0,
            }]);
            setIsNewRecord(true);
            setNotaServiceDialog(true);
        } catch (error) {
            console.error('Error getting new identifiers:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to get new identifiers', life: 3000 });
        }
    };

    const hideDialog = () => {
        setNotaServiceDialog(false);
    };

    const hideDeleteNotaServiceDialog = () => {
        setDeleteNotaServiceDialog(false);
    };

    const hideDeleteNotaServicesDialog = () => {
        setDeleteNotaServicesDialog(false);
    };

    const getErrorMessage = (field: string): string => {
        return errors[field] ? errors[field][0] : '';
    };

    const saveNotaService = async () => {
        try {
            setErrors({});
            const dataToSave = {
                ...nota,
                barangList
            };

            if (isNewRecord) {
                await NotaServiceAPI.create(dataToSave);
            } else {
                await NotaServiceAPI.update(nota.KODE, dataToSave);
            }

            loadNotaServices();
            setNotaServiceDialog(false);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Nota Service ${isNewRecord ? 'Created' : 'Updated'} successfully`, life: 3000 });
        } catch (error: any) {
            console.error('Error saving Nota Service:', error);
            if (error.errors) {
                setErrors(error.errors);
                toast.current?.show({ severity: 'error', summary: 'Validation Error', detail: error.message, life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save Nota Service', life: 3000 });
            }
        }
    };

    const editNotaService = (notaService: NotaService) => {
        setNota({ ...notaService });

        // calculate estimated price for each barang
        const updatedBarangList = notaService.barangList?.map(barang => {
            const newEstimatedPrice = barang.services.reduce((sum, service) => sum + service.HARGA, 0);
            return { ...barang, ESTIMASIHARGA: newEstimatedPrice };
        });
        setBarangList(updatedBarangList || []);
        setNotaServiceDialog(true);
        setIsNewRecord(false);
    };

    const confirmDeleteNotaService = (notaService: NotaService) => {
        setNota(notaService);
        setDeleteNotaServiceDialog(true);
    };

    const deleteNotaService = async () => {
        try {
            await NotaServiceAPI.delete(nota.KODE);
            loadNotaServices();
            setDeleteNotaServiceDialog(false);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Nota Service Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting nota service:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete nota service', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteNotaServicesDialog(true);
    };

    const deleteSelectedNotaServices = async () => {
        try {
            await NotaServiceAPI.bulkDelete(selectedNotaServices.map(ns => ns.KODE));
            loadNotaServices();
            setDeleteNotaServicesDialog(false);
            setSelectedNotaServices([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Nota Services Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting nota services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete nota services', life: 3000 });
        }
    };

    const updateTotalEstimasi = useCallback(() => {
        const total = barangList.reduce((sum, barang) => {
            const barangTotal = barang.services.reduce((serviceSum, service) => serviceSum + service.HARGA, 0);
            return sum + barangTotal;
        }, 0);
        setNota(prev => ({ ...prev, ESTIMASIHARGA: total }));
    }, [barangList]);

    useEffect(() => {
        updateTotalEstimasi();
    }, [barangList, updateTotalEstimasi]);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedNotaServices || !selectedNotaServices.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: NotaService) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editNotaService(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteNotaService(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Nota Services</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            {loading
                ?
                (
                    <DataTable
                        value={Array.from({ length: 5 }) as DataTableValueArray}
                        header={header}
                    >
                        <Column style={{ width: '4rem' }} body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} header="No. Servis" body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} header="Tanggal" body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} header="Estimasi Selesai" body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} header="Pemilik" body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} header="No Telepon" body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} header="Estimasi Harga" body={() => <Skeleton />} />
                        <Column style={{ width: '10rem' }} body={() => <Skeleton />} />
                    </DataTable>
                )
                :
                (

                    <DataTable
                        ref={dt}
                        value={notaServices}
                        selection={selectedNotaServices}
                        onSelectionChange={(e) => setSelectedNotaServices(e.value)}
                        dataKey="KODE"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} nota services"
                        globalFilter={globalFilter}
                        emptyMessage="No nota services found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="KODE" header="No. Servis" sortable></Column>
                        <Column field="TGL" header="Tanggal" sortable body={(rowData) => <span>{new Date(rowData.TGL).toLocaleDateString()}</span>}></Column>
                        <Column field="ESTIMASISELESAI" header="Estimasi Selesai" sortable body={(rowData) => <span>{new Date(rowData.ESTIMASISELESAI).toLocaleDateString()}</span>}></Column>
                        <Column field="PEMILIK" header="Pemilik" sortable></Column>
                        <Column field="NOTELEPON" header="No Telepon" sortable></Column>
                        <Column field="ESTIMASIHARGA" header="Estimasi Harga" sortable body={(rowData) => formatCurrency(rowData.ESTIMASIHARGA)}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                )}

            <Dialog visible={notaServiceDialog} style={{ width: '70%' }} header="Nota Service Details" modal className="p-fluid" footer={<div className="flex justify-content-end"><Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} /><Button label="Save" icon="pi pi-check" text onClick={saveNotaService} /></div>} onHide={hideDialog}>
                <TabView>
                    <TabPanel header="Data Klien">
                        <div className="p-fluid">
                            <div className="field">
                                <label htmlFor="noServis">No. Servis</label>
                                <InputText id="noServis" name="KODE" value={nota.KODE} onChange={handleInputChange} className={errors.KODE ? 'p-invalid' : ''} />
                                {getErrorMessage('KODE') && <small className="p-error">{getErrorMessage('KODE')}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="pemilik">Pemilik</label>
                                <InputText id="pemilik" name="PEMILIK" value={nota.PEMILIK} onChange={handleInputChange} className={errors.PEMILIK ? 'p-invalid' : ''} />
                                {getErrorMessage('PEMILIK') && <small className="p-error">{getErrorMessage('PEMILIK')}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="noTelp">No. Telp</label>
                                <InputText id="noTelp" name="NOTELEPON" value={nota.NOTELEPON} onChange={handleInputChange} className={errors.NOTELEPON ? 'p-invalid' : ''} />
                                {getErrorMessage('NOTELEPON') && <small className="p-error">{getErrorMessage('NOTELEPON')}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="tanggal">Tanggal</label>
                                <Calendar id="tanggal" name="TGL" value={new Date(nota.TGL)} onChange={(e) => setNota(prev => ({ ...prev, TGL: e.value ? e.value.toISOString().split('T')[0] : '' }))} showIcon />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Pilih Jasa dan Barang">
                        <PilihJasaBarang
                            barangList={barangList}
                            setBarangList={setBarangList}
                            services={services}
                            errors={errors}
                        />
                    </TabPanel>
                    <TabPanel header="Ringkasan">
                        <div className="p-fluid">
                            <div className="field">
                                <label htmlFor="estimasiHarga">Estimasi Harga</label>
                                <InputText id="estimasiHarga" value={formatCurrency(nota.ESTIMASIHARGA)} readOnly />
                            </div>
                            <div className="field">
                                <label htmlFor="estimasiSelesai">Estimasi Selesai</label>
                                <Calendar id="estimasiSelesai" name="ESTIMASISELESAI" value={new Date(nota.ESTIMASISELESAI)} onChange={(e) => setNota(prev => ({ ...prev, ESTIMASISELESAI: e.value ? e.value.toISOString().split('T')[0] : '' }))} showIcon />
                            </div>
                            <div className="field">
                                <label htmlFor="dp">DP</label>
                                <InputNumber id="dp" name="DP" value={nota.DP} onValueChange={(e) => handleInputChange({ target: { name: 'DP', value: e.value || 0 } })} mode="currency" currency="IDR" locale="id-ID" />
                            </div>
                            <div className="field">
                                <label htmlFor="penerima">Penerima</label>
                                <InputText id="penerima" name="PENERIMA" value={nota.PENERIMA} onChange={handleInputChange} />
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </Dialog>

            <Dialog visible={deleteNotaServiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={<div className="flex justify-content-end"><Button label="No" icon="pi pi-times" text onClick={hideDeleteNotaServiceDialog} /><Button label="Yes" icon="pi pi-check" text onClick={deleteNotaService} /></div>} onHide={hideDeleteNotaServiceDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {nota && (
                        <span>
                            Are you sure you want to delete <b>{nota.KODE}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteNotaServicesDialog} style={{ width: '450px' }} header="Confirm" modal footer={<div className="flex justify-content-end"><Button label="No" icon="pi pi-times" text onClick={hideDeleteNotaServicesDialog} /><Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedNotaServices} /></div>} onHide={hideDeleteNotaServicesDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {nota && <span>Are you sure you want to delete the selected nota services?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default NotaServicePage;