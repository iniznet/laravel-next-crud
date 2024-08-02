import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { formatCurrency } from '@/app/utils/currency';
import { BarangService, BarangWithServices } from '@/types/notaservice';
import { Service, ServiceRelation } from '@/types/service';
import { InputNumber } from 'primereact/inputnumber';

const PilihJasaBarang: React.FC<{
    barangList: BarangWithServices[];
    setBarangList: React.Dispatch<React.SetStateAction<BarangWithServices[]>>;
    services: Service[];
    errors: Record<string, string[]>;
}> = ({ barangList, setBarangList, services, errors }) => {
    const [selectedBarang, setSelectedBarang] = useState<BarangWithServices | null>(null);
    const [filteredServices, setFilteredServices] = useState<Service[]>(services);
    const [serviceFilter, setServiceFilter] = useState('');

    const getErrorMessage = (field: string): string => {
        return errors[field] ? errors[field][0] : '';
    };

    useEffect(() => {
        setFilteredServices(
            services.filter(service =>
                service.KETERANGAN.toLowerCase().includes(serviceFilter.toLowerCase())
            )
        );
    }, [serviceFilter, services]);

    const updateBarang = useCallback((index: number, field: keyof BarangService, value: string) => {
        setBarangList(prev => {
            const newList = [...prev];
            newList[index] = { ...newList[index], [field]: value };
            return newList;
        });
        if (selectedBarang && selectedBarang.KODE === barangList[index].KODE) {
            setSelectedBarang(prev => prev ? { ...prev, [field]: value } : null);
        }
    }, [barangList, selectedBarang]);

    const addServiceToBarang = (service: Service) => {
        if (selectedBarang) {
            const updatedBarang = {
                ...selectedBarang,
                services: [
                    ...selectedBarang.services,
                    { KODE_SERVICE: service.KODE, KODE_BARANG: selectedBarang.KODE, KODE: service.KODE, HARGA: service.ESTIMASIHARGA }
                ]
            };
            updateBarangList(updatedBarang);
        }
    };

    const updateServicePrice = (serviceKode: string, newPrice: number) => {
        if (selectedBarang) {
            const updatedBarang = {
                ...selectedBarang,
                services: selectedBarang.services.map(s =>
                    s.KODE === serviceKode ? { ...s, HARGA: newPrice } : s
                )
            };
            updateBarangList(updatedBarang);
        }
    };

    const removeServiceFromBarang = (serviceKode: string) => {
        if (selectedBarang) {
            const updatedBarang = {
                ...selectedBarang,
                services: selectedBarang.services.filter(s => s.KODE !== serviceKode)
            };
            updateBarangList(updatedBarang);
        }
    };

    const updateBarangList = (updatedBarang: BarangWithServices) => {
        const newEstimatedPrice = updatedBarang.services.reduce((sum, service) => sum + service.HARGA, 0);
        const finalUpdatedBarang = { ...updatedBarang, ESTIMASIHARGA: newEstimatedPrice };
        setBarangList(prev => prev.map(item => item.KODE === updatedBarang.KODE ? finalUpdatedBarang : item));
        setSelectedBarang(finalUpdatedBarang);
    };

    const addBarangRow = () => {
        const newKode = (Math.max(...barangList.map(b => parseInt(b.KODE))) + 1).toString();
        setBarangList(prev => [...prev, {
            KODE: newKode,
            NAMA: '',
            KETERANGAN: '',
            STATUSAMBIL: 'Antrian',
            services: [],
            ESTIMASIHARGA: 0
        }]);
    };

    const removeBarangRow = (kode: string) => {
        if (barangList.length > 1) {
            setBarangList(prev => prev.filter(b => b.KODE !== kode));
            if (selectedBarang && selectedBarang.KODE === kode) {
                setSelectedBarang(null);
            }
        }
    };

    const barangTemplate = (rowData: BarangWithServices, column: any, field: keyof BarangService) => {
        return (
            <>
                <InputText
                    value={rowData[field]}
                    onChange={(e) => updateBarang(barangList.indexOf(rowData), field, e.target.value)}
                    className={getErrorMessage(`barangList.${barangList.indexOf(rowData)}.${field}`) ? 'p-invalid' : ''}
                />
                {getErrorMessage(`barangList.${barangList.indexOf(rowData)}.${field}`) && <small className="p-error">{getErrorMessage(`barangList.${barangList.indexOf(rowData)}.${field}`)}</small>}
            </>
        );
    };

    const statusTemplate = (rowData: BarangWithServices) => (
        <Dropdown
            value={rowData.STATUSAMBIL}
            options={['Antrian', 'Proses', 'Selesai']}
            onChange={(e) => {
                e.stopPropagation();
                updateBarang(barangList.findIndex(b => b.KODE === rowData.KODE), 'STATUSAMBIL', e.value);
            }}
            placeholder="Select Status"
            onClick={(e) => e.stopPropagation()}
        />
    );

    const estimatedPriceTemplate = (rowData: BarangWithServices) => (
        <span>{formatCurrency(rowData.ESTIMASIHARGA)}</span>
    );

    const actionTemplate = (rowData: BarangWithServices) => (
        <div className="flex gap-2">
            <Button
                className="p-button-rounded p-button-success"
                icon="pi pi-plus"
                onClick={addBarangRow}
            />
            <Button
                icon="pi pi-minus"
                className="p-button-rounded p-button-danger"
                onClick={() => removeBarangRow(rowData.KODE)}
                disabled={barangList.length === 1}
            />
        </div>
    );

    const serviceSelectionBody = (rowData: Service) => (
        <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-success"
            onClick={() => addServiceToBarang(rowData)}
            disabled={!selectedBarang || selectedBarang.services.some(s => s.KODE === rowData.KODE)}
        />
    );

    const selectedServicesBody = (rowData: ServiceRelation) => (
        <div className="flex align-items-center gap-2">
            <InputNumber
                value={rowData.HARGA}
                onValueChange={(e) => updateServicePrice(rowData.KODE, e.value || 0)}
                mode="currency"
                currency="IDR"
                locale="id-ID"
                minFractionDigits={0}
            />
            <Button
                icon="pi pi-minus"
                className="p-button-rounded p-button-danger flex-grow"
                onClick={() => removeServiceFromBarang(rowData.KODE)}
            />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex justify-content-between align-items-center mb-2">
                    <h5 className="m-0">List Barang</h5>
                </div>
                <DataTable
                    value={barangList}
                    selection={selectedBarang}
                    onSelectionChange={(e) => setSelectedBarang(e.value as BarangWithServices)}
                    selectionMode="single"
                    dataKey="KODE"
                >
                    <Column selectionMode="single" style={{ width: '3em' }} />
                    <Column field="KODE" header="No" style={{ width: '10%' }}></Column>
                    <Column body={(rowData, column) => barangTemplate(rowData, column, 'NAMA')} header="Nama Barang"></Column>
                    <Column body={(rowData, column) => barangTemplate(rowData, column, 'KETERANGAN')} header="Keterangan"></Column>
                    <Column body={statusTemplate} header="Status"></Column>
                    <Column body={estimatedPriceTemplate} header="Estimated Price"></Column>
                    <Column body={actionTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>

            {selectedBarang && (
                <>
                    <div className="col-12 md:col-6 mt-3">
                        <h5>Available Services</h5>
                        <span className="p-input-icon-left mb-2">
                            <i className="pi pi-search" />
                            <InputText
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                                placeholder="Search services"
                            />
                        </span>
                        <div style={{ height: '400px', overflow: 'auto' }}>
                            <DataTable value={filteredServices} scrollable scrollHeight="100%">
                                <Column field="KODE" header="Service"></Column>
                                <Column field="KETERANGAN" header="Service"></Column>
                                <Column field="ESTIMASIHARGA" header="Price" body={(rowData) => formatCurrency(rowData.ESTIMASIHARGA)}></Column>
                                <Column body={serviceSelectionBody} style={{ width: '10%' }}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 mt-3">
                        <h5>Selected Services for {selectedBarang.NAMA}</h5>
                        <DataTable value={selectedBarang.services}>
                            <Column field="KODE" header="Service Code"></Column>
                            <Column field="HARGA" header="Price" body={selectedServicesBody}></Column>
                        </DataTable>
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(PilihJasaBarang);