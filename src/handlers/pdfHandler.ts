import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { PDFRequest } from '../models/pdfRequest';
import logger from '../utils/logger';
import { PDFService } from '../service/pdfService';

const pdfService = new PDFService();

export const generatePdf: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const request: PDFRequest = { name: body.name };

    logger.info(`Received request to generate PDF for ${request.name}`);

    const result = await pdfService.generatePDF(request);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result,
        input: event
      })
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
