import { APIGatewayProxyHandler } from 'aws-lambda';
import { PDFService } from '../service/pdfService';
import { PDFRequest } from '../models/pdfRequest';

const pdfService = new PDFService();

function isPDFRequest(obj: any): obj is PDFRequest {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.message === 'string'
  );
}

export const generatePdf: APIGatewayProxyHandler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    let request: PDFRequest;

    if (!event.body) {
      throw new Error('Request body is empty');
    }

    if (typeof event.body === 'string') {
      request = JSON.parse(event.body) as PDFRequest;
    } else if (typeof event.body === 'object') {
      request = event.body as PDFRequest;
    } else {
      throw new Error('Invalid request body');
    }

    if (!isPDFRequest(request)) {
      throw new Error('Invalid request format');
    }

    console.log('Parsed request:', JSON.stringify(request, null, 2));

    const pdfBuffer = await pdfService.generatePDF(request);

    console.log('PDF generated, size:', pdfBuffer.length);

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
    console.error('Error in PDF generation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error generating PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
