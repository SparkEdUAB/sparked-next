import axios from 'axios';
import pdf from 'pdf-parse';

export async function extractTextFromPdf(url: string) {
  try {
    // Fetch the PDF file from the URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // Important for binary data like PDFs
    });

    // Extract text from the PDF buffer
    const data = await pdf(response.data);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}
