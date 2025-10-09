require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

["uploads"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".ppt", ".pptx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas PDF, PPT e PPTX são permitidos"));
    }
  },
});

const presentations = new Map();

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    let file = req.file;
    const { customName, expiresInDays } = req.body;

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".ppt" || ext === ".pptx") {
      file = await convertToPdf(file);
    }

    const presentationId = uuidv4();
    const presentationUrl = `${process.env.FRONTEND_URL}/view/${presentationId}`;

    const presentation = {
      id: presentationId,
      originalName: customName || file.originalname,
      filename: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      url: presentationUrl,
      createdAt: new Date(),
    };

    presentations.set(presentationId, presentation);

    res.json({
      success: true,
      presentationId,
      url: presentationUrl,
      fileUrl: `${process.env.BACKEND_URL}/uploads/${file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/presentation/:id", (req, res) => {
  const presentation = presentations.get(req.params.id);

  if (!presentation) {
    return res.status(404).json({ error: "Apresentação não encontrada" });
  }

  res.json({
    ...presentation,
    fileUrl: `${process.env.BACKEND_URL}/uploads/${presentation.filename}`,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
