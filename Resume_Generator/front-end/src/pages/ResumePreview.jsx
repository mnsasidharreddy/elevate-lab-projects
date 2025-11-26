import React, { useMemo, useState } from "react";
import ClassicTemplate from "./ClassicTemplate.jsx";
import ModernTemplate from "./ModernTemplate.jsx";
import CompactTemplate from "./CompactTemplate.jsx";

export default function ResumePreview({ payload, onBack }) {
  const [templateId, setTemplateId] = useState("template-classic");
  const [aiText, setAiText] = useState("");
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");

  const TemplateComponent = useMemo(() => {
    switch (templateId) {
      case "template-modern":
        return ModernTemplate;
      case "template-compact":
        return CompactTemplate;
      default:
        return ClassicTemplate;
    }
  }, [templateId]);


const downloadPdf = async () => {
  const res = await fetch("http://localhost:5000/api/export/pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ payload, pageSize, orientation }),
});
  if (!res.ok) throw new Error("Failed to generate PDF");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
  URL.revokeObjectURL(url);
};

const downloadDocx = async () => {
  const res = await fetch("http://localhost:5000/api/export/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload, pageSize, orientation }),
  });
  if (!res.ok) throw new Error("Failed to generate DOCX");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.docx";
  a.click();
  URL.revokeObjectURL(url);
};

const getSuggestions = async () => {
  const res = await fetch("http://localhost:5000/api/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
  if (!res.ok) throw new Error("Failed to fetch AI suggestions");
  const data = await res.json();
  setAiText(data.suggestions || "No suggestions received.");
};

const saveResume = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, templateId }),
    });
    if (!res.ok) throw new Error("Failed to save resume");
    const data = await res.json();
    alert(data.ok ? `Resume saved! ID: ${data.id}` : "Save failed");
  } catch (err) {
    console.error(err);
    alert("Error saving resume.");
  }
};


  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setTemplateId("template-classic")}
          className={`px-4 py-2 rounded ${
            templateId === "template-classic" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Classic
        </button>
        <button
          onClick={() => setTemplateId("template-modern")}
          className={`px-4 py-2 rounded ${
            templateId === "template-modern" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Modern
        </button>
        <button
          onClick={() => setTemplateId("template-compact")}
          className={`px-4 py-2 rounded ${
            templateId === "template-compact" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Compact
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Orientation</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg bg-white p-6 shadow">
        <TemplateComponent payload={payload} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">
          Back
        </button>
        <button type="button" onClick={getSuggestions} className="px-4 py-2 bg-indigo-600 text-white rounded">
          AI Suggestions
        </button>
        <button type="button" onClick={saveResume} className="px-4 py-2 bg-green-600 text-white rounded">
          Save
        </button>
        <button type="button" onClick={downloadPdf} className="px-4 py-2 bg-red-600 text-white rounded">
          Download PDF
        </button>
        <button type="button" onClick={downloadDocx} className="px-4 py-2 bg-yellow-600 text-black rounded">
          Download DOCX
        </button>
      </div>

      {aiText && (
        <div className="border rounded bg-indigo-50 p-4 whitespace-pre-wrap">
          {aiText}
        </div>
      )}
    </div>
  );
}
