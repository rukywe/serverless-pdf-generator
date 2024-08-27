import { APIGatewayProxyHandler } from 'aws-lambda';
import { PDFService } from '../service/pdfService';
import { PDFRequest } from '../models/pdfRequest';

const pdfService = new PDFService();

export const generatePdf: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const request: PDFRequest = body;

    const pdfBuffer = await pdfService.generatePDF(request);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'PDF generated successfully',
        filename: `${request.name}_document.pdf`,
        pdfData: pdfBuffer.toString('base64')
      })
    };
  } catch (error) {
    console.error('Error in PDF generation', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating PDF' })
    };
  }
};
