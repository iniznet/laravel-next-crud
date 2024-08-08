import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TabView, TabPanel } from 'primereact/tabview';
import { formatCurrency } from '@/app/utils/currency';
import { Invoice, InvoiceItem } from '@/types/invoice';

interface TagihanInvoiceProps {
    invoice: Invoice | null;
    visible: boolean;
    onClose: () => void;
}

const TagihanInvoice: React.FC<TagihanInvoiceProps> = ({ invoice, visible, onClose }) => {
    const [pdfDataUrlA4, setPdfDataUrlA4] = useState<string>('');
    const [pdfDataUrlThermal, setPdfDataUrlThermal] = useState<string>('');

    useEffect(() => {
        console.log('Invoice changed:', invoice);

        if (invoice && visible) {
            generatePDF('a4');
            generatePDF('thermal');
        }
    }, [invoice, visible]);

    const generatePDF = (version: 'a4' | 'thermal') => {
        if (!invoice) {
            console.error("Invoice is not available");
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: version === 'a4' ? 'a4' : [80, 297],
        });

        const pageWidth = doc.internal.pageSize.width;
        const tableWidth = pageWidth - 20;

        const addPageNumbers = () => {
            const totalPages = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }
        };

        const formatDate = (date: string | Date): string => {
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        if (version === 'a4') {
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
            doc.text('Bill To', 20, 42);
            doc.setFont('helvetica', 'normal');
            doc.text(invoice.from, 20, 47);
            doc.text(invoice.phone_number, 20, 52);

            // Invoice Details
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE', pageWidth - 20, 42, { align: 'right' });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`${invoice.invoice_number}`, pageWidth - 20, 47, { align: 'right' });
            doc.text(`Date: ${formatDate(invoice.invoice_date)}`, pageWidth - 20, 52, { align: 'right' });
            doc.text(`Due Date: ${invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}`, pageWidth - 20, 57, { align: 'right' });

            let startY = 70;

            console.log(invoice.items);

            const tableBody: (string | number)[][] = invoice.items.map(item => [
                item.description,
                item.quantity,
                formatCurrency(item.price),
                formatCurrency(item.amount)
            ]);

            autoTable(doc, {
                startY: startY,
                head: [['Description', 'Qty', 'Price', 'Amount']],
                body: tableBody,
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

            // Summary
            const taxAmount = invoice.subtotal * (invoice.tax / 100);
            const totalWithTax = invoice.subtotal + (invoice.subtotal * (invoice.tax / 100));
            const balanceDue = totalWithTax - invoice.amount_paid;
            const summaryData = [
                ['Subtotal', formatCurrency(invoice.subtotal)],
                [`Tax (${invoice.tax}%)`, `${formatCurrency(taxAmount)}`],
                ['Total', formatCurrency(totalWithTax)],
                ['Amount Paid', formatCurrency(invoice.amount_paid)],
                ['Balance Due', formatCurrency(balanceDue)]
            ];

            autoTable(doc, {
                startY: startY,
                body: summaryData,
                theme: 'plain',
                styles: { cellPadding: 1, fontSize: 10, halign: 'right' },
                margin: { left: 120, right: 20 },
                tableWidth: 'auto',
            });

            // Notes
            if (invoice.notes) {
                startY = (doc as any).lastAutoTable.finalY + 10;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('Notes:', 20, startY);
                doc.setFont('helvetica', 'normal');
                doc.text(invoice.notes, 20, startY + 5);
            }

            addPageNumbers();

            const pdfData = doc.output('datauristring');
            setPdfDataUrlA4(pdfData);
        } else if (version === 'thermal') {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE', pageWidth / 2, 10, { align: 'center' });

            // Company Information
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text('Company Name', pageWidth / 2, 15, { align: 'center' });
            doc.text('Company Address', pageWidth / 2, 20, { align: 'center' });
            doc.text('Phone: XXX-XXX-XXXX', pageWidth / 2, 25, { align: 'center' });

            // Invoice Details
            doc.setFontSize(8);
            doc.text(`Invoice #: ${invoice.invoice_number}`, 5, 35);
            doc.text(`Date: ${formatDate(invoice.invoice_date)}`, 5, 40);
            doc.text(`Due Date: ${invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}`, 5, 45);

            // Customer Information
            doc.text(`Bill To: ${invoice.from}`, 5, 55);
            doc.text(`Phone: ${invoice.phone_number}`, 5, 60);

            // Line Items
            let startY = 70;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('Qty', 5, startY);
            doc.text('Price', 25, startY);
            doc.text('Amount', 75, startY, { align: 'right' });
            startY += 5;

            // Draw a line
            doc.setLineWidth(0.1);
            doc.line(5, startY, pageWidth - 5, startY);
            startY += 5;

            doc.setFont('helvetica', 'normal');
            invoice.items.forEach((item: InvoiceItem) => {
                const itemLines = doc.splitTextToSize(item.description, pageWidth - 10);
                doc.setFontSize(7);
                doc.text(itemLines, 5, startY);
                startY += 4;

                doc.setFontSize(8);
                doc.text(item.quantity.toString(), 5, startY);
                doc.text(formatCurrency(item.price), 25, startY);
                doc.text(formatCurrency(item.amount), 75, startY, { align: 'right' });
                startY += (itemLines.length * 3) + 3;
            });

            // Draw a line
            doc.setLineWidth(0.1);
            doc.line(5, startY, pageWidth - 5, startY);
            startY += 7; // Increased spacing

            // Summary
            const taxAmount = invoice.subtotal * (invoice.tax / 100);
            const totalWithTax = invoice.subtotal + (invoice.subtotal * (invoice.tax / 100));
            const balanceDue = totalWithTax - invoice.amount_paid;
            const summaryX = 50; // Adjusted for better alignment
            doc.text('Subtotal:', summaryX, startY, { align: 'right' });
            doc.text(formatCurrency(invoice.subtotal), 75, startY, { align: 'right' });
            startY += 5;

            doc.text(`Tax (${invoice.tax}%)`, summaryX, startY, { align: 'right' });
            doc.text(formatCurrency(taxAmount), 75, startY, { align: 'right' });
            startY += 5;

            doc.setFont('helvetica', 'bold');
            doc.text('Total:', summaryX, startY, { align: 'right' });
            doc.text(formatCurrency(totalWithTax), 75, startY, { align: 'right' });
            startY += 7; // Increased spacing

            doc.setFont('helvetica', 'normal');
            doc.text('Amount Paid:', summaryX, startY, { align: 'right' });
            doc.text(formatCurrency(invoice.amount_paid), 75, startY, { align: 'right' });
            startY += 5;

            doc.setFont('helvetica', 'bold');
            doc.text('Balance Due:', summaryX, startY, { align: 'right' });
            doc.text(formatCurrency(balanceDue), 75, startY, { align: 'right' });
            startY += 10; // Increased spacing

            // Notes
            if (invoice.notes) {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.text('Notes:', 5, startY);
                startY += 4;
                doc.setFont('helvetica', 'normal');
                const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - 10);
                doc.text(noteLines, 5, startY);
                startY += (noteLines.length * 3) + 5;
            }

            // Thank you message
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Thank You For Your Business!', pageWidth / 2, startY, { align: 'center' });

            const pdfData = doc.output('datauristring');
            setPdfDataUrlThermal(pdfData);
        }
    };

    return (
        <Dialog visible={visible} style={{ width: '80vw' }} onHide={onClose} header="Invoice Preview">
            <TabView>
                <TabPanel header="A4 Invoice">
                    {pdfDataUrlA4 && (
                        <iframe
                            title="A4 Invoice"
                            src={pdfDataUrlA4}
                            width="100%"
                            height="600px"
                        />
                    )}
                </TabPanel>
                <TabPanel header="Thermal Invoice">
                    {pdfDataUrlThermal && (
                        <iframe
                            title="Thermal Invoice"
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

export default TagihanInvoice;