import pdf from "pdf-parse";

export class PDFService {
  static async extractTextFromFile(file: File): Promise<string> {
    try {
      console.log(
        "Starting PDF extraction for file:",
        file.name,
        "Size:",
        file.size
      );

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log("Buffer created, size:", buffer.length);

      if (buffer.length === 0) {
        throw new Error("PDF file appears to be empty");
      }

      // SIMPLIFIED: Use pdf-parse with minimal options
      const data = await pdf(buffer);

      // Handle different possible return structures
      let extractedText: string;

      if (typeof data === "string") {
        extractedText = data;
      } else if (typeof data.text === "string") {
        extractedText = data.text;
      } else {
        // If we get an object, try to stringify it for debugging
        console.log("Unexpected data structure:", data);
        extractedText = JSON.stringify(data).substring(0, 1000);
      }

      extractedText = extractedText.trim();
      console.log("Final extracted text length:", extractedText.length);
      console.log("First 200 chars:", extractedText.substring(0, 200));

      // More reasonable validation
      if (extractedText.length < 20) {
        throw new Error(
          `PDF may be image-based. Only ${extractedText.length} characters extracted: "${extractedText}"`
        );
      }

      return extractedText;
    } catch (error) {
      console.error("PDFService Error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Invalid PDF")) {
          throw new Error("Invalid PDF file - file may be corrupted");
        }
      }

      throw new Error(
        `Failed to process PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
