import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { PDFRequest } from '../models/pdfRequest';
import { PDFService } from '../service/pdfService';
import logger from '../utils/logger';
import { CustomValidationError, validate } from '../utils/validate';
import { pdfRequestSchema } from '../validation/schemas';

const pdfService = new PDFService();

export const generatePdf: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const request: PDFRequest = validate(pdfRequestSchema, body);

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

    if (error instanceof CustomValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation error',
          details: error.details
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
