'use client';

import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import Api from '@/apis/Api';
import { ServiceAPI } from '@/apis/ServiceApi';
import { formatCurrency } from '@/app/utils/currency';
import { BarangService, NotaService } from '@/types/notaservice';
import { Service } from '@/types/service';
import { NotaServiceAPI } from '@/apis/NotaServiceApi';
import React from 'react';

const NotaServicePage: React.FC = () => {
    const [notaServices, setNotaServices] = useState<NotaService[]>([]);
    const [nota, setNota] = useState<NotaService>({
        STATUS: 0,
        FAKTUR: 'Loading...',
        KODE: '',
        TGL: new Date().toISOString().split('T')[0],
        PEMILIK: '',
        NOTELEPON: '',
        ESTIMASISELESAI: new Date().toISOString().split('T')[0],
        ESTIMASIHARGA: 0,
        DP: 0,
        PENERIMA: '',
    });
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([{ KODE: '', KETERANGAN: '', ESTIMASIHARGA: 0 }]);
    const [barangList, setBarangList] = useState<BarangService[]>([{ KODE: '1', NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian' }]);
    const [notaServiceDialog, setNotaServiceDialog] = useState(false);
    const [deleteNotaServiceDialog, setDeleteNotaServiceDialog] = useState(false);
    const [deleteNotaServicesDialog, setDeleteNotaServicesDialog] = useState(false);
    const [selectedNotaServices, setSelectedNotaServices] = useState<NotaService[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [isNewRecord, setIsNewRecord] = useState(true);

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
        try {
            const data = await NotaServiceAPI.getAll();
            setNotaServices(data);
        } catch (error) {
            console.error('Error loading nota services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load nota services', life: 3000 });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNota(prev => ({ ...prev, [name]: value }));
    };

    const openNew = async () => {
        try {
            const { FAKTUR, KODE } = await NotaServiceAPI.getNewIdentifiers();
            setNota({
                STATUS: 0,
                FAKTUR,
                KODE,
                TGL: new Date().toISOString().split('T')[0],
                PEMILIK: '',
                NOTELEPON: '',
                ESTIMASISELESAI: new Date().toISOString().split('T')[0],
                ESTIMASIHARGA: 0,
                DP: 0,
                PENERIMA: '',
            });
            setSelectedServices([{ KODE: '', KETERANGAN: '', ESTIMASIHARGA: 0 }]);
            setBarangList([{ KODE: '1', NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian' }]);
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

    const saveNotaService = async () => {
        try {
            const dataToSave = {
                ...nota,
                selectedServices,
                barangList
            };

            if (isNewRecord) {
                await NotaServiceAPI.create(dataToSave);
            } else {
                await NotaServiceAPI.update(nota.FAKTUR, dataToSave);
            }

            loadNotaServices();
            setNotaServiceDialog(false);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Nota Service ${isNewRecord ? 'Created' : 'Updated'} successfully`, life: 3000 });
        } catch (error) {
            console.error('Error saving Nota Service:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save Nota Service', life: 3000 });
        }
    };


    // const editNotaService = async (notaService: NotaService) => {
    //     try {
    //         const fullNotaService = await NotaServiceAPI.getOne(notaService.FAKTUR);
    //         setNota(fullNotaService);
    //         setSelectedServices(fullNotaService.selectedServices || [{ KODE: '', KETERANGAN: '', ESTIMASIHARGA: 0 }]);
    //         setBarangList(fullNotaService.barangList || [{ KODE: '1', NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian' }]);
    //         setIsNewRecord(false);
    //         setNotaServiceDialog(true);
    //     } catch (error) {
    //         console.error('Error fetching nota service details:', error);
    //         toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch nota service details', life: 3000 });
    //     }
    // };

    const editNotaService = (notaService: NotaService) => {
        setNota({ ...notaService });
        setSelectedServices(notaService.selectedServices || [{ KODE: '', KETERANGAN: '', ESTIMASIHARGA: 0 }]);
        setBarangList(notaService.barangList || [{ KODE: '1', NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian' }]);
        setNotaServiceDialog(true);
    };

    const confirmDeleteNotaService = (notaService: NotaService) => {
        setNota(notaService);
        setDeleteNotaServiceDialog(true);
    };

    const deleteNotaService = async () => {
        try {
            await NotaServiceAPI.delete(nota.FAKTUR);
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
            await NotaServiceAPI.bulkDelete(selectedNotaServices.map(ns => ns.FAKTUR));
            loadNotaServices();
            setDeleteNotaServicesDialog(false);
            setSelectedNotaServices([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Nota Services Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting nota services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete nota services', life: 3000 });
        }
    };

    const updateSelectedService = (index: number, service: Service) => {
        setSelectedServices(prev => {
            const updatedServices = prev.map((item, i) =>
                i === index
                    ? { KODE: service.KODE, KETERANGAN: service.KETERANGAN, ESTIMASIHARGA: service.ESTIMASIHARGA }
                    : item
            );
            updateEstimatedPrice(updatedServices);
            return updatedServices;
        });
    };

    const updateEstimatedPrice = (updatedServices: Service[] = selectedServices) => {
        const total = updatedServices.reduce((sum, service) => sum + service.ESTIMASIHARGA, 0);
        setNota(prev => ({ ...prev, ESTIMASIHARGA: total }));
    };

    const addRow = (setter: React.Dispatch<React.SetStateAction<any[]>>, initialValue: any) => {
        setter(prev => [...prev, initialValue]);
    };

    const removeRow = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number) => {
        setter(prev => {
            const newList = prev.length > 1 ? prev.filter((_, i) => i !== index) : prev;
            updateEstimatedPrice(newList);
            return newList;
        });
    };

    const updateBarang = (index: number, field: keyof BarangService, value: string) => {
        setBarangList(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const serviceTemplate = (rowData: Service, column: any) => (
        <Dropdown
            value={services.find(s => s.KODE === rowData.KODE)}
            options={services}
            onChange={(e) => updateSelectedService(column.rowIndex, e.value)}
            optionLabel="KETERANGAN"
            placeholder="Select a service"
        />
    );

    const barangTemplate = (rowData: BarangService, column: any, field: keyof BarangService) => (
        <InputText
            value={rowData[field]}
            onChange={(e) => updateBarang(column.rowIndex, field, e.target.value)}
        />
    );

    const statusTemplate = (rowData: BarangService, column: any) => (
        <Dropdown
            value={rowData.STATUSAMBIL}
            options={['Antrian', 'Proses', 'Selesai']}
            onChange={(e) => updateBarang(column.rowIndex, 'STATUSAMBIL', e.value)}
            placeholder="Select Status"
        />
    );

    const actionTemplate = (setter: React.Dispatch<React.SetStateAction<any[]>>, initialValue: any) => (rowData: any, column: any) => (
        <>
            <div className="flex gap-2">
                <Button icon="pi pi-plus" className="p-button p-component p-button-icon-only p-button-rounded p-button-success" onClick={() => addRow(setter, initialValue)} />
                <Button icon="pi pi-minus" className="p-button p-component p-button-icon-only p-button-rounded p-button-danger" onClick={() => removeRow(setter, column.rowIndex)} disabled={column.rowIndex === 0 && (setter === setSelectedServices ? selectedServices.length === 1 : barangList.length === 1)} />
            </div>
        </>
    );

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

            <DataTable
                ref={dt}
                value={notaServices}
                selection={selectedNotaServices}
                onSelectionChange={(e) => setSelectedNotaServices(e.value)}
                dataKey="FAKTUR"
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
                <Column field="FAKTUR" header="Faktur" sortable></Column>
                <Column field="TGL" header="Tanggal" sortable></Column>
                <Column field="ESTIMASISELESAI" header="Estimasi Selesai" sortable></Column>
                <Column field="PEMILIK" header="Pemilik" sortable></Column>
                <Column field="NOTELEPON" header="No Telepon" sortable></Column>
                <Column field="ESTIMASIHARGA" header="Estimasi Harga" sortable body={(rowData) => formatCurrency(rowData.ESTIMASIHARGA)}></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>

            <Dialog visible={notaServiceDialog} style={{ width: '70%' }} header="Nota Service Details" modal className="p-fluid" footer={<div className="flex justify-content-end"><Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} /><Button label="Save" icon="pi pi-check" text onClick={saveNotaService} /></div>} onHide={hideDialog}>
                <TabView>
                    <TabPanel header="Data Klien">
                        <div className="p-fluid">
                            <div className="field">
                                <label htmlFor="noServis">No. Servis</label>
                                <InputText id="noServis" name="FAKTUR" value={nota.FAKTUR} onChange={handleInputChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="pemilik">Pemilik</label>
                                <InputText id="pemilik" name="PEMILIK" value={nota.PEMILIK} onChange={handleInputChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="noTelp">No. Telp</label>
                                <InputText id="noTelp" name="NOTELEPON" value={nota.NOTELEPON} onChange={handleInputChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="tanggal">Tanggal</label>
                                <Calendar id="tanggal" name="TGL" value={new Date(nota.TGL)} onChange={(e) => setNota(prev => ({ ...prev, TGL: e.value ? e.value.toISOString().split('T')[0] : '' }))} showIcon />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Pilih Jasa dan Barang">
                        <DataTable value={selectedServices} header="Pilih Jasa" className="mb-3">
                            <Column field="KODE" header="No" style={{ width: '10%' }}></Column>
                            <Column body={serviceTemplate} header="Jasa"></Column>
                            <Column field="ESTIMASIHARGA" header="Harga" body={(rowData) => formatCurrency(rowData.ESTIMASIHARGA)}></Column>
                            <Column body={actionTemplate(setSelectedServices, { KODE: '', KETERANGAN: '', ESTIMASIHARGA: 0 })} style={{ width: '10%' }}></Column>
                        </DataTable>
                        <DataTable value={barangList} header="List Barang">
                            <Column field="KODE" header="No" style={{ width: '10%' }}></Column>
                            <Column body={(rowData, column) => barangTemplate(rowData, column, 'NAMA')} header="Nama Barang"></Column>
                            <Column body={(rowData, column) => barangTemplate(rowData, column, 'KETERANGAN')} header="Keterangan"></Column>
                            <Column body={statusTemplate} header="Status"></Column>
                            <Column body={actionTemplate(setBarangList, { KODE: (barangList.length + 1).toString(), NAMA: '', KETERANGAN: '', STATUSAMBIL: 'Antrian' })} style={{ width: '10%' }}></Column>
                        </DataTable>
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
                                <InputText id="dp" name="DP" value={nota.DP.toString()} onChange={handleInputChange} />
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
                            Are you sure you want to delete <b>{nota.FAKTUR}</b>?
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