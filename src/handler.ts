import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const generatePdf: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { name } = body;

    console.log(`Received request to generate PDF for ${name}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `PDF generation request received for ${name}`,
        input: event
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid input',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
