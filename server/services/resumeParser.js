import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractResumeText = async (filePath) => {
  try {
    // Read PDF file
    const pdfBuffer = fs.readFileSync(filePath);

    // Load PDF
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });

    const pdf = await loadingTask.promise;

    let fullText = "";

    // Read every page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    console.log("Resume Text Length:", fullText.length);

    return fullText.trim();
  } catch (error) {
    console.error("Resume Parser Error:", error);
    throw error;
  }
};