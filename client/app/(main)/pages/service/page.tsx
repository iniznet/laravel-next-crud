/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ServiceAPI } from '@/apis/ServiceApi';
import { formatCurrency } from '@/app/utils/currency';
import { Service } from '@/types/service';

const ServicePage = () => {
    let emptyService: Service = {
        KODE: '',
        KETERANGAN: '',
        ESTIMASIHARGA: 0,
    };

    const [services, setServices] = useState<Service[]>([]);
    const [serviceDialog, setServiceDialog] = useState(false);
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [deleteServicesDialog, setDeleteServicesDialog] = useState(false);
    const [service, setService] = useState<Service>(emptyService);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await ServiceAPI.getAll();
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load services', life: 3000 });
        }
    };

    const openNew = () => {
        setService(emptyService);
        setSubmitted(false);
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
            try {
                let response;
                try {
                    const existingService = await ServiceAPI.getOne(service.KODE);
                    if (existingService && existingService.KODE) {
                        // If a service with the same KODE exists, update it
                        response = await ServiceAPI.update(service.KODE, service);
                    } else {
                        // Otherwise, create a new service
                        response = await ServiceAPI.create(service);
                    }
                } catch (error) {
                    console.error('Error saving service:', error);
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save service', life: 3000 });
                }

                loadServices();
                setServiceDialog(false);
                setService(emptyService);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: `Service ${service.KODE ? 'Updated' : 'Created'}`, life: 3000 });
            } catch (error) {
                console.error('Error saving service:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save service', life: 3000 });
            }
        }
    };

    const editService = (service: Service) => {
        setService({ ...service });
        setServiceDialog(true);
    };

    const confirmDeleteService = (service: Service) => {
        setService(service);
        setDeleteServiceDialog(true);
    };

    const deleteService = async () => {
        try {
            await ServiceAPI.delete(service.KODE);
            loadServices();
            setDeleteServiceDialog(false);
            setService(emptyService);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Service Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete service', life: 3000 });
        }
    };



    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (services as any)?.length; i++) {
            if ((services as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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
                await ServiceAPI.bulkDelete((selectedServices as Service[]).map(p => p.KODE));
            }
            loadServices();
            setDeleteServicesDialog(false);
            setSelectedServices([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Services Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting services:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete services', life: 3000 });
        }
    };

    // Update the onInputChange function
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Service) => {
        const val = (e.target && e.target.value) || '';
        let _service = { ...service, [name]: val };

        setService(_service);
    };

    // Update the onInputNumberChange function
    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: keyof Service) => {
        const val = e.value || 0;
        let _service = { ...service, [name]: val };

        setService(_service);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedServices || !selectedServices.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const onSelectionChange = (e: { value: Service[] }) => {
        setSelectedServices(e.value);
    };

    const kodeBodyTemplate = (rowData: Service) => {
        return (
            <>
                <span className="p-column-title">Kode</span>
                {rowData.KODE}
            </>
        );
    };

    const keteranganBodyTemplate = (rowData: Service) => {
        return (
            <>
                <span className="p-column-title">Keterangan</span>
                {rowData.KETERANGAN}
            </>
        );
    };

    const hargaBodyTemplate = (rowData: Service) => {
        return (
            <>
                <span className="p-column-title">Estimasi Harga</span>
                {formatCurrency(Number(rowData.ESTIMASIHARGA))}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Service) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editService(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteService(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Service</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const serviceDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveService} />
        </>
    );
    const deleteServiceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServiceDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteService} />
        </>
    );
    const deleteServicesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServicesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedServices} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={services}
                        selection={selectedServices}
                        onSelectionChange={onSelectionChange}
                        dataKey="KODE"  // Ensure this key is unique for each row
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} services"
                        globalFilter={globalFilter}
                        emptyMessage="No services found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Name" body={kodeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="description" header="Description" body={keteranganBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="price" header="Price" body={hargaBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={serviceDialog} style={{ width: '450px' }} header="Service Details" modal className="p-fluid" footer={serviceDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="kode">Kode</label>
                            <InputText
                                id="kode"
                                value={service.KODE}
                                onChange={(e) => onInputChange(e, 'KODE')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !service.KODE
                                })}
                            />
                            {submitted && !service.KODE && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="keterangan">Keterangan</label>
                            <InputTextarea id="keterangan" value={service.KETERANGAN} onChange={(e) => onInputChange(e, 'KETERANGAN')} required rows={3} cols={20} />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="harga">Estimasi Harga</label>
                                <InputNumber id="harga" value={service.ESTIMASIHARGA} onValueChange={(e) => onInputNumberChange(e, 'ESTIMASIHARGA')} mode="currency" currency="IDR" locale="en-US" />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServiceDialogFooter} onHide={hideDeleteServiceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && (
                                <span>
                                    Are you sure you want to delete <b>{service.KODE}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServicesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServicesDialogFooter} onHide={hideDeleteServicesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && <span>Are you sure you want to delete the selected services?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ServicePage;