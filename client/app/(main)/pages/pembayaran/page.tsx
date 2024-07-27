"use client";

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Item {
  noBarang: number;
  namaBarang: string;
  qty: number;
  harga: number;
}

const Pembayaran = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [faktur, setFaktur] = useState('');
  const [noServis, setNoServis] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [tanggalPembayaran, setTanggalPembayaran] = useState<Date | null>(null);
  const [dp, setDp] = useState<number | null>(0);
  const [pembayaran, setPembayaran] = useState<number | null>(0);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.qty * item.harga, 0);
  };

  const calculateSisa = () => {
    return (pembayaran || 0) - calculateTotal();
  };

  const filterItems = (searchTerm: string) => {
    const filtered = items.filter((item) => {
      return (
        item.noBarang.toString().includes(searchTerm) ||
        item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.qty.toString().includes(searchTerm) ||
        item.harga.toString().includes(searchTerm)
      );
    });
    setFilteredItems(filtered);
  };

  const handleAddItem = () => {
    const newItem = {
      noBarang: items.length + 1,
      namaBarang: '',
      qty: 1,
      harga: 0,
    };
    setItems([...items, newItem]);
    setFilteredItems([...items, newItem]);
  };

  const handleRemoveItem = (item: Item) => {
    const updatedItems = items.filter((i) => i !== item);
    setItems(updatedItems);
    setFilteredItems(updatedItems);
  };

  return (
    <div className="card">
      <h5>PEMBAYARAN</h5>
      <div className="p-fluid grid">
        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="faktur">Faktur</label>
            <InputText id="faktur" value={faktur} onChange={(e) => {
              setFaktur(e.target.value);
              filterItems(e.target.value);
            }} />
          </div>
          <div className="field">
            <label htmlFor="noServis">No. Servis</label>
            <InputText id="noServis" value={noServis} onChange={(e) => {
              setNoServis(e.target.value);
              filterItems(e.target.value);
            }} />
          </div>
          <div className="field">
            <label htmlFor="pemilik">Pemilik</label>
            <InputText id="pemilik" value={pemilik} onChange={(e) => {
              setPemilik(e.target.value);
              filterItems(e.target.value);
            }} />
          </div>
          <div className="field">
            <label htmlFor="tanggalPembayaran">Tanggal Pembayaran</label>
            <Calendar id="tanggalPembayaran" value={tanggalPembayaran} onChange={(e) => setTanggalPembayaran(e.value || null)} showIcon />
          </div>
        </div>
        <div className="col-12 md:col-6">
          <DataTable value={filteredItems} responsiveLayout="scroll">
            <Column field="noBarang" header="NO. BARANG" />
            <Column field="namaBarang" header="NAMA BARANG" editor={(options) => <InputText value={options.value} onChange={(e) => options.editorCallback!(e.target.value)} />} />
            <Column field="qty" header="QTY" editor={(options) => <InputNumber value={options.value} onValueChange={(e) => options.editorCallback!(e.value)} min={1} />} />
            <Column field="harga" header="HARGA" editor={(options) => <InputNumber value={options.value} onValueChange={(e) => options.editorCallback!(e.value)} mode="currency" currency="IDR" locale="id-ID" />} />
            <Column body={(rowData) => <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleRemoveItem(rowData)} />} />
          </DataTable>
          <Button label="Add Item" icon="pi pi-plus" onClick={handleAddItem} className="mt-2" />
        </div>
      </div>
      <div className="p-fluid grid mt-3">
        <div className="col-12 md:col-3">
          <div className="field">
            <label htmlFor="totalHarga">Total Harga</label>
            <InputNumber id="totalHarga" value={calculateTotal()} readOnly mode="currency" currency="IDR" locale="id-ID" />
          </div>
        </div>
        <div className="col-12 md:col-3">
          <div className="field">
            <label htmlFor="dp">DP</label>
            <InputNumber id="dp" value={dp} onValueChange={(e) => setDp(e.value || null)} mode="currency" currency="IDR" locale="id-ID" />
          </div>
        </div>
        <div className="col-12 md:col-3">
          <div className="field">
            <label htmlFor="pembayaran">Pembayaran</label>
            <InputNumber id="pembayaran" value={pembayaran} onValueChange={(e) => setPembayaran(e.value || null)} mode="currency" currency="IDR" locale="id-ID" />
          </div>
        </div>
        <div className="col-12 md:col-3">
          <div className="field">
            <label htmlFor="sisa">Sisa</label>
            <InputNumber id="sisa" value={calculateSisa()} readOnly mode="currency" currency="IDR" locale="id-ID" />
          </div>
        </div>
      </div>
      <div className="flex justify-content-end mt-2">
        <Button label="BAYAR" className="mr-2" />
        <Button label="CANCEL" className="p-button-secondary" />
      </div>
    </div>
  );
};

export default Pembayaran;