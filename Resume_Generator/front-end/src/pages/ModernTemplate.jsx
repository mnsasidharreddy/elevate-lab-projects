import React from "react";
export default function ModernTemplate({ payload }) {
  return (
    <div className="grid grid-cols-3 gap-6 font-sans">
      <aside className="col-span-1 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-bold">Contact</h2>
        <p>{payload.personal?.email}</p>
        <p>{payload.personal?.phone}</p>
        {payload.personal?.dob && <p>DOB: {payload.personal.dob}</p>}

        <h2 className="mt-4 text-lg font-bold">Address</h2>
        <p>
          {payload.address?.line1} {payload.address?.line2}, {payload.address?.mandal},{" "}
          {payload.address?.district}, {payload.address?.state} - {payload.address?.pincode}
        </p>

        {payload.skills?.length > 0 && (
          <>
            <h2 className="mt-4 text-lg font-bold">Skills</h2>
            <ul className="list-disc list-inside text-sm">
              {payload.skills.map((s, idx) => (
                <li key={idx}>{s.name} {s.months && `(${s.months} months)`}</li>
              ))}
            </ul>
          </>
        )}
      </aside>

      <main className="col-span-2 p-4">
        <h1 className="text-3xl font-bold">
          {payload.personal?.firstName} {payload.personal?.lastName}
        </h1>

        <h2 className="mt-6 text-xl font-bold">Education</h2>
        {["school", "intermediate", "ug", "pg"].map(level =>
          (payload.education?.[level] || []).map((e, idx) => (
            <p key={idx}>
              {e.schoolName || e.collegeName || e.otherSchoolName || e.otherCollegeName} — {e.stream}{" "}
              {e.passOut && `(Pass-out: ${e.passOut})`} {e.marks && `(Marks: ${e.marks})`}
            </p>
          ))
        )}

        {payload.experiences?.length > 0 && (
          <>
            <h2 className="mt-6 text-xl font-bold">Experience</h2>
            {payload.experiences.map((x, idx) => (
              <p key={idx}>
                {x.companyName} — {x.role} {x.startDate}{" "}
                {x.endDate && !x.current ? `– ${x.endDate}` : ""} {x.current ? "(Present)" : ""}
                {x.notes && ` | Notes: ${x.notes}`}
              </p>
            ))}
          </>
        )}

        {payload.internships?.length > 0 && (
          <>
            <h2 className="mt-6 text-xl font-bold">Internships</h2>
            {payload.internships.map((i, idx) => (
              <p key={idx}>{i.name} — {i.place} {i.startDate} {i.endDate}</p>
            ))}
          </>
        )}

        {payload.certifications?.length > 0 && (
          <>
            <h2 className="mt-6 text-xl font-bold">Certifications</h2>
            {payload.certifications.map((c, idx) => (
              <p key={idx}>
                {c.name} {c.issueDate && `(Issued: ${c.issueDate})`} {c.expiryDate && `(Expires: ${c.expiryDate})`}
              </p>
            ))}
          </>
        )}

        {payload.hobbies?.length > 0 && (
          <>
            <h2 className="mt-6 text-xl font-bold">Hobbies</h2>
            <p>{payload.hobbies.map(h => h.hobby).join(", ")}</p>
          </>
        )}

        {payload.consentText && (
          <>
            <h2 className="mt-6 text-xl font-bold">Consent</h2>
            <p>{payload.consentText}</p>
          </>
        )}
      </main>
    </div>
  );
}
