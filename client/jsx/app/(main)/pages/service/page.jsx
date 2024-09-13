/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ServiceAPI } from '@/apis/ServiceApi';
import { formatCurrency } from '@/app/utils/currency';
import { Skeleton } from 'primereact/skeleton';
const ServicePage = () => {
    let emptyService = {
        KODE: '',
        KETERANGAN: '',
        ESTIMASIHARGA: 0,
    };
    const [services, setServices] = useState([]);
    const [serviceDialog, setServiceDialog] = useState(false);
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [deleteServicesDialog, setDeleteServicesDialog] = useState(false);
    const [service, setService] = useState(emptyService);
    const [selectedServices, setSelectedServices] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [errors, setErrors] = useState({});
    const [isNewRecord, setIsNewRecord] = useState(true);
    const getErrorMessage = (field) => {
        return errors[field] ? errors[field][0] : '';
    };
    useEffect(() => {
        loadServices();
    }, []);
    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await ServiceAPI.getAll();
            setServices(data);
            setDataLoaded(true);
        }
        catch (error) {
            console.error('Error loading services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data Jasa', life: 3000 });
        }
        finally {
            setLoading(false);
        }
    };
    const openNew = () => {
        setService(emptyService);
        setSubmitted(false);
        setIsNewRecord(true);
        setServiceDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setServiceDialog(false);
    };
    const hideDeleteServiceDialog = () => {
        setDeleteServiceDialog(false);
    };
    const hideDeleteServicesDialog = () => {
        setDeleteServicesDialog(false);
    };
    const saveService = async () => {
        setSubmitted(true);
        if (service.KODE.trim()) {
            let response;
            try {
                if (isNewRecord)
                    response = await ServiceAPI.create(service);
                else
                    response = await ServiceAPI.update(service.KODE, service);
                loadServices();
                setServiceDialog(false);
                setService(emptyService);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: `Berhasil ${service.KODE ? 'memperbarui' : 'menambahkan'} jasa`, life: 3000 });
            }
            catch (error) {
                console.error('Error saving service:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan dalam menyimpan jasa', life: 3000 });
            }
        }
    };
    const editService = (service) => {
        setService({ ...service });
        setIsNewRecord(false);
        setServiceDialog(true);
    };
    const confirmDeleteService = (service) => {
        setService(service);
        setDeleteServiceDialog(true);
    };
    const deleteService = async () => {
        try {
            await ServiceAPI.delete(service.KODE);
            loadServices();
            setDeleteServiceDialog(false);
            setService(emptyService);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus jasa', life: 3000 });
        }
        catch (error) {
            console.error('Error deleting service:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan dalam menghapus jasa', life: 3000 });
        }
    };
    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const confirmDeleteSelected = () => {
        setDeleteServicesDialog(true);
    };
    const deleteSelectedServices = async () => {
        try {
            if (selectedServices) {
                await ServiceAPI.bulkDelete(selectedServices.map(p => p.KODE));
            }
            loadServices();
            setDeleteServicesDialog(false);
            setSelectedServices([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus jasa', life: 3000 });
        }
        catch (error) {
            console.error('Error deleting services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan dalam menghapus jasa', life: 3000 });
        }
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _service = { ...service, [name]: val };
        setService(_service);
    };
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _service = { ...service, [name]: val };
        setService(_service);
    };
    const leftToolbarTemplate = () => {
        return (<React.Fragment>
                <div className="my-2">
                    <Button label="Tambah" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew}/>
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedServices || !selectedServices.length}/>
                </div>
            </React.Fragment>);
    };
    const rightToolbarTemplate = () => {
        return (<React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block"/>
                <Button label="Ekspor" icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>);
    };
    const onSelectionChange = (e) => {
        setSelectedServices(e.value);
    };
    const kodeBodyTemplate = (rowData) => {
        return (<>
                <span className="p-column-title">Kode</span>
                {rowData.KODE}
            </>);
    };
    const keteranganBodyTemplate = (rowData) => {
        return (<>
                <span className="p-column-title">Keterangan</span>
                {rowData.KETERANGAN}
            </>);
    };
    const hargaBodyTemplate = (rowData) => {
        return (<>
                <span className="p-column-title">Estimasi Harga</span>
                {formatCurrency(Number(rowData.ESTIMASIHARGA))}
            </>);
    };
    const actionBodyTemplate = (rowData) => {
        return (<>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editService(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteService(rowData)}/>
            </>);
    };
    const header = (<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Master Jasa</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..."/>
            </span>
        </div>);
    const serviceDialogFooter = (<>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Simpan" icon="pi pi-check" text onClick={saveService}/>
        </>);
    const deleteServiceDialogFooter = (<>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteServiceDialog}/>
            <Button label="Ya" icon="pi pi-check" text onClick={deleteService}/>
        </>);
    const deleteServicesDialogFooter = (<>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServicesDialog}/>
            <Button label="Ya" icon="pi pi-check" text onClick={deleteSelectedServices}/>
        </>);
    return (<div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {loading ? (<DataTable value={Array.from({ length: 5 })} header={header}>
                            <Column style={{ width: '4rem' }} body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Kode" body={() => <Skeleton />}/>
                            <Column style={{ width: '20rem' }} header="Keterangan" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} header="Estimasi Harga" body={() => <Skeleton />}/>
                            <Column style={{ width: '10rem' }} body={() => <Skeleton />}/>
                        </DataTable>) : (<DataTable ref={dt} value={services} selection={selectedServices} onSelectionChange={onSelectionChange} dataKey="KODE" // Ensure this key is unique for each row
         paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} jasa" globalFilter={globalFilter} emptyMessage="Tidak ada jasa yang ditemukan" header={header} responsiveLayout="scroll">
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="name" header="Name" body={kodeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="description" header="Description" body={keteranganBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="price" header="Price" body={hargaBodyTemplate} sortable></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>)}

                    <Dialog visible={serviceDialog} style={{ width: '450px' }} header="Detail Jasa" modal className="p-fluid" footer={serviceDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="kode">Kode</label>
                            <InputText id="kode" value={service.KODE} onChange={(e) => onInputChange(e, 'KODE')} required autoFocus className={classNames({
            'p-invalid': submitted && !service.KODE
        })}/>
                            {submitted && !service.KODE && <small className="p-error">Kode wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="keterangan">Keterangan</label>
                            <InputTextarea id="keterangan" value={service.KETERANGAN} onChange={(e) => onInputChange(e, 'KETERANGAN')} required rows={3} cols={20}/>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="harga">Estimasi Harga</label>
                                <InputNumber id="harga" value={service.ESTIMASIHARGA} onValueChange={(e) => onInputNumberChange(e, 'ESTIMASIHARGA')} mode="currency" currency="IDR" locale="en-US"/>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServiceDialogFooter} onHide={hideDeleteServiceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
                            {service && (<span>
                                    Apakah Anda yakin ingin menghapus jasa <b>{service.KODE}</b>?
                                </span>)}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServicesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServicesDialogFooter} onHide={hideDeleteServicesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}/>
                            {service && <span>Apakah Anda yakin ingin menghapus jasa yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>);
};
export default ServicePage;
