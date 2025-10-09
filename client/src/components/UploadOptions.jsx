const UploadOptions = ({
  customName,
  setCustomName,
  expiresInDays,
  handleExpiresInDaysChange,
  handleUpload,
  loading,
  uploadSuccess,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Nome do arquivo (opcional)"
        value={customName}
        onChange={(e) => setCustomName(e.target.value)}
        disabled={loading}
      />
      <div className="expiration-control">
        <label htmlFor="expiresInDays">Dias para expirar:</label>
        <div className="expiration-input">
          <input
            type="range"
            id="expiresInDays-slider"
            min="1"
            max="60"
            value={expiresInDays}
            onChange={handleExpiresInDaysChange}
            disabled={loading}
          />
          <input
            type="number"
            id="expiresInDays-number"
            min="1"
            max="60"
            value={expiresInDays}
            onChange={handleExpiresInDaysChange}
            disabled={loading}
          />
        </div>
      </div>
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={loading || uploadSuccess}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div className="nv-spinner" style={{ margin: '0' }}></div>
            <span>Enviando...</span>
          </div>
        ) : (
          "Upload"
        )}
      </button>
    </>
  );
};

export default UploadOptions;
