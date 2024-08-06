import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/app/utils/currency';
import { NotaService } from '@/types/notaservice';

interface NotaServiceInvoiceProps {
    notaService: NotaService;
    onPdfGenerated: (pdfDataUrl: string) => void;
}

const NotaServiceInvoice: React.FC<NotaServiceInvoiceProps> = ({ notaService, onPdfGenerated }) => {
    useEffect(() => {
        if (notaService) {
            generatePDF();
        }
    }, [notaService]);

    const generatePDF = () => {
        if (!notaService) {
            console.error("NotaService is not available");
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a5'
        });
        const pageWidth = doc.internal.pageSize.width;

        const formatDate = (date: string) => {
            const d = new Date(date);
            return d.toLocaleDateString();
        };

        // Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Service Order', pageWidth / 2, 15, { align: 'center' });

        // Customer and Order Information
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Service No. #: ${notaService.KODE}`, 10, 25);
        doc.text(`Date: ${formatDate(notaService.TGL)}`, 10, 30);
        doc.text(`Customer: ${notaService.PEMILIK}`, 10, 35);
        doc.text(`Phone: ${notaService.NOTELEPON}`, 10, 40);
        doc.text(`Est. Completion: ${formatDate(notaService.ESTIMASISELESAI)}`, 10, 45);
        doc.text(`Work Order #: ${notaService.QUEUE_NUMBER || 'N/A'}`, 10, 50);

        // Items and Issues
        let startY = 60;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Items and Services', 10, startY);

        startY += 5;

        notaService.barangList?.forEach((barang, index) => {
            const itemData = [
                [`Barang ${index + 1}: ${barang.NAMA}`, ''],
                ['Description:', barang.KETERANGAN || 'N/A'],
            ];

            barang.services.forEach(service => {
                itemData.push([service.NAMA, formatCurrency(service.HARGA)]);
            });

            autoTable(doc, {
                startY: startY,
                body: itemData,
                theme: 'plain',
                styles: { cellPadding: 1, fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 30, halign: 'right' },
                },
            });

            startY = (doc as any).lastAutoTable.finalY + 5;

            if (startY > doc.internal.pageSize.height - 20) {
                doc.addPage();
                startY = 10;
            }
        });

        // Total
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Estimated Total: ${formatCurrency(notaService.ESTIMASIHARGA)}`, pageWidth - 10, startY + 5, { align: 'right' });

        // Footer
        // doc.setFontSize(8);
        // doc.setFont('helvetica', 'italic');
        // doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

        const pdfData = doc.output('datauristring');
        onPdfGenerated(pdfData);
    };

    return null;
};

export default NotaServiceInvoice;