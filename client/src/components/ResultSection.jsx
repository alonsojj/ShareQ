import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { LuClipboardCopy } from "react-icons/lu";

const ResultSection = ({ result, onCopyToClipboard, copied }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    if (result && result.url) {
      const svgElement = document.getElementById("qr-code-svg");
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
        setQrCodeDataUrl(dataUrl);
      }
    }
  }, [result]);

  if (!result) return null;

  return (
    <div className="result-section">
      <h2>Apresentação pronta!</h2>

      <div className="link-section">
        <input type="text" value={result.url} readOnly />
        <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={() => onCopyToClipboard(result.url)}>
          <LuClipboardCopy />
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <h3>QR Code:</h3>
      <div className="qrcode-section">
        <QRCodeSVG value={result.url} size={200} id="qr-code-svg" />
      </div>
      <div className="buttons-container">
        <a href={qrCodeDataUrl} download="qrcode.svg" className="download-button">
          <FaDownload /> Baixar QR Code
        </a>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="view-button"
        >
          <FaExternalLinkAlt /> Ver Apresentação
        </a>
      </div>
    </div>
  );
};

export default ResultSection;
