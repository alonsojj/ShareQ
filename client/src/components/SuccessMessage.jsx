import { FaCheckCircle } from "react-icons/fa";

const SuccessMessage = ({ onUploadAnother }) => {
  return (
    <div className="success-message">
      <FaCheckCircle />
      <p>Upload realizado com sucesso!</p>
      <button className="upload-another-btn" onClick={onUploadAnother}>
        Enviar outro arquivo
      </button>
    </div>
  );
};

export default SuccessMessage;
