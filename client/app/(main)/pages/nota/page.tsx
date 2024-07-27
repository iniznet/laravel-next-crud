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
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';

interface Barang {
    noServis: string;
    pemilik: string;
    noTelp: string;
    tanggal: Date;
    noBarang: number;
    namaBarang: string;
    keterangan: string;
    jenis: string; // 'Jasa' or 'Sparepart'
    kode: string; // Code if Sparepart
    keteranganSparepart: string; // Description for Sparepart
    harga: number;
}

const NotaForm = ({ onSubmit }: { onSubmit: (newBarang: Barang) => void }) => {
    const [noServis, setNoServis] = useState('');
    const [pemilik, setPemilik] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [tanggal, setTanggal] = useState(new Date());
    const [noBarang, setNoBarang] = useState(1);
    const [namaBarang, setNamaBarang] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [jenis, setJenis] = useState('Jasa');
    const [kode, setKode] = useState('');
    const [keteranganSparepart, setKeteranganSparepart] = useState('');
    const [harga, setHarga] = useState(0);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newBarang: Barang = {
            noServis,
            pemilik,
            noTelp,
            tanggal,
            noBarang,
            namaBarang,
            keterangan,
            jenis,
            kode,
            keteranganSparepart,
            harga
        };
        onSubmit(newBarang);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid">
                <div className="col-6">
                    <div className="field">
                        <label htmlFor="noServis">No. Servis</label>
                        <InputText id="noServis" value={noServis} onChange={(e) => setNoServis(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="pemilik">Pemilik</label>
                        <InputText id="pemilik" value={pemilik} onChange={(e) => setPemilik(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="noTelp">No. Telp</label>
                        <InputText id="noTelp" value={noTelp} onChange={(e) => setNoTelp(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="tanggal">Tanggal</label>
                        <InputText id="tanggal" type="date" value={tanggal.toISOString().slice(0, 10)} onChange={(e) => setTanggal(new Date(e.target.value))} />
                    </div>
                    <div className="field">
                        <label htmlFor="namaBarang">Nama Barang</label>
                        <InputText id="namaBarang" value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="keterangan">Keterangan</label>
                        <InputTextarea id="keterangan" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={3} />
                    </div>
                </div>
                <div className="col-6">
                    <div className="field">
                        <label htmlFor="jenis">Jenis</label>
                        <div className="flex align-items-center">
                            <RadioButton id="jenis-jasa" name="jenis" value="Jasa" checked={jenis === 'Jasa'} onChange={(e) => setJenis(e.value)} />
                            <label htmlFor="jenis-jasa">Jasa</label>
                            <RadioButton id="jenis-sparepart" name="jenis" value="Sparepart" checked={jenis === 'Sparepart'} onChange={(e) => setJenis(e.value)} />
                            <label htmlFor="jenis-sparepart">Sparepart</label>
                        </div>
                    </div>
                    {jenis === 'Sparepart' && (
                        <>
                            <div className="field">
                                <label htmlFor="kode">Kode</label>
                                <InputText id="kode" value={kode} onChange={(e) => setKode(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="keteranganSparepart">Keterangan Sparepart</label>
                                <InputTextarea id="keteranganSparepart" value={keteranganSparepart} onChange={(e) => setKeteranganSparepart(e.target.value)} rows={3} />
                            </div>
                        </>
                    )}
                    <div className="field">
                        <label htmlFor="harga">Harga</label>
                    </div>
                    <Button type="submit" label="Simpan Barang" />
                </div>
            </div>
        </form>
    );
};

const ListBarang = ({ data }: { data: Barang[] }) => {
    const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
    const [barangDialog, setBarangDialog] = useState(false);

    const handleBarangSelect = (barang: Barang) => {
        setSelectedBarang(barang);
        setBarangDialog(true);
    };

    const hideBarangDialog = () => {
        setBarangDialog(false);
    };

    const barangDialogFooter = (
        <div>
            <Button label="Tutup" icon="pi pi-times" onClick={hideBarangDialog} />
        </div>
    );

    return (
        <div>
            <DataTable value={data} selectionMode="single" selection={selectedBarang} onSelectionChange={(e) => handleBarangSelect(e.value as Barang)} dataKey="noServis" responsiveLayout="scroll">
                <Column field="noServis" header="No. Servis"></Column>
                <Column field="pemilik" header="Pemilik"></Column>
                <Column field="noTelp" header="No. Telp"></Column>
                <Column field="tanggal" header="Tanggal"></Column>
                <Column field="noBarang" header="No. Barang"></Column>
                <Column field="namaBarang" header="Nama Barang"></Column>
                <Column field="keterangan" header="Keterangan"></Column>
                <Column field="jenis" header="Jenis"></Column>
                <Column field="kode" header="Kode"></Column>
                <Column field="keteranganSparepart" header="Keterangan Sparepart"></Column>
                <Column field="harga" header="Harga"></Column>
            </DataTable>
            <Dialog visible={barangDialog} onHide={hideBarangDialog} header="Detail Barang" modal footer={barangDialogFooter}>
                {selectedBarang && (
                    <>
                        <p>
                            <b>No. Servis:</b> {selectedBarang.noServis}
                        </p>
                        <p>
                            <b>Pemilik:</b> {selectedBarang.pemilik}
                        </p>
                        <p>
                            <b>No. Telp:</b> {selectedBarang.noTelp}
                        </p>
                        <p>
                            <b>Tanggal:</b> {selectedBarang.tanggal.toLocaleDateString()}
                        </p>
                        <p>
                            <b>No. Barang:</b> {selectedBarang.noBarang}
                        </p>
                        <p>
                            <b>Nama Barang:</b> {selectedBarang.namaBarang}
                        </p>
                        <p>
                            <b>Keterangan:</b> {selectedBarang.keterangan}
                        </p>
                        <p>
                            <b>Jenis:</b> {selectedBarang.jenis}
                        </p>
                        {selectedBarang.jenis === 'Sparepart' && (
                            <>
                                <p>
                                    <b>Kode:</b> {selectedBarang.kode}
                                </p>
                                <p>
                                    <b>Keterangan Sparepart:</b> {selectedBarang.keteranganSparepart}
                                </p>
                            </>
                        )}
                        <p>
                            <b>Harga:</b> {selectedBarang.harga}
                        </p>
                    </>
                )}
            </Dialog>
        </div>
    );
};

function App() {
    const [barangData, setBarangData] = useState<Barang[]>([]);

    const handleBarangSubmit = (newBarang: Barang) => {
        setBarangData([...barangData, newBarang]);
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="spacing">
                    <h2>Nota Service</h2>
                </div>
            </div>
            <div className="main-content">
                <NotaForm onSubmit={handleBarangSubmit} />
                <ListBarang data={barangData} />
            </div>
        </div>
    );
}

export default App;
