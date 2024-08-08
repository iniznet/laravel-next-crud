import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TabView, TabPanel } from 'primereact/tabview';
import { formatCurrency } from '@/app/utils/currency';
import { NotaService } from '@/types/notaservice';

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

        if (version === 'a4') {
            // A4 Version
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Service Order', pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Service No. #: ${notaService.KODE}`, 20, 30);
            doc.text(`Date: ${formatDate(notaService.TGL)}`, 20, 35);
            doc.text(`Customer: ${notaService.PEMILIK}`, 20, 40);
            doc.text(`Phone: ${notaService.NOTELEPON}`, 20, 45);
            doc.text(`Est. Completion: ${formatDate(notaService.ESTIMASISELESAI)}`, 20, 50);
            doc.text(`Work Order #: ${notaService.QUEUE_NUMBER || 'N/A'}`, 20, 55);

            let startY = 65;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Items and Services', 20, startY);

            startY += 5;

            notaService.barangList?.forEach((barang, index) => {
                const itemData = [
                    [`Barang ${index + 1}: ${barang.NAMA}`, '', '', ''],
                    ['Description:', barang.KETERANGAN || 'N/A', '', ''],
                    ['Service', 'Qty', 'Price', 'Amount'],
                ];

                barang.services.forEach(service => {
                    const qty = service.QTY || 1;
                    const amount = service.HARGA * qty;
                    itemData.push([
                        service.NAMA,
                        qty.toString(),
                        formatCurrency(service.HARGA),
                        formatCurrency(amount)
                    ]);
                });

                autoTable(doc, {
                    startY: startY,
                    head: [],
                    body: itemData,
                    theme: 'striped',
                    styles: { cellPadding: 1, fontSize: 8 },
                    columnStyles: {
                        0: { cellWidth: 'auto' },
                        1: { cellWidth: 20, halign: 'center' },
                        2: { cellWidth: 30, halign: 'right' },
                        3: { cellWidth: 30, halign: 'right' },
                    },
                });

                startY = (doc as any).lastAutoTable.finalY + 10;

                if (startY > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    startY = 20;
                }
            });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`Estimated Total: ${formatCurrency(notaService.ESTIMASIHARGA)}`, pageWidth - 20, startY, { align: 'right' });

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
            doc.text('Service Order', pageWidth / 2, 10, { align: 'center' });

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`No. #: ${notaService.KODE}`, 5, 15);
            doc.text(`Date: ${formatDate(notaService.TGL)}`, 5, 20);
            doc.text(`Customer: ${notaService.PEMILIK}`, 5, 25);
            doc.text(`Phone: ${notaService.NOTELEPON}`, 5, 30);
            doc.text(`Est. Completion: ${formatDate(notaService.ESTIMASISELESAI)}`, 5, 35);
            doc.text(`Work Order #: ${notaService.QUEUE_NUMBER || 'N/A'}`, 5, 40);

            drawSeparator(45);

            let startY = 50;

            notaService.barangList?.forEach((barang, index) => {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text(`Barang ${index + 1}: ${barang.NAMA}`, 5, startY);
                startY += 5;
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text(`Description: ${barang.KETERANGAN || 'N/A'}`, 5, startY);
                startY += 7;

                doc.setFont('helvetica', 'bold');
                doc.text('Service', 5, startY);
                doc.text('Qty', 45, startY, { align: 'right' });
                doc.text('Price', 60, startY, { align: 'right' });
                doc.text('Amount', 75, startY, { align: 'right' });
                startY += 5;

                barang.services.forEach(service => {
                    const qty = service.QTY || 1;
                    const amount = service.HARGA * qty;
                    doc.setFont('helvetica', 'normal');
                    doc.text(service.NAMA, 5, startY, { maxWidth: 35 });
                    doc.text(qty.toString(), 45, startY, { align: 'right' });
                    doc.text(formatCurrency(service.HARGA), 60, startY, { align: 'right' });
                    doc.text(formatCurrency(amount), 75, startY, { align: 'right' });
                    startY += 5;
                });

                drawSeparator(startY);
                startY += 5;
            });

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(`Estimated Total: ${formatCurrency(notaService.ESTIMASIHARGA)}`, 75, startY, { align: 'right' });

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