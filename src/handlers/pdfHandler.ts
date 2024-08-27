import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { PDFRequest } from '../models/pdfRequest';
import { PDFService } from '../service/pdfService';
import logger from '../utils/logger';

const pdfService = new PDFService();

export const generatePdf: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const request: PDFRequest = {
      name: body.name,
      email: body.email,
      message: body.message
    };

    logger.info(`Received request to generate PDF for ${request.name}`);

    const pdfBuffer = await pdfService.generatePDF(request);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${request.name}_document.pdf"`
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    logger.error('Error in PDF generation', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
