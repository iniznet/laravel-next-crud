'use client';
import React, { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Panel } from 'primereact/panel';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
const SurveyPage = () => {
    const [selectedValues, setSelectedValues] = useState({
        kejujuran: null,
        kooperatif: null,
        reputasi: null,
        lingkungan: null,
        ciriProduk: null,
        jumlahKonsumen: null,
        kebutuhanMasyarakat: null,
        pengadaan: null,
        ketergantungan: null,
        nilaiAgunan: null,
        peranPemerintah: null,
        kondisiEkonomi: null,
        sosialPolitik: null,
    });
    const handleRadioChange = (e, field) => {
        setSelectedValues({ ...selectedValues, [field]: e.value });
    };
    const handleSave = () => {
        console.log('Saving survey responses:', selectedValues);
        alert('Survey responses saved successfully!');
    };
    return (<div className="p-m-4">
            <Panel header="Survey Form">
                <Fieldset legend="1. Kejujuran:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kejujuran1" name="kejujuran" value="Sesuai" onChange={(e) => handleRadioChange(e, 'kejujuran')} checked={selectedValues.kejujuran === 'Sesuai'}/>
                            <span style={{ marginLeft: '8px' }}>Pernyataan sesuai dengan hasil verifikasi</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kejujuran2" name="kejujuran" value="Kurang Sesuai" onChange={(e) => handleRadioChange(e, 'kejujuran')} checked={selectedValues.kejujuran === 'Kurang Sesuai'}/>
                            <span style={{ marginLeft: '8px' }}>Pernyataan kurang sesuai dengan hasil verifikasi</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kejujuran3" name="kejujuran" value="Bertentangan" onChange={(e) => handleRadioChange(e, 'kejujuran')} checked={selectedValues.kejujuran === 'Bertentangan'}/>
                            <span style={{ marginLeft: '8px' }}>Pernyataan banyak bertentangan dengan hasil verifikasi</span>
                        </label>
                    </div>
                </Fieldset>

                <Fieldset legend="2. Sikap Kooperatif:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kooperatif1" name="kooperatif" value="Sangat Kooperatif" onChange={(e) => handleRadioChange(e, 'kooperatif')} checked={selectedValues.kooperatif === 'Sangat Kooperatif'}/>
                            <span style={{ marginLeft: '8px' }}>Sangat Kooperatif dalam memberikan Keterangan & Dokumen</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kooperatif2" name="kooperatif" value="Kooperatif" onChange={(e) => handleRadioChange(e, 'kooperatif')} checked={selectedValues.kooperatif === 'Kooperatif'}/>
                            <span style={{ marginLeft: '8px' }}>Kooperatif dalam memberikan Keterangan & Dokumen</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kooperatif3" name="kooperatif" value="Kurang Kooperatif" onChange={(e) => handleRadioChange(e, 'kooperatif')} checked={selectedValues.kooperatif === 'Kurang Kooperatif'}/>
                            <span style={{ marginLeft: '8px' }}>Kurang Kooperatif dalam memberikan Keterangan & Dokumen</span>
                        </label>
                    </div>
                </Fieldset>

                <Fieldset legend="3. Reputasi Bisnis:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="reputasi1" name="reputasi" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'reputasi')} checked={selectedValues.reputasi === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Perilaku Bisnisnya jujur dan disukai</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="reputasi2" name="reputasi" value="Baik" onChange={(e) => handleRadioChange(e, 'reputasi')} checked={selectedValues.reputasi === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Tidak ada keluhan dari rekan bisnis</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="reputasi3" name="reputasi" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'reputasi')} checked={selectedValues.reputasi === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Banyak Komplain terhadap peilaku bisnis nasabah</span>
                        </label>
                    </div>
                </Fieldset>

                <Fieldset legend="4. Hubungan Dengan Lingkungan:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="lingkungan1" name="lingkungan" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'lingkungan')} checked={selectedValues.lingkungan === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Disukai dan menjadi panutan di lingkungannya</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="lingkungan2" name="lingkungan" value="Baik" onChange={(e) => handleRadioChange(e, 'lingkungan')} checked={selectedValues.lingkungan === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Hubungannya dengan lingkungan normal-normal aja</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="lingkungan3" name="lingkungan" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'lingkungan')} checked={selectedValues.lingkungan === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Kurang disukai dilingkungannya</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="5. Ciri Produk:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="ciriProduk1" name="ciriProduk" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'ciriProduk')} checked={selectedValues.ciriProduk === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Sulit ditiru orang lain</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="ciriProduk2" name="ciriProduk" value="Baik" onChange={(e) => handleRadioChange(e, 'ciriProduk')} checked={selectedValues.ciriProduk === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Tidak mudah ditiru orang lain</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="ciriProduk3" name="ciriProduk" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'ciriProduk')} checked={selectedValues.ciriProduk === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Mudah ditiru orang lain</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="6. Jumlah Konsumen:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="jumlahKonsumen1" name="jumlahKonsumen" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'jumlahKonsumen')} checked={selectedValues.jumlahKonsumen === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Lebih banyak dengan rata-rata pesaing</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="jumlahKonsumen2" name="jumlahKonsumen" value="Baik" onChange={(e) => handleRadioChange(e, 'jumlahKonsumen')} checked={selectedValues.jumlahKonsumen === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Sama dengan rata-rata pesaing</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="jumlahKonsumen3" name="jumlahKonsumen" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'jumlahKonsumen')} checked={selectedValues.jumlahKonsumen === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Lebih sedikit dari rata-rata pesaing</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="7. Kebutuhan Masyarakat Terhadap Produk:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kebutuhanMasyarakat1" name="kebutuhanMasyarakat" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'kebutuhanMasyarakat')} checked={selectedValues.kebutuhanMasyarakat === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Diperlukan dengan jumlah besar sepanjang waktu</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kebutuhanMasyarakat2" name="kebutuhanMasyarakat" value="Baik" onChange={(e) => handleRadioChange(e, 'kebutuhanMasyarakat')} checked={selectedValues.kebutuhanMasyarakat === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Diperlukan sepanjang waktu</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kebutuhanMasyarakat3" name="kebutuhanMasyarakat" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'kebutuhanMasyarakat')} checked={selectedValues.kebutuhanMasyarakat === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>diperlukan hanya dalam waktu tertentu</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="8. Pengadaan Bahan Baku:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="pengadaan1" name="pengadaan" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'pengadaan')} checked={selectedValues.pengadaan === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Mudah Didapat</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="pengadaan2" name="pengadaan" value="Baik" onChange={(e) => handleRadioChange(e, 'pengadaan')} checked={selectedValues.pengadaan === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Suplier terbatas</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="pengadaan3" name="pengadaan" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'pengadaan')} checked={selectedValues.pengadaan === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Kurang Menentu</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="9. Ketergantungan Kepada Suplier:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="ketergantungan1" name="ketergantungan" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'ketergantungan')} checked={selectedValues.ketergantungan === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Supplier sangat mempengaruhi volume usaha</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="ketergantungan2" name="ketergantungan" value="Baik" onChange={(e) => handleRadioChange(e, 'ketergantungan')} checked={selectedValues.ketergantungan === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Supplier mempengaruhi volume usaha</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="ketergantungan3" name="ketergantungan" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'ketergantungan')} checked={selectedValues.ketergantungan === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Supplier kurang mempengaruhi volume usaha</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="10. Nilai Dan Kondisi Agunan:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="nilaiAgunan1" name="nilaiAgunan" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'nilaiAgunan')} checked={selectedValues.nilaiAgunan === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Sangat Marketabel dan dapat diikat sempurna</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="nilaiAgunan2" name="nilaiAgunan" value="Baik" onChange={(e) => handleRadioChange(e, 'nilaiAgunan')} checked={selectedValues.nilaiAgunan === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Marketabel dan dapat diikat sempurna</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="nilaiAgunan3" name="nilaiAgunan" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'nilaiAgunan')} checked={selectedValues.nilaiAgunan === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Kurang Marketabel dan tidak dapat diikat sempurna</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="11. Peran Pemerintah:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="peranPemerintah1" name="peranPemerintah" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'peranPemerintah')} checked={selectedValues.peranPemerintah === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Sangat Mendukung perkembangan dunia usaha</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="peranPemerintah2" name="peranPemerintah" value="Baik" onChange={(e) => handleRadioChange(e, 'peranPemerintah')} checked={selectedValues.peranPemerintah === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Mendukung perkembangan dunia usaha</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="peranPemerintah3" name="peranPemerintah" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'peranPemerintah')} checked={selectedValues.peranPemerintah === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Kurang Mendukung perkembangan dunia usaha</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="12. Kondisi Ekonomi:" style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kondisiEkonomi1" name="kondisiEkonomi" value="Sangat Baik" onChange={(e) => handleRadioChange(e, 'kondisiEkonomi')} checked={selectedValues.kondisiEkonomi === 'Sangat Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Ekonomi Tumbuh</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kondisiEkonomi2" name="kondisiEkonomi" value="Baik" onChange={(e) => handleRadioChange(e, 'kondisiEkonomi')} checked={selectedValues.kondisiEkonomi === 'Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Ekonomi stabil/moderate</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="kondisiEkonomi3" name="kondisiEkonomi" value="Kurang Baik" onChange={(e) => handleRadioChange(e, 'kondisiEkonomi')} checked={selectedValues.kondisiEkonomi === 'Kurang Baik'}/>
                            <span style={{ marginLeft: '8px' }}>Ekonomi lemah</span>
                        </label>
                    </div>
                    </Fieldset>

                <Fieldset legend="13. Kondisi Sosial Politik:" style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="sosial1" name="sosialPolitik" value="Sangat Stabil" onChange={(e) => handleRadioChange(e, 'sosialPolitik')} checked={selectedValues.sosialPolitik === 'Sangat Stabil'}/>
                            <span style={{ marginLeft: '8px' }}>Kondisi Sosial Politik sangat stabil</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="sosial2" name="sosialPolitik" value="Stabil" onChange={(e) => handleRadioChange(e, 'sosialPolitik')} checked={selectedValues.sosialPolitik === 'Stabil'}/>
                            <span style={{ marginLeft: '8px' }}>Kondisi Sosial Politik stabil</span>
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioButton inputId="sosial3" name="sosialPolitik" value="Kurang Stabil" onChange={(e) => handleRadioChange(e, 'sosialPolitik')} checked={selectedValues.sosialPolitik === 'Kurang Stabil'}/>
                            <span style={{ marginLeft: '8px' }}>Kondisi Sosial Politik kurang stabil</span>
                        </label>
                    </div>
                </Fieldset>
            </Panel>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
    <Button label="Simpan" icon="pi pi-check" onClick={handleSave}/>
    </div>
        </div>);
};
export default SurveyPage;
