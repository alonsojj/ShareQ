const { v4: uuidv4 } = require("uuid");
const path = require("path");
const redis = require("../config/redis.config");
const { convertToPdf } = require("../utils/converter");

const uploadPresentation = async (req, res) => {
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
      expiresAt: new Date(
        new Date().getTime() + expiresInDays * 24 * 60 * 60 * 1000
      ),
    };

    // Store in Redis
    await redis.set(presentationId, JSON.stringify(presentation));

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
};

const getPresentation = async (req, res) => {
  try {
    const presentationJSON = await redis.get(req.params.id);

    if (!presentationJSON) {
      return res.status(404).json({ error: "Apresentação não encontrada" });
    }

    const presentation = JSON.parse(presentationJSON);

    res.json({
      ...presentation,
      fileUrl: `${process.env.BACKEND_URL}/uploads/${presentation.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadPresentation,
  getPresentation,
};


