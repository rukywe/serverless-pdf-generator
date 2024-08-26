import { PDFRequest } from '../models/pdfRequest';

export class PDFService {
  async generatePDF(request: PDFRequest): Promise<string> {
    console.log(`Generating PDF for: ${request.name}`);
    return `PDF generated for ${request.name}`;
  }
}
