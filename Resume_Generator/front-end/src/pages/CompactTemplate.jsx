import React from "react";
export default function CompactTemplate({ payload }) {
  return (
    <div className="p-4 text-sm font-sans">
      <h1 className="text-lg font-bold">
        {payload.personal?.firstName} {payload.personal?.lastName}
      </h1>
      <p>{payload.personal?.email} | {payload.personal?.phone}</p>
      {payload.personal?.dob && <p>DOB: {payload.personal.dob}</p>}

      <p>
        {payload.address?.line1} {payload.address?.line2}, {payload.address?.mandal},{" "}
        {payload.address?.district}, {payload.address?.state} - {payload.address?.pincode}
      </p>

      <h2 className="mt-4 font-bold">Education</h2>
      {["school", "intermediate", "ug", "pg"].map(level =>
        (payload.education?.[level] || []).map((e, idx) => (
          <p key={idx}>
            {e.schoolName || e.collegeName || e.otherSchoolName || e.otherCollegeName} — {e.stream}{" "}
            {e.passOut && `(Pass-out: ${e.passOut})`} {e.marks && `(Marks: ${e.marks})`}
          </p>
        ))
      )}

      {payload.skills?.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Skills</h2>
          <p>{payload.skills.map(s => `${s.name}${s.months ? ` (${s.months}m)` : ""}`).join(", ")}</p>
        </>
      )}

      {payload.experiences?.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Experience</h2>
          {payload.experiences.map((x, idx) => (
            <p key={idx}>
              {x.companyName} — {x.role} {x.startDate}{" "}
              {x.endDate && !x.current ? `– ${x.endDate}` : ""} {x.current ? "(Present)" : ""}
              {x.notes && ` | ${x.notes}`}
            </p>
          ))}
        </>
      )}

      {payload.internships?.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Internships</h2>
          {payload.internships.map((i, idx) => (
            <p key={idx}>{i.name} — {i.place} {i.startDate} {i.endDate}</p>
          ))}
        </>
      )}

      {payload.certifications?.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Certifications</h2>
          {payload.certifications.map((c, idx) => (
            <p key={idx}>
              {c.name} {c.issueDate && `(Issued: ${c.issueDate})`} {c.expiryDate && `(Expires: ${c.expiryDate})`}
            </p>
          ))}
        </>
      )}

      {payload.hobbies?.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Hobbies</h2>
          <p>{payload.hobbies.map(h => h.hobby).join(", ")}</p>
        </>
      )}

      {payload.consentText && (
        <>
          <h2 className="mt-4 font-bold">Consent</h2>
          <p>{payload.consentText}</p>
        </>
      )}
    </div>
  );
}
