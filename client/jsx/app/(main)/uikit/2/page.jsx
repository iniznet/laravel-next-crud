'use client';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
const JaminanPage = () => {
    const [formData, setFormData] = useState({});
    const [tableData, setTableData] = useState([]);
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (<div className="jaminan-page">
      <style jsx>{`
        .jaminan-page {
          padding: 1rem;
          background-color: #f8f9fa;
        }
        .form-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .form-column {
          flex: 1;
        }
        .left-column {
          background-color: #ffe6e6;
        }
        .right-column {
          background-color: #e6ffe6;
        }
        .p-field {
          margin-bottom: 1rem;
          padding: 0.5rem;
        }
        .p-field label {
          display: block;
          margin-bottom: 0.5rem;
        }
        .button-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .table-container {
          background-color: white;
          padding: 1rem;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        :global(.p-datatable .p-datatable-thead > tr > th) {
          background-color: #f8f9fa;
        }
        :global(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
          background-color: #f8f9fa;
        }
        :global(.p-datatable .p-datatable-tbody > tr:nth-child(odd)) {
          background-color: #ffffff;
        }
      `}</style>

      <div className="form-container">
        <div className="form-column left-column">
          <div className="p-field">
            <label htmlFor="jenisAgunan">Jenis Agunan</label>
            <Dropdown id="jenisAgunan" name="jenisAgunan" options={[]} onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="merek">Merek</label>
            <InputText id="merek" name="merek" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="buktiHakMilik">Bukti Hak Milik</label>
            <Dropdown id="buktiHakMilik" name="buktiHakMilik" options={[]} onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="namaPemilikJaminan">Nama Pemilik Jaminan</label>
            <InputText id="namaPemilikJaminan" name="namaPemilikJaminan" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="lokasiAgunan">Lokasi Agunan</label>
            <InputText id="lokasiAgunan" name="lokasiAgunan" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="nilaiTransaksi">Nilai Transaksi</label>
            <InputText id="nilaiTransaksi" name="nilaiTransaksi" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="jenisPengikatan">Jenis Pengikatan</label>
            <Dropdown id="jenisPengikatan" name="jenisPengikatan" options={[]} onChange={handleInputChange} className="w-full"/>
          </div>
        </div>
        <div className="form-column right-column">
          <div className="p-field">
            <label htmlFor="tipe">Tipe</label>
            <Dropdown id="tipe" name="tipe" options={[]} onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="tahunPembuatan">Tahun Pembuatan</label>
            <Calendar id="tahunPembuatan" name="tahunPembuatan" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="noAgunan">No. Agunan</label>
            <InputText id="noAgunan" name="noAgunan" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="hubunganDenganPemilik">Hubungan dengan Pemilik</label>
            <Dropdown id="hubunganDenganPemilik" name="hubunganDenganPemilik" options={[]} onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="informasiTambahan">Informasi Tambahan</label>
            <InputText id="informasiTambahan" name="informasiTambahan" onChange={handleInputChange} className="w-full"/>
          </div>
          <div className="p-field">
            <label htmlFor="asuransi">Asuransi</label>
            <InputText id="asuransi" name="asuransi" onChange={handleInputChange} className="w-full"/>
          </div>
        </div>
      </div>
      <div className="button-container">
        <div>
          <Button label="Simpan" className="p-button-primary mr-2"/>
          <Button label="Hapus" className="p-button-danger mr-2"/>
          <Button label="Batal" className="p-button-secondary"/>
        </div>
        <Button label="Buat Jaminan Baru" className="p-button-success"/>
      </div>
      <div className="table-container">
        <h3>Daftar Data Jaminan</h3>
        <DataTable value={tableData} className="p-datatable-sm">
          <Column field="jenisAgunan" header="Jenis Agunan"/>
          <Column field="buktiHakMilik" header="Bukti Hak Milik"/>
          <Column field="nilaiTransaksi" header="Nilai Transaksi"/>
          <Column field="jenisPengikatan" header="Jenis Pengikatan"/>
          <Column field="asuransi" header="Asuransi"/>
        </DataTable>
      </div>
    </div>);
};
export default JaminanPage;
