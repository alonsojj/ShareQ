import { FaFilePdf } from "react-icons/fa";
import UploadOptions from "./UploadOptions";
import SuccessMessage from "./SuccessMessage";

const FileDetails = ({
  file,
  customName,
  setCustomName,
  expiresInDays,
  handleExpiresInDaysChange,
  handleUpload,
  loading,
  uploadSuccess,
  onUploadAnother,
}) => {
  return (
    <div className="file-details-box">
      <div className="file-icon">
        <FaFilePdf />
        <p>{file.name}</p>
      </div>
      <div className="upload-options">
        {!uploadSuccess ? (
          <UploadOptions
            customName={customName}
            setCustomName={setCustomName}
            expiresInDays={expiresInDays}
            handleExpiresInDaysChange={handleExpiresInDaysChange}
            handleUpload={handleUpload}
            loading={loading}
            uploadSuccess={uploadSuccess}
          />
        ) : (
          <SuccessMessage onUploadAnother={onUploadAnother} />
        )}
      </div>
    </div>
  );
};

export default FileDetails;
