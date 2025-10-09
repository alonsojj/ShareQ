import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
        ".pptx",
      ],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps({
        className: `dropzone ${isDragActive ? "dropzone-active" : ""}`,
      })}
    >
      <input {...getInputProps()} />
      <p>Arraste e solte o arquivo aqui, ou clique para selecionar</p>
    </div>
  );
};

export default Dropzone;
