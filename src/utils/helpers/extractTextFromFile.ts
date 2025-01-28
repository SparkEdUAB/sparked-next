import { TextLoader } from 'langchain/document_loaders/fs/text';
import { determineFileType } from './determineFileType';
import pdf from 'pdf-parse';

export async function extractTextFromFile(fileUrl: string): Promise<string> {
  const fileType = determineFileType(fileUrl);
  let text = '';

  try {
    switch (fileType) {
      case 'pdf':
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdf(buffer);
        text = pdfData.text;
        break;
      case 'text':
        const textLoader = new TextLoader(fileUrl);
        const textDocs = await textLoader.load();
        text = textDocs.map((doc) => doc.pageContent).join(' ');
        break;
      default:
        throw new Error('Unsupported file type');
    }
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}
