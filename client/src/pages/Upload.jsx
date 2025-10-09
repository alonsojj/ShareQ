import { useState, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import Dropzone from "../components/Dropzone";
import FileDetails from "../components/FileDetails";
import ResultSection from "../components/ResultSection";
import "./Upload.css";
const API_URL = import.meta.env.VITE_API_URL;

function Upload() {
  const [file, setFile] = useState(null);
  const [customName, setCustomName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResult(null);
    setUploadSuccess(false);
    setCopied(false);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("customName", customName);
    formData.append("expiresInDays", expiresInDays);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      setUploadSuccess(true);
    } catch (error) {
      alert("Erro ao fazer upload: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const handleUploadAnother = () => {
    setFile(null);
    setCustomName("");
    setExpiresInDays(30);
    setResult(null);
    setUploadSuccess(false);
    setCopied(false);
  };

  const handleExpiresInDaysChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 1;
    }
    if (value > 60) {
      value = 60;
    }
    if (value < 1) {
      value = 1;
    }
    setExpiresInDays(value);
  };

  return (
    <div className="container">
      <Helmet>
        <title>G|Upload</title>
      </Helmet>
      <h1>Criar Portifolio</h1>

      {!file ? (
        <Dropzone onDrop={onDrop} />
      ) : (
        <FileDetails
          file={file}
          customName={customName}
          setCustomName={setCustomName}
          expiresInDays={expiresInDays}
          handleExpiresInDaysChange={handleExpiresInDaysChange}
          handleUpload={handleUpload}
          loading={loading}
          uploadSuccess={uploadSuccess}
          onUploadAnother={handleUploadAnother}
        />
      )}

      <ResultSection
        result={result}
        onCopyToClipboard={copyToClipboard}
        copied={copied}
      />
    </div>
  );
}

export default Upload;
