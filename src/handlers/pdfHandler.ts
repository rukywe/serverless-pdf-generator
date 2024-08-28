import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { PDFService } from '../service/pdfService';
import { PDFRequest } from '../models/pdfRequest';
import { validate, CustomValidationError } from '../utils/validate';
import { pdfRequestSchema } from '../validation/schemas';
import logger from '../utils/logger';

const s3 = new S3();
const pdfService = new PDFService();
const BUCKET_NAME = process.env.BUCKET_NAME || '';

export const generatePdf: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info('Handler started');
    logger.info(`Received event: ${JSON.stringify(event)}`);

    let bodyJson: string;
    if (event.isBase64Encoded && event.body) {
      bodyJson = Buffer.from(event.body, 'base64').toString('utf-8');
    } else if (event.body) {
      bodyJson = event.body;
    } else {
      throw new Error('Request body is empty');
    }

    logger.info(`Decoded body: ${bodyJson}`);

    const body = JSON.parse(bodyJson);
    logger.info(`Parsed body: ${JSON.stringify(body)}`);

    const request: PDFRequest = validate(pdfRequestSchema, body);
    logger.info(`Validated request: ${JSON.stringify(request)}`);

    const pdfBuffer = await pdfService.generatePDF(request);
    logger.info(`PDF generated, size: ${pdfBuffer.length} bytes`);

    const fileName = `${request.name}-${Date.now()}.pdf`;

    if (!BUCKET_NAME) {
      throw new Error('BUCKET_NAME environment variable is not set');
    }

    logger.info(`Uploading to S3 bucket: ${BUCKET_NAME}`);
    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
      })
      .promise();

    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Expires: 60 * 5
    });

    logger.info(`Generated signed URL: ${url}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'PDF generated successfully',
        downloadUrl: url
      })
    };
  } catch (error) {
    logger.error('Error in PDF generation', error);

    if (error instanceof CustomValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation error',
          errors: error.details
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error generating PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
