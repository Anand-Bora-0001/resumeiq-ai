import PDFParser from "pdf2json";

export async function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new (PDFParser as any)(null, 1); // 1 = text only mode
      
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF parsing error:", errData.parserError);
        reject(new Error("Failed to parse PDF file. Please ensure the file is a valid PDF."));
      });
      
      pdfParser.on("pdfParser_dataReady", () => {
        // Extract the raw text and clean up weird PDF spacing/newlines
        const text = (pdfParser as any).getRawTextContent();
        resolve(text.replace(/\r\n/g, " ").replace(/\n/g, " ").trim());
      });
      
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("PDF parsing error:", error);
      reject(new Error("Failed to parse PDF file. Please ensure the file is a valid PDF."));
    }
  });
}
