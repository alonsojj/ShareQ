const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const fs = require("fs");

const convertToPdf = async (file) => {
  const outputDir = path.dirname(file.path);
  const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${file.path}"`;

  try {
    console.log("Iniciando conversão para PDF...");
    await exec(command);

    const pdfFilename = `${path.basename(
      file.filename,
      path.extname(file.filename)
    )}.pdf`;
    const pdfPath = path.join(outputDir, pdfFilename);

    if (fs.existsSync(pdfPath)) {
      console.log("Conversão para PDF concluída com sucesso.");

      // Delete the original ppt/pptx file
      fs.unlinkSync(file.path);

      // Get stats of the new PDF file
      const stats = fs.statSync(pdfPath);

      // Return a new file object representing the PDF
      return {
        ...file,
        filename: pdfFilename,
        path: pdfPath,
        mimetype: "application/pdf",
        size: stats.size,
      };
    } else {
      throw new Error("A conversão falhou: o arquivo PDF não foi criado.");
    }
  } catch (error) {
    console.error("Erro durante a conversão para PDF:", error);
    // If conversion fails, clean up the original file
    fs.unlinkSync(file.path);
    throw new Error("Falha ao converter o arquivo para PDF.");
  }
};

module.exports = { convertToPdf };
