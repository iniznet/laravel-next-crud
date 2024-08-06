import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/app/utils/currency';
import { NotaService } from '@/types/notaservice';

interface PembayaranInvoiceProps {
    notaService: NotaService;
    onPdfGenerated: (pdfDataUrl: string) => void;
}

const PembayaranInvoice: React.FC<PembayaranInvoiceProps> = ({ notaService, onPdfGenerated }) => {
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
            format: 'a4'
        });
        const pageWidth = doc.internal.pageSize.width;

        // Helper function to add page numbers
        const addPageNumbers = () => {
            const totalPages = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }
        };

        const formatDate = (date: string) => {
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Company Information
        doc.setFontSize(11);
        doc.text('Company Name', pageWidth - 20, 20, { align: 'right' });
        doc.text('Company Address', pageWidth - 20, 25, { align: 'right' });
        doc.text('Company City, State, Zip', pageWidth - 20, 30, { align: 'right' });

        // Line separator
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 35, pageWidth - 20, 35);

        // Customer Information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Customer', 20, 42);
        doc.setFont('helvetica', 'normal');
        doc.text(notaService.PEMILIK, 20, 47);
        doc.text(notaService.NOTELEPON, 20, 52);

        // Invoice Details
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', pageWidth - 20, 42, { align: 'right' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${notaService.FAKTUR}`, pageWidth - 20, 47, { align: 'right' });
        doc.text(`Date: ${formatDate(notaService.TGL)}`, pageWidth - 20, 52, { align: 'right' });
        doc.text(`Due Date: ${formatDate(notaService.ESTIMASISELESAI)}`, pageWidth - 20, 57, { align: 'right' });
        doc.text(`Work Order #: ${notaService.QUEUE_NUMBER || 'N/A'}`, pageWidth - 20, 62, { align: 'right' });

        let startY = 70;
        let overallTotal = 0;

        notaService.barangList?.forEach((barang, index) => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Barang ${index + 1}: ${barang.NAMA}`, 20, startY + 3);

            startY += 5;

            const services = barang.services.map(service => [
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
                head: [['Description', 'Qty', 'Price', 'Amount']],
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

            startY = (doc as any).lastAutoTable.finalY + 5;

            if (startY > doc.internal.pageSize.height - 60) {
                doc.addPage();
                startY = 5;
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
                ['', '', 'Tax (11%)', formatCurrency(taxAmount)],
                ['', '', 'Total', formatCurrency(totalWithTax)],
            ],
            theme: 'striped',
            styles: { cellPadding: 1, fontSize: 10, halign: 'right' },
            margin: { left: 120, right: 20 },
            tableWidth: 'auto',
        });

        addPageNumbers();

        const pdfData = doc.output('datauristring');
        onPdfGenerated(pdfData);
    };

    return null;
};

export default PembayaranInvoice;