import { PDFRequest } from '../models/pdfRequest';
import PDFDocument from 'pdfkit';
import logger from '../utils/logger';

export class PDFService {
  async generatePDF(request: PDFRequest): Promise<Buffer> {
    logger.info('Starting PDF generation');
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        logger.info('PDF generation completed');
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err) => {
        logger.error('Error in PDF generation', err);
        reject(err);
      });

      doc.fontSize(25).text('Welcome to Your Custom PDF!', { align: 'center' });

      doc.moveDown();
      doc.fontSize(18).text(`Hello ${request.name},`, { align: 'left' });

      doc.moveDown();
      doc
        .fontSize(14)
        .text(
          "Thank you for using our PDF generation service. Here's a summary of your information:"
        );

      doc.moveDown();
      doc.text(`Name: ${request.name}`);
      doc.text(`Email: ${request.email}`);

      doc.moveDown();
      doc.fontSize(16).text('Your Message:');
      doc.fontSize(12).text(request.message, {
        width: 412,
        align: 'justify',
        indent: 20,
        columns: 1,
        height: 300,
        ellipsis: true
      });

      doc.moveDown();
      doc
        .fontSize(10)
        .text(
          'This PDF was generated automatically by our serverless PDF generation service.',
          { align: 'center' }
        );

      doc
        .save()
        .moveTo(50, 650)
        .lineTo(550, 650)
        .strokeColor('#F0F0F0')
        .stroke();

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8);
        doc.text(`Page ${i + 1} of ${pages.count}`, 50, doc.page.height - 50, {
          align: 'center'
        });
      }

      logger.info('Finalizing PDF document');
      doc.end();
    });
  }
}
