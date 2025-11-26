import express from "express";
import cors from "cors";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun } from "docx";
import OpenAI from "openai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Resume from "./models/Resume.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Resume Maker backend is running. Use /api/export/pdf, /api/export/docx, /api/suggestions, or /api/resumes.");
});

app.get("/api/resumes/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ ok: false, error: "Resume not found" });
    res.json({ ok: true, resume });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch resume" });
  }
});

const pdfPageSizeMap = { A4: "A4", Letter: "Letter", Legal: "Legal" };
const docxSizeMap = {
  A4: { width: 11900, height: 16840 },
  Letter: { width: 12240, height: 15840 },
  Legal: { width: 12240, height: 20160 },
};

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.post("/api/suggestions", async (req, res) => {
  try {
    const { payload } = req.body;
    if (!openai) return res.status(500).json({ error: "OpenAI API key missing" });

    const prompt = `Suggest improvements for this resume:\n${JSON.stringify(payload, null, 2)}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestions = completion.choices?.[0]?.message?.content || "No suggestions.";
    res.json({ suggestions });
  } catch (err) {
    console.error("AI Suggestions error:", err);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

app.post("/api/resumes", async (req, res) => {
  try {
    const { payload, templateId } = req.body;
    if (!payload) {
      return res.status(400).json({ ok: false, error: "Missing payload" });
    }

    const resume = new Resume({ payload, templateId });
    await resume.save();

    res.json({ ok: true, id: resume._id });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ ok: false, error: "Failed to save resume" });
  }
});

app.post("/api/export/pdf", (req, res) => {
  try {
    const { payload, pageSize = "A4", orientation = "portrait" } = req.body;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

    const doc = new PDFDocument({
      size: pdfPageSizeMap[pageSize] || "A4",
      layout: orientation === "landscape" ? "landscape" : "portrait",
      margin: 50,
    });

app.post("/api/resumes", async (req, res) => {
  try {
    const { payload, templateId } = req.body;
    if (!payload) {
      return res.status(400).json({ ok: false, error: "Missing payload" });
    }

    const resume = new Resume({ payload, templateId });
    await resume.save();

    res.json({ ok: true, id: resume._id });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ ok: false, error: "Failed to save resume" });
  }
});

    doc.pipe(res);
    doc.fontSize(20).text(`${payload?.personal?.firstName || ""} ${payload?.personal?.lastName || ""}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Email: ${payload?.personal?.email || ""}`);
    doc.text(`Phone: ${payload?.personal?.phone || ""}`);
    doc.moveDown();

    doc.fontSize(16).text("Education", { underline: true });
    Object.values(payload?.education || {}).forEach((list) => {
      (list || []).forEach((e) => {
        const name = e.schoolName || e.collegeName || e.otherSchoolName || e.otherCollegeName || "";
        const stream = e.stream || e.otherStream || "";
        const passOut = e.passOut ? ` (${e.passOut})` : "";
        doc.fontSize(12).text(`${name}${stream ? " — " + stream : ""}${passOut}`);
      });
    });

    if ((payload?.skills || []).length) {
      doc.moveDown();
      doc.fontSize(16).text("Skills", { underline: true });
      (payload.skills || []).forEach((s) => {
        doc.fontSize(12).text(`${s.name}${s.months ? ` (${s.months}m)` : ""}`);
      });
    }

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.post("/api/export/docx", async (req, res) => {
  try {
    const { payload, pageSize = "A4", orientation = "portrait" } = req.body;

    const page = docxSizeMap[pageSize] || docxSizeMap.A4;
    const landscape = orientation === "landscape";

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: landscape ? "landscape" : "portrait",
                width: landscape ? page.height : page.width,
                height: landscape ? page.width : page.height,
              },
              margin: { top: 720, right: 720, bottom: 720, left: 720 },
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${payload?.personal?.firstName || ""} ${payload?.personal?.lastName || ""}`, bold: true, size: 32 })],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun(`Email: ${payload?.personal?.email || ""}`),
                new TextRun(" | "),
                new TextRun(`Phone: ${payload?.personal?.phone || ""}`),
              ],
            }),
            new Paragraph({ children: [new TextRun({ text: "Education", bold: true, underline: {} })] }),
            ...(Object.values(payload?.education || {}).flat().map((e) => {
              const name = e.schoolName || e.collegeName || e.otherSchoolName || e.otherCollegeName || "";
              const stream = e.stream || e.otherStream || "";
              const passOut = e.passOut ? ` (${e.passOut})` : "";
              return new Paragraph({ children: [new TextRun(`${name}${stream ? " — " + stream : ""}${passOut}`)] });
            })),
            ...(Array.isArray(payload?.skills) && payload.skills.length
              ? [
                  new Paragraph({ children: [new TextRun({ text: "Skills", bold: true, underline: {} })] }),
                  ...payload.skills.map(
                    (s) => new Paragraph({ children: [new TextRun(`${s.name}${s.months ? ` (${s.months}m)` : ""}`)] })
                  ),
                ]
              : []),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", "attachment; filename=resume.docx");
    res.send(buffer);
  } catch (err) {
    console.error("DOCX export error:", err);
    res.status(500).json({ error: "Failed to generate DOCX" });
  }
});

app.post("/api/resumes", (req, res) => {
  try {
    const { payload, templateId } = req.body;
    if (!payload) {
      return res.status(400).json({ ok: false, error: "Missing payload" });
    }

    res.json({ ok: true, id: Date.now().toString(), templateId });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ ok: false, error: "Failed to save resume" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
