import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { formatCurrency } from '@/app/utils/currency';
import { BarangService, BarangWithServices } from '@/types/notaservice';
import { Service, ServiceOrStock, ServiceOrStockRelation, ServiceRelation } from '@/types/service';
import { InputNumber } from 'primereact/inputnumber';
import { TabView, TabPanel } from 'primereact/tabview';

const PilihJasaBarang: React.FC<{
    barangList: BarangWithServices[];
    setBarangList: React.Dispatch<React.SetStateAction<BarangWithServices[]>>;
    servicesAndStock: ServiceOrStock[];
    errors: Record<string, string[]>;
}> = ({ barangList, setBarangList, servicesAndStock, errors }) => {
    const [selectedBarang, setSelectedBarang] = useState<BarangWithServices | null>(null);
    const [filteredItems, setFilteredItems] = useState<ServiceOrStock[]>(servicesAndStock);
    const [itemFilter, setItemFilter] = useState('');

    useEffect(() => {
        setFilteredItems(
            servicesAndStock.filter(item =>
                item.KETERANGAN?.toLowerCase().includes(itemFilter.toLowerCase()) ||
                item.NAMA?.toLowerCase().includes(itemFilter.toLowerCase())
            )
        );
    }, [itemFilter, servicesAndStock]);

    const addItemToBarang = (item: ServiceOrStock) => {
        if (selectedBarang) {
            const newService = {
                KODE_SERVICE: selectedBarang.KODE,
                KODE_BARANG: selectedBarang.KODE,
                KODE: item.KODE,
                HARGA: item.ESTIMASIHARGA || 0,
                TYPE: item.TYPE,
                NAMA: item.NAMA,
                SATUAN: item.SATUAN,
            } as ServiceRelation;

            const updatedBarang = {
                ...selectedBarang,
                services: [...selectedBarang.services, newService]
            };
            updateBarangList(updatedBarang);
        }
    };


    const removeItemFromBarang = (itemKode: string) => {
        if (selectedBarang) {
            const indexToRemove = selectedBarang.services.findLastIndex(service => service.KODE === itemKode);
            if (indexToRemove !== -1) {
                const updatedServices = [
                    ...selectedBarang.services.slice(0, indexToRemove),
                    ...selectedBarang.services.slice(indexToRemove + 1)
                ];
                const updatedBarang = {
                    ...selectedBarang,
                    services: updatedServices
                };
                updateBarangList(updatedBarang);
            }
        }
    };


    const itemSelectionBody = (rowData: ServiceOrStock) => (
        <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-success"
            onClick={() => addItemToBarang(rowData)}
        />
    );

    const groupAndSumServices = (services: ServiceRelation[]) => {
        const groupedServices = services.reduce((acc, service) => {
            if (!acc[service.KODE]) {
                acc[service.KODE] = { ...service, QTY: 0, TOTAL_HARGA: 0 };
            }
            acc[service.KODE].QTY += 1;
            acc[service.KODE].TOTAL_HARGA += service.HARGA;
            return acc;
        }, {} as Record<string, ServiceRelation & { QTY: number, TOTAL_HARGA: number }>);

        return Object.values(groupedServices);
    };

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

    const getErrorMessage = (field: string): string => {
        return errors[field] ? errors[field][0] : '';
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
                        <h5>Available Services and Stock</h5>
                        <span className="p-input-icon-left mb-2">
                            <i className="pi pi-search" />
                            <InputText
                                value={itemFilter}
                                onChange={(e) => setItemFilter(e.target.value)}
                                placeholder="Search services or stock"
                            />
                        </span>
                        <TabView>
                            <TabPanel header="Services">
                                <div style={{ height: '400px', overflow: 'auto' }}>
                                    <DataTable value={filteredItems.filter(item => item.TYPE === 'service')} scrollable scrollHeight="100%">
                                        <Column field="KODE" header="Code"></Column>
                                        <Column field="KETERANGAN" header="Description"></Column>
                                        <Column field="ESTIMASIHARGA" header="Price" body={(rowData) => formatCurrency(rowData.ESTIMASIHARGA)}></Column>
                                        <Column body={itemSelectionBody} style={{ width: '10%' }}></Column>
                                    </DataTable>
                                </div>
                            </TabPanel>
                            <TabPanel header="Stock">
                                <div style={{ height: '400px', overflow: 'auto' }}>
                                    <DataTable value={filteredItems.filter(item => item.TYPE === 'stock')} scrollable scrollHeight="100%">
                                        <Column field="KODE" header="Code"></Column>
                                        <Column field="KETERANGAN" header="Description"></Column>
                                        <Column field="ESTIMASIHARGA" header="Price" body={(rowData) => formatCurrency(rowData.ESTIMASIHARGA)}></Column>
                                        <Column body={itemSelectionBody} style={{ width: '10%' }}></Column>
                                    </DataTable>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                    <div className="col-12 md:col-6 mt-3">
                        <h5>Selected Items for {selectedBarang?.NAMA}</h5>
                        <DataTable value={groupAndSumServices(selectedBarang?.services)}>
                            <Column field="KODE" header="Code"></Column>
                            <Column field="TYPE" header="Type" body={(rowData: ServiceRelation) => rowData.TYPE === 'service' ? 'Service' : 'Stock'}></Column>
                            <Column field="HARGA" header="Price per Unit" body={(rowData) => formatCurrency(rowData.HARGA)}></Column>
                            <Column field="QTY" header="Quantity"></Column>
                            <Column field="TOTAL_HARGA" header="Total" body={(rowData) => formatCurrency(rowData.TOTAL_HARGA)}></Column>
                            <Column body={(rowData) => (
                                <div className="flex items-center">
                                    <Button
                                        icon="pi pi-minus"
                                        className="p-button-rounded p-button-danger p-button p-component p-button-icon-only"
                                        onClick={() => removeItemFromBarang(rowData.KODE)}
                                    />
                                </div>
                            )}></Column>
                        </DataTable>
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(PilihJasaBarang);