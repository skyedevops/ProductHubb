import PDFDocument from 'pdfkit';
import { Quote } from '@producthubb/shared';
import { QuoteModel } from '../repositories/quote.repository';

export class PDFService {
  async generateQuotePdf(quoteId: string): Promise<Buffer> {
    const quote = await QuoteModel.findById(quoteId).populate('items.productId');
    if (!quote) throw new Error('Quote not found');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Header
      doc.fontSize(20).text('PRODUCTHUBB QUOTE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Quote Number: ${quote.quoteNumber}`, { align: 'right' });
      doc.text(`Version: v${quote.version}`, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      // Customer Info
      doc.fontSize(12).text('Bill To:', { underline: true });
      doc.text(`Customer ID: ${quote.customerId}`);
      doc.moveDown();

      // Table Header
      doc.moveDown();
      const tableTop = doc.y;
      doc.fontSize(10).text('Product', 50, tableTop);
      doc.text('Qty', 300, tableTop, { width: 50, align: 'center' });
      doc.text('Unit Price', 350, tableTop, { width: 100, align: 'right' });
      doc.text('Total', 450, tableTop, { width: 100, align: 'right' });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      // Items
      quote.items.forEach((item: any) => {
        const y = doc.y;
        const productName = item.productId?.name || 'Unknown Product';
        doc.text(productName, 50, y);
        doc.text(item.quantity.toString(), 300, y, { width: 50, align: 'center' });
        doc.text(`$${item.unitPrice.toFixed(2)}`, 350, y, { width: 100, align: 'right' });
        doc.text(`$${(item.unitPrice * item.quantity).toFixed(2)}`, 450, y, { width: 100, align: 'right' });
        doc.moveDown(0.5);
      });

      // Footer
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      const footerY = doc.y;
      doc.fontSize(12).text('Subtotal:', 350, footerY, { width: 100, align: 'right' });
      doc.text(`$${quote.subtotal.toFixed(2)}`, 450, footerY, { width: 100, align: 'right' });

      doc.text('Tax (10%):', 350, footerY + 20, { width: 100, align: 'right' });
      doc.text(`$${quote.tax.toFixed(2)}`, 450, footerY + 20, { width: 100, align: 'right' });

      doc.font('Helvetica-Bold').fontSize(14).text('Total:', 350, footerY + 40, { width: 100, align: 'right' });
      doc.text(`$${quote.total.toFixed(2)}`, 450, footerY + 40, { width: 100, align: 'right' });
      doc.font('Helvetica');
      doc.end();
    });
  }
}

export const pdfService = new PDFService();
