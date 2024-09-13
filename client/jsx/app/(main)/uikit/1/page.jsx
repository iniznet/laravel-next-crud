'use client';
import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
const AspekForm = () => {
    const [formData, setFormData] = useState({
        aspekHukum: '', aspekOrganisasi: '', aspekPasar: '', aspekJaminan: '',
        aspekKeuangan: '', aspekTeknis: '', aspekAmdal: '', risiko: '', mitigasi: ''
    });
    const handleInputChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };
    const handleSave = () => {
        console.log('Saving data:', formData);
        // Implement save logic here
    };
    const handleClear = () => {
        setFormData({
            aspekHukum: '', aspekOrganisasi: '', aspekPasar: '', aspekJaminan: '',
            aspekKeuangan: '', aspekTeknis: '', aspekAmdal: '', risiko: '', mitigasi: ''
        });
    };
    const aspectFields = [
        { label: "Aspek Hukum Permohonan", field: "aspekHukum" },
        { label: "Aspek Organisasi dan Manajemen", field: "aspekOrganisasi" },
        { label: "Aspek Pasar dan Pemasaran", field: "aspekPasar" },
        { label: "Aspek Jaminan dan Asuransi", field: "aspekJaminan" },
        { label: "Aspek Keuangan", field: "aspekKeuangan" },
        { label: "Aspek Teknis Produksi", field: "aspekTeknis" },
        { label: "Aspek Amdal", field: "aspekAmdal" },
    ];
    return (<div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Formulir Aspek</h2>
                </div>

                <div className="p-6">
                    {aspectFields.map((aspect, index) => (<div key={index} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {aspect.label}
                            </label>
                            <InputTextarea rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData[aspect.field]} onChange={(e) => handleInputChange(e, aspect.field)}/>
                        </div>))}

                    <div className="mtext-sm text-red-700 mb-10 italic bg-red-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">
                            Aspek Resiko dan Mitigasi
                        </h3>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Risiko:
                            </label>
                            <InputTextarea rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.risiko} onChange={(e) => handleInputChange(e, 'risiko')}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mitigasi:
                            </label>
                            <InputTextarea rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.mitigasi} onChange={(e) => handleInputChange(e, 'mitigasi')}/>
                        </div>
                    </div>

                    <div className="text-sm text-black-700 mb-10 italic bg-green-400 p-4 rounded-lg text-center">
                        Catatan: Kolom di atas berisi hasil-hasil yang didapat
                    </div>

                    <div className="flex justify-center gap-6">
                        <Button label="Kosongkan Isi" icon="pi pi-trash" onClick={handleClear} className="p-button-outlined p-button-danger hover:bg-red-100 transition duration-300 px-8 py-3 text-lg rounded-full"/>
                        <Button label="Simpan" icon="pi pi-check" onClick={handleSave} className="p-button-raised p-button-success hover:bg-green-600 transition duration-300 px-10 py-3 text-lg rounded-full"/>
                    </div>
                </div>
            </div>
        </div>);
};
export default AspekForm;
