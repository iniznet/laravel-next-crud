import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TabView, TabPanel } from 'primereact/tabview';
import { formatCurrency } from '@/app/utils/currency';
import { NotaService } from '@/types/notaservice';
import { ServiceRelation } from '@/types/service';

interface NotaServiceInvoiceProps {
    notaService: NotaService | null;
    visible: boolean;
    onClose: () => void;
}

const NotaServiceInvoice: React.FC<NotaServiceInvoiceProps> = ({ notaService, visible, onClose }) => {
    const [pdfDataUrlA4, setPdfDataUrlA4] = useState('');
    const [pdfDataUrlThermal, setPdfDataUrlThermal] = useState('');

    useEffect(() => {
        if (notaService && visible) {
            generatePDF('a4');
            generatePDF('thermal');
        }
    }, [notaService, visible]);

    const generatePDF = (version: 'a4' | 'thermal') => {
        if (!notaService) {
            console.error("NotaService is not available");
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: version === 'a4' ? 'a4' : [80, 297],
        });

        const pageWidth = doc.internal.pageSize.width;

        const formatDate = (date: string) => {
            const d = new Date(date);
            return d.toLocaleDateString();
        };

        const groupServices = (services: ServiceRelation[]) => {
            const groupedServices: ServiceRelation[] = services.reduce((acc: ServiceRelation[], service: ServiceRelation) => {
                const existingService = acc.find(s => s.NAMA === service.NAMA && s.HARGA === service.HARGA);
                if (existingService) {
                    existingService.QTY += service.QTY || 1;
                } else {
                    acc.push({ ...service, QTY: service.QTY || 1 });
                }
                return acc;
            }, []);
            return groupedServices;
        };

        if (version === 'a4') {
            // A4 Version
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Nota Servis', pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`No Servis: ${notaService.KODE}`, 20, 30);
            doc.text(`Tanggal: ${formatDate(notaService.TGL)}`, 20, 35);
            doc.text(`Kustomer: ${notaService.PEMILIK}`, 20, 40);
            doc.text(`No Telepon: ${notaService.NOTELEPON}`, 20, 45);
            doc.text(`Estimasi Selesai: ${formatDate(notaService.ESTIMASISELESAI)}`, 20, 50);
            doc.text(`Antrian: ${notaService.ANTRIAN || 'N/A'}`, 20, 55);

            let startY = 65;
            let overallTotal = 0;

            notaService.barangList?.forEach((barang, index) => {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(`Barang ${index + 1}: ${barang.NAMA}`, 20, startY);
                startY += 4;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Deskripsi: ${barang.KETERANGAN || 'N/A'}`, 20, startY);
                startY += 5;

                const groupedServices = groupServices(barang.services);
                const services = groupedServices.map(service => [
                    service.NAMA,
                    service.QTY || 1,
                    formatCurrency(service.HARGA),
                    formatCurrency(service.HARGA * (service.QTY || 1)),
                ]);

                const subtotal = barang.services.reduce((acc, service) => acc + service.HARGA * (service.QTY || 1), 0);
                overallTotal += subtotal;

                services.push([
                    '',
                    '',
                    'Subtotal',
                    formatCurrency(subtotal)
                ]);

                autoTable(doc, {
                    startY: startY,
                    head: [['Nama', 'Jumlah', 'Harga', 'Total']],
                    body: services,
                    theme: 'striped',
                    headStyles: { fillColor: [0, 0, 0] },
                    styles: { cellPadding: 1, fontSize: 10, halign: 'center' },
                    margin: { left: 20, right: 20 },
                    tableWidth: 'auto',
                    columnStyles: {
                        0: { cellWidth: 80, halign: 'left' },
                        1: { cellWidth: 10 },
                        2: { cellWidth: 40, halign: 'right' },
                        3: { cellWidth: 40, halign: 'right' },
                    },
                });

                startY = (doc as any).lastAutoTable.finalY + 10;

                if (startY > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    startY = 20;
                }
            });

            const taxRate = 0.11;
            const taxAmount = overallTotal * taxRate;
            const totalWithTax = overallTotal + taxAmount;

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            startY += 10;

            autoTable(doc, {
                startY: startY,
                body: [
                    ['', '', 'Subtotal', formatCurrency(overallTotal)],
                    ['', '', 'PPN (11%)', formatCurrency(taxAmount)],
                    ['', '', 'Total', formatCurrency(totalWithTax)],
                ],
                theme: 'striped',
                styles: { cellPadding: 1, fontSize: 10, halign: 'right' },
                margin: { left: 120, right: 20 },
                tableWidth: 'auto',
            });

            const pdfData = doc.output('datauristring');
            setPdfDataUrlA4(pdfData);
        } else {
            // Thermal Version
            const drawSeparator = (yPos: number) => {
                doc.setLineDashPattern([1, 1], 0);
                doc.setLineWidth(0.1);
                doc.setDrawColor(0, 0, 0);
                doc.line(5, yPos, pageWidth - 5, yPos);
            };

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Nota Servis', pageWidth / 2, 10, { align: 'center' });

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`No Servis: ${notaService.KODE}`, 5, 15);
            doc.text(`Tanggal: ${formatDate(notaService.TGL)}`, 5, 18);
            doc.text(`Kustomer: ${notaService.PEMILIK}`, 5, 21);
            doc.text(`No Telepon: ${notaService.NOTELEPON}`, 5, 24);
            doc.text(`Estimasi Selesai: ${formatDate(notaService.ESTIMASISELESAI)}`, 5, 27);
            doc.text(`Antrian: ${notaService.ANTRIAN || 'N/A'}`, 5, 30);

            drawSeparator(33);

            let startY = 37;
            let overallTotal = 0;

            notaService.barangList?.forEach((barang, index) => {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text(`Barang ${index + 1}: ${barang.NAMA}`, 5, startY);
                startY += 4;
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text(`Deskripsi: ${barang.KETERANGAN || 'N/A'}`, 5, startY);
                startY += 6;

                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Jumlah', 5, startY);
                doc.text('Harga', 25, startY);
                doc.text('Total', 55, startY);
                startY += 2;
                drawSeparator(startY);
                startY += 4;

                const groupedServices = groupServices(barang.services);
                groupedServices.forEach((service, index) => {
                    const qty = service.QTY || 1;
                    const price = service.HARGA;
                    const amount = price * qty;
                    overallTotal += amount;

                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.text(service.NAMA, 5, startY);
                    startY += 4;
                    doc.text(qty.toString(), 5, startY);
                    doc.text(formatCurrency(price), 20, startY);
                    doc.text(formatCurrency(amount), 50, startY);

                    if (index !== barang.services.length - 1) {
                        startY += 5;
                    } else {
                        startY += 2;
                    }
                });

                drawSeparator(startY);
                startY += 5;
            });

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Total:', 25, startY);
            doc.text(formatCurrency(overallTotal), 50, startY);

            const pdfData = doc.output('datauristring');
            setPdfDataUrlThermal(pdfData);
        }
    };

    return (
        <Dialog visible={visible} style={{ width: '80vw' }} onHide={onClose} header="Service Order Preview">
            <TabView>
                <TabPanel header="A4 Service Order">
                    {pdfDataUrlA4 && (
                        <iframe
                            title="A4 Service Order"
                            src={pdfDataUrlA4}
                            width="100%"
                            height="600px"
                        />
                    )}
                </TabPanel>
                <TabPanel header="Thermal Service Order">
                    {pdfDataUrlThermal && (
                        <iframe
                            title="Thermal Service Order"
                            src={pdfDataUrlThermal}
                            width="100%"
                            height="600px"
                        />
                    )}
                </TabPanel>
            </TabView>
        </Dialog>
    );
};

export default NotaServiceInvoice;