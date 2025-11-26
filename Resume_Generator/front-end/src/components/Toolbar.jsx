import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function Toolbar({ onExportPdf, resumeData }) {
  const exportDocx = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: buildDocxContent(resumeData),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  return (
    <div className="flex gap-2">
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={onExportPdf}
      >
        Export PDF
      </button>
      <button
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={exportDocx}
      >
        Export DOCX
      </button>
    </div>
  );
}

function buildDocxContent(data) {
  if (!data) return [new Paragraph("No data")];
  const rows = [];

  const name = [data.personal.prefix, data.personal.firstName, data.personal.middleName, data.personal.lastName, data.personal.suffix]
    .filter(Boolean)
    .join(" ");

  rows.push(
    new Paragraph({
      children: [new TextRun({ text: name, bold: true, size: 28 })],
    })
  );

  if (data.personal.phone) rows.push(new Paragraph(`Phone: ${data.personal.phone}`));
  if (data.personal.altPhone) rows.push(new Paragraph(`Alt Phone: ${data.personal.altPhone}`));
  if (data.personal.email) rows.push(new Paragraph(`Email: ${data.personal.email}`));
  if (data.personal.altEmail) rows.push(new Paragraph(`Alt Email: ${data.personal.altEmail}`));
  if (data.personal.dob) rows.push(new Paragraph(`DOB: ${data.personal.dob}`));

  rows.push(new Paragraph(""));
  rows.push(new Paragraph({ children: [new TextRun({ text: "Address", bold: true })] }));
  rows.push(new Paragraph(data.address.line1 || ""));
  if (data.address.line2) rows.push(new Paragraph(data.address.line2));
  rows.push(new Paragraph([data.address.mandal, data.address.district, data.address.state].filter(Boolean).join(", ")));
  if (data.address.pincode) rows.push(new Paragraph(`PIN: ${data.address.pincode}`));

  rows.push(new Paragraph(""));
  const addEdu = (label, list) => {
    if (!list || list.length === 0) return;
    rows.push(new Paragraph({ children: [new TextRun({ text: label, bold: true })] }));
    list.forEach((e) => {
      const line = [e.collegeName || e.schoolName, e.universityName, e.stream, e.specialization, e.passOut, e.marksType && e.marksValue ? `${e.marksType}: ${e.marksValue}` : ""]
        .filter(Boolean)
        .join(" | ");
      rows.push(new Paragraph(line));
    });
    rows.push(new Paragraph(""));
  };
  addEdu("School", data.education?.school);
  addEdu("Intermediate", data.education?.intermediate);
  addEdu("UG", data.education?.ug);
  addEdu("PG", data.education?.pg);

  if (data.skills?.length) {
    rows.push(new Paragraph({ children: [new TextRun({ text: "Skills", bold: true })] }));
    data.skills.forEach((s) => rows.push(new Paragraph(`${s.name} — ${s.months} months`)));
    rows.push(new Paragraph(""));
  }

  if (data.experiences?.length) {
    rows.push(new Paragraph({ children: [new TextRun({ text: "Experience", bold: true })] }));
    data.experiences.forEach((ex) => {
      rows.push(new Paragraph(`${ex.companyName} | ${ex.role} | ${ex.years} years`));
      rows.push(new Paragraph(ex.current ? `Started: ${ex.startDate} (Current)` : `From ${ex.startDate} to ${ex.endDate}`));
      if (ex.notes) rows.push(new Paragraph(ex.notes));
    });
    rows.push(new Paragraph(""));
  }

  if (data.internships?.length) {
    rows.push(new Paragraph({ children: [new TextRun({ text: "Internships", bold: true })] }));
    data.internships.forEach((it) => {
      rows.push(new Paragraph(`${it.name} | ${it.place}`));
      rows.push(new Paragraph(`From ${it.startDate} to ${it.endDate}`));
      if (it.certificateNumber) rows.push(new Paragraph(`Certificate #: ${it.certificateNumber}`));
    });
    rows.push(new Paragraph(""));
  }

  if (data.certifications?.length) {
    rows.push(new Paragraph({ children: [new TextRun({ text: "Certifications", bold: true })] }));
    data.certifications.forEach((c) => {
      rows.push(new Paragraph(`${c.name} — Issued: ${c.issueDate}${c.expiryDate ? ` — Expires: ${c.expiryDate}` : ""}${c.certificateNumber ? ` — #${c.certificateNumber}` : ""}`));
    });
    rows.push(new Paragraph(""));
  }

  if (data.consentText) {
    rows.push(new Paragraph({ children: [new TextRun({ text: "Consent", bold: true })] }));
    rows.push(new Paragraph(data.consentText));
  }

  return rows;
}
