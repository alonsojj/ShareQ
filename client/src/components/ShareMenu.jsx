import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaDownload } from "react-icons/fa";
import { LuClipboardCopy } from "react-icons/lu";
import "./ShareMenu.css";

const ShareMenu = ({ url, onClose }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (url) {
      const svgElement = document.getElementById("qr-code-svg-share");
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
        setQrCodeDataUrl(dataUrl);
      }
    }
  }, [url]);

  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-menu-overlay" onClick={onClose}>
      <div className="share-menu-container" onClick={(e) => e.stopPropagation()}>
        <div className="share-menu-header">
          <h2>Compartilhar</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="share-menu-content">
          <div className="link-section">
            <input type="text" value={url} readOnly />
            <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={onCopyToClipboard}>
              <LuClipboardCopy />
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <h3>QR Code:</h3>
          <div className="qrcode-section">
            <QRCodeSVG value={url} size={150} id="qr-code-svg-share" />
          </div>
          <a href={qrCodeDataUrl} download="qrcode.svg" className="download-button">
            <FaDownload /> Baixar QR Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareMenu;
