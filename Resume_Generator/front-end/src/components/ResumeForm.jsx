import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import schoolsData from "../data/schools.json";
import collegesData from "../data/colleges.json";
import boardsData from "../data/boards.json";
import streamsData from "../data/streams.json";
import specializationsData from "../data/specializations.json";
import universitiesData from "../data/universities.json";
import statesData from "../data/states.json";

async function fileToBase64(file) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const required = (val) => (val ? "" : "This field is required.");
const validEmail = (val) =>
  !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Enter a valid email.";
const validTel = (val) =>
  !val || /^[0-9+\-() ]{7,15}$/.test(val) ? "" : "Enter a valid phone number.";

export default function ResumeForm({ onSubmit }) {
  const [errors, setErrors] = useState({});
  const fieldError = (path) => errors[path];
  const setFieldError = (path, message) =>
    setErrors((prev) => ({ ...prev, [path]: message || undefined }));

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    altPhone: "",
    altEmail: "",
    dob: "",
    photo: null,
  });

  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    district: "",
    mandal: "",
    state: "",
    pincode: "",
  });

  const [consentText, setConsentText] = useState("");
  const [signature, setSignature] = useState(null);
  const [schools, setSchools] = useState([]);
  const [intermediates, setIntermediates] = useState([]);
  const [ugs, setUgs] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const addItem = (setter, template) =>
    setter((arr) => [...arr, { id: uuid(), ...template }]);
  const removeItem = (setter, id) =>
    setter((arr) => arr.filter((item) => item.id !== id));
  const updateListItem = (setter, list, id, patch) =>
    setter(list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const isBlocked = {
    intermediate: schools.some((s) => s.current),
    ug: schools.some((s) => s.current) || intermediates.some((i) => i.current),
    pg:
      schools.some((s) => s.current) ||
      intermediates.some((i) => i.current) ||
      ugs.some((u) => u.current),
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setFieldError("personal.firstName", required(personal.firstName));
    setFieldError("personal.lastName", required(personal.lastName));
    setFieldError("personal.phone", required(personal.phone) || validTel(personal.phone));
    setFieldError("personal.email", required(personal.email) || validEmail(personal.email));
    setFieldError("address.line1", required(address.line1));

    if (personal.email && personal.altEmail) {
      if (personal.email === personal.altEmail) {
        setFieldError("personal.altEmail", "Alternate email cannot be the same as primary email.");
      } else {
       setFieldError("personal.altEmail", "");
      }
    }

    if (personal.phone && personal.altPhone) {
      if (personal.phone === personal.altPhone) {
        setFieldError("personal.altPhone", "Alternate phone cannot be the same as primary phone.");
      } else {
        setFieldError("personal.altPhone", "");
      }
    }
 
    const currentErrors = {
    firstName: required(personal.firstName),
    lastName: required(personal.lastName),
    phone: required(personal.phone) || validTel(personal.phone),
    email: required(personal.email) || validEmail(personal.email),
    line1: required(address.line1),
  };

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    const photoB64 = await fileToBase64(personal.photo);
    const signatureB64 = await fileToBase64(signature);


    const payload = {
      personal: { ...personal, photo: photoB64 },
      address,
      consentText,
      signature: signatureB64,
      education: { school: schools, intermediate: intermediates, ug: ugs, pg: pgs },
      skills,
      hobbies,
      internships,
      certifications,
      experiences,
    };
    onSubmit(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8">
        <Section title="Personal details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Input label="First name" required value={personal.firstName}
              onChange={(v) => setPersonal({ ...personal, firstName: v })}
              error={fieldError("personal.firstName")} />
            <Input label="Last name" required value={personal.lastName}
              onChange={(v) => setPersonal({ ...personal, lastName: v })}
              error={fieldError("personal.lastName")} />
            <Input label="Phone number" type="tel" required value={personal.phone}
              onChange={(v) => setPersonal({ ...personal, phone: v })}
              error={fieldError("personal.phone")} />
            <Input label="Email" type="email" required value={personal.email}
              onChange={(v) => setPersonal({ ...personal, email: v })}
              error={fieldError("personal.email")} />
            <Input label="Alternate phone" type="tel" value={personal.altPhone}
              onChange={(v) => setPersonal({ ...personal, altPhone: v })}
              error={fieldError("personal.altPhone")} />
            <Input label="Alternate email" type="email" value={personal.altEmail}
              onChange={(v) => setPersonal({ ...personal, altEmail: v })}
              error={fieldError("personal.altEmail")} />
            <Input label="Date of birth" type="date" value={personal.dob}
              onChange={(v) => setPersonal({ ...personal, dob: v })} />
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1">Passport size photo</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPersonal({ ...personal, photo: e.target.files[0] })}
                />
              </div>
                 {personal.photo && (
                 <img src={URL.createObjectURL(personal.photo)} alt="Passport preview"
                    className="w-28 h-auto object-contain border rounded shadow"
                 />
                  )}
             </div>
          </div>
        </Section>
        <Section title="Address">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Input label="Address line 1" required value={address.line1}
              onChange={(v) => setAddress({ ...address, line1: v })}
              error={fieldError("address.line1")} />
            <Input label="Address line 2" value={address.line2}
              onChange={(v) => setAddress({ ...address, line2: v })} />
            <Input label="District" value={address.district}
              onChange={(v) => setAddress({ ...address, district: v })} />
            <Input label="Mandal" value={address.mandal}
              onChange={(v) => setAddress({ ...address, mandal: v })} />
            <Select label="State" value={address.state}
              onChange={(v) => setAddress({ ...address, state: v })}
              options={statesData.States} />
            <Input label="Pincode" value={address.pincode}
              onChange={(v) => setAddress({ ...address, pincode: v })} />
          </div>
        </Section>

        <EducationSection title="School" items={schools}
          onAdd={() => addItem(setSchools, { schoolName: "", board: "", address: "", passOut: "", current: false, marks:"" })}
          onRemove={(id) => removeItem(setSchools, id)}
          render={(item) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <Select label="School name" value={item.schoolName}
                onChange={(v) => updateListItem(setSchools, schools, item.id, { schoolName: v })}
                options={schoolsData.Schools}
              />
              {item.schoolName === "other" && (
               <Input label="Enter your school name" value={item.otherSchoolName || ""}
                 onChange={(v) =>updateListItem(setSchools, schools, item.id, { otherSchoolName: v })}
               />
              )}
              <Select label="Board" value={item.board}
                onChange={(v) => updateListItem(setSchools, schools, item.id, { board: v })} 
                options={boardsData["secondary"]}
              />
              {item.board === "Other" && (
                <Input label="Enter your board" value={item.otherBoard || ""}
                  onChange={(v) => updateListItem(setSchools, schools, item.id, { otherBoard: v })}
                />
              )}
              <Input label="Address" value={item.address}
                onChange={(v) => updateListItem(setSchools, schools, item.id, { address: v })} />
              <Input label="Marks" value={item.marks}
                onChange={(v) => updateListItem(setSchools, schools, item.id, { marks: v })} />
              <MonthPicker label="Pass-out" value={item.passOut}
                onChange={(v) => updateListItem(setSchools, schools, item.id, { passOut: v })} />
              <Checkbox label="Currently studying" checked={item.current}
                onChange={(v) => updateListItem(setSchools, schools, item.id, { current: v })} />
            </div>
          )}
        />

                {!isBlocked.intermediate && (
          <EducationSection title="Intermediate" items={intermediates}
            onAdd={() => addItem(setIntermediates, { collegeName: "", stream: "", address: "", passOut: "", current: false , marks: ""})}
            onRemove={(id) => removeItem(setIntermediates, id)}
            render={(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Select label="College name" value={item.collegeName}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { collegeName: v })} 
                  options={collegesData["Intermediate Colleges"]}
                />
                {item.collegeName === "Other Intermediate Colleges" && (
                 <Input label="Enter your intermediate college name" value={item.otherCollegeName || ""}
                    onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { otherCollegeName: v })}
                  />
                )}
                <Select label="Board" value={item.board}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { board: v })}
                  options={boardsData["intermediate"]} 
                />
                {item.board === "Other" && (
                  <Input label="Enter your board" value={item.otherBoard || ""}
                    onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { otherBoard: v })}
                  />
                )}
                <Select label="Stream" value={item.stream}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { stream: v })} 
                  options={streamsData["intermediate"]}
                />
                {item.stream === "Other" && (
                 <Input label="Enter your stream" value={item.otherStream || ""}
                   onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { otherStream: v })}
                 />
                )}
                <Select label="Specialization" value={item.specialization}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { specialization: v })}
                  options={[
                    ...specializationsData.Arts,
                    ...specializationsData.Science,
                    ...specializationsData.Commerce,
                    ...specializationsData.Vocational
                  ]}
               />
               {item.specialization === "Other" && (
                  <Input label="Enter your specialization" value={item.otherSpecialization || ""}
                    onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { otherSpecialization: v })}
                 />
               )}
                <Input label="Address" value={item.address}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { address: v })} />
                <Input label="Marks" value={item.marks}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { marks: v })} />
                <MonthPicker label="Pass-out" value={item.passOut}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { passOut: v })} />
                <Checkbox label="Currently studying" checked={item.current}
                  onChange={(v) => updateListItem(setIntermediates, intermediates, item.id, { current: v })} />
              </div>
            )}
          />
        )}

        {!isBlocked.ug && (
          <EducationSection title="UG" items={ugs}
           onAdd={() => addItem(setUgs, { collegeName: "", university: "", stream: "", specialization: "", address: "", passOut: "", current: false, marks:"" })}
           onRemove={(id) => removeItem(setUgs, id)}
           render={(item) => (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <Select label="College name (UG)" value={item.collegeName}
                 onChange={(v) => updateListItem(setUgs, ugs, item.id, { collegeName: v })}
                 options={collegesData["UG Colleges"]}
               />
              {item.collegeName === "Other UG Colleges" && (
              <Input label="Enter your UG college name" value={item.otherCollegeName || ""}
                 onChange={(v) => updateListItem(setUgs, ugs, item.id, { otherCollegeName: v })}
              />
            )}
            <Select label="University" value={item.university}
              onChange={(v) => updateListItem(setUgs, ugs, item.id, { university: v })}
              options={[
                ...universitiesData["Central Universities"],
                ...universitiesData["Deemed Universities"],
                ...universitiesData["Private Universities"],
                ...universitiesData["State Universities"]
              ]}
           />
           {item.university === "other" && (
              <Input label="Enter your university" value={item.otherUniversity || ""}
                onChange={(v) => updateListItem(setUgs, ugs, item.id, { otherUniversity: v })}
              />
            )}
            <Select label="Stream" value={item.stream}
             onChange={(v) => updateListItem(setUgs, ugs, item.id, { stream: v })}
             options={streamsData.undergraduate}
            />
           {item.stream === "Other" && (
             <Input label="Enter your stream" value={item.otherStream || ""}
               onChange={(v) => updateListItem(setUgs, ugs, item.id, { otherStream: v })}
             />
           )}
           <Select label="Specialization" value={item.specialization}
              onChange={(v) => updateListItem(setUgs, ugs, item.id, { specialization: v })}
                options={[
                ...specializationsData["B.Tech"],
                ...specializationsData["B.Arch"],
                ...specializationsData["B.Sc"],
                ...specializationsData["B.Com"],
                ...specializationsData["B.A"]
              ]}
           />
           {item.specialization === "Other" && (
              <Input label="Enter your specialization" value={item.otherSpecialization || ""}
                onChange={(v) => updateListItem(setUgs, ugs, item.id, { otherSpecialization: v })}
             />
           )}
           <Input label="Address" value={item.address}
              onChange={(v) => updateListItem(setUgs, ugs, item.id, { address: v })} />
           <Input label="Marks" value={item.marks}
              onChange={(v) => updateListItem(setUgs, ugs, item.id, { marks: v })} />
           <MonthPicker label="Pass-out" value={item.passOut}
              onChange={(v) => updateListItem(setUgs, ugs, item.id, { passOut: v })} />
           <Checkbox label="Currently studying" checked={item.current}
              onChange={(v) => updateListItem(setUgs, ugs, item.id, { current: v })} />
         </div>
       )}
     />
   )}

  {!isBlocked.pg && (
  <EducationSection title="PG" items={pgs}
    onAdd={() => addItem(setPgs, { collegeName: "", university: "", stream: "", specialization: "", address: "", passOut: "", current: false, marks: "" })}
    onRemove={(id) => removeItem(setPgs, id)}
    render={(item) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <Select label="College name (PG)" value={item.collegeName}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { collegeName: v })}
          options={collegesData["PG Colleges"]}
        />
        {item.collegeName === "Other PG Colleges" && (
          <Input label="Enter your PG college name" value={item.otherCollegeName || ""}
            onChange={(v) => updateListItem(setPgs, pgs, item.id, { otherCollegeName: v })}
          />
        )}

        <Select label="University" value={item.university}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { university: v })}
          options={[
            ...universitiesData["Central Universities"],
            ...universitiesData["Deemed Universities"],
            ...universitiesData["Private Universities"],
            ...universitiesData["State Universities"]
          ]}
        />
        {item.university === "other" && (
          <Input label="Enter your university" value={item.otherUniversity || ""}
            onChange={(v) => updateListItem(setPgs, pgs, item.id, { otherUniversity: v })}
          />
        )}

        <Select label="Stream" value={item.stream}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { stream: v })}
          options={streamsData.postgraduate}
        />
        {item.stream === "Other" && (
          <Input label="Enter your stream" value={item.otherStream || ""}
            onChange={(v) => updateListItem(setPgs, pgs, item.id, { otherStream: v })}
          />
        )}

        <Select label="Specialization" value={item.specialization}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { specialization: v })}
          options={[
            ...specializationsData.MBA,
            ...specializationsData["M.Tech"],
            ...specializationsData["M.Sc"],
            ...specializationsData.Medicine,
            ...specializationsData.Law,
            ...specializationsData["Journalism & Mass Communication"],
            ...specializationsData["Social Work"]
          ]}
        />
        {item.specialization === "Other" && (
          <Input label="Enter your specialization" value={item.otherSpecialization || ""}
            onChange={(v) => updateListItem(setPgs, pgs, item.id, { otherSpecialization: v })}
          />
        )}

        <Input label="Address" value={item.address}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { address: v })} />
        <Input label="Marks" value={item.marks}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { marks: v })} />
        <MonthPicker label="Pass-out" value={item.passOut}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { passOut: v })} />
        <Checkbox label="Currently studying" checked={item.current}
          onChange={(v) => updateListItem(setPgs, pgs, item.id, { current: v })} />
      </div>
    )}
  />
)}

        <Section title="Skills">
          <DynamicList
            items={skills}
            onAdd={() => addItem(setSkills, { name: "", months: "" })}
            onRemove={(id) => removeItem(setSkills, id)}
            render={(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Input label="Skill name" value={item.name}
                  onChange={(v) => updateListItem(setSkills, skills, item.id, { name: v })} />
                <Input label="Experience (months)" type="number" value={item.months}
                  onChange={(v) => updateListItem(setSkills, skills, item.id, { months: v })} />
              </div>
            )}
          />
        </Section>

        <Section title="Hobbies (optional)">
          <DynamicList
            items={hobbies}
            onAdd={() => addItem(setHobbies, { hobby: "" })}
            onRemove={(id) => removeItem(setHobbies, id)}
            render={(item) => (
              <Input label="Hobby" value={item.hobby}
                onChange={(v) => updateListItem(setHobbies, hobbies, item.id, { hobby: v })} />
            )}
          />
        </Section>

        <Section title="Internships">
          <DynamicList
            items={internships}
            onAdd={() => addItem(setInternships, { name: "", place: "", startDate: "", endDate: "", certificateNumber: "" })}
            onRemove={(id) => removeItem(setInternships, id)}
            render={(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Input label="Internship name" value={item.name}
                  onChange={(v) => updateListItem(setInternships, internships, item.id, { name: v })} />
                <Input label="Place" value={item.place}
                  onChange={(v) => updateListItem(setInternships, internships, item.id, { place: v })} />
                <DatePicker label="Start date" value={item.startDate}
                  onChange={(v) => updateListItem(setInternships, internships, item.id, { startDate: v })} />
                <DatePicker label="End date" value={item.endDate}
                  onChange={(v) => updateListItem(setInternships, internships, item.id, { endDate: v })} />
                <Input label="Certificate number" value={item.certificateNumber}
                  onChange={(v) => updateListItem(setInternships, internships, item.id, { certificateNumber: v })} />
              </div>
            )}
          />
        </Section>

        <Section title="Certifications">
          <DynamicList
            items={certifications}
            onAdd={() => addItem(setCertifications, { name: "", issueDate: "", expiryDate: "", certificateNumber: "" })}
            onRemove={(id) => removeItem(setCertifications, id)}
            render={(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Input label="Certificate name" value={item.name}
                  onChange={(v) => updateListItem(setCertifications, certifications, item.id, { name: v })} />
                <DatePicker label="Issue date" value={item.issueDate}
                  onChange={(v) => updateListItem(setCertifications, certifications, item.id, { issueDate: v })} />
                <DatePicker label="Expiry date" value={item.expiryDate}
                  onChange={(v) => updateListItem(setCertifications, certifications, item.id, { expiryDate: v })} />
                <Input label="Certificate number" value={item.certificateNumber}
                  onChange={(v) => updateListItem(setCertifications, certifications, item.id, { certificateNumber: v })} />
              </div>
            )}
          />
        </Section>

        <Section title="Experiences">
          <DynamicList
            items={experiences}
            onAdd={() =>
              addItem(setExperiences, {
                companyName: "",
                role: "",
                startDate: "",
                endDate: "",
                current: false,
                notes: "",
              })
            }
            onRemove={(id) => removeItem(setExperiences, id)}
            render={(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Input
                  label="Company name"
                  value={item.companyName}
                  onChange={(v) =>
                    updateListItem(setExperiences, experiences, item.id, {
                      companyName: v,
                    })
                  }
                />
                <Input
                  label="Role"
                  value={item.role}
                  onChange={(v) =>
                    updateListItem(setExperiences, experiences, item.id, {
                      role: v,
                    })
                  }
                />
                <DatePicker
                  label="Start date"
                  value={item.startDate}
                  onChange={(v) =>
                    updateListItem(setExperiences, experiences, item.id, {
                      startDate: v,
                    })
                  }
                />
                {!item.current && (
                  <DatePicker
                    label="End date"
                    value={item.endDate}
                    onChange={(v) =>
                      updateListItem(setExperiences, experiences, item.id, {
                        endDate: v,
                      })
                    }
                  />
                )}
                <Checkbox
                  label="Current company"
                  checked={item.current}
                  onChange={(v) =>
                    updateListItem(setExperiences, experiences, item.id, {
                      current: v,
                    })
                  }
                />
                <TextArea
                  label="Notes (optional)"
                  value={item.notes}
                  onChange={(v) =>
                    updateListItem(setExperiences, experiences, item.id, {
                      notes: v,
                    })
                  }
                />
              </div>
            )}
          />
        </Section>

        <Section title="Consent">
          <TextArea
            label="Consent note (optional)"
            placeholder='e.g., "All the above information is true as per my knowledge..."'
            value={consentText}
            onChange={(v) => setConsentText(v)}
          />
        </Section>

        <Section title="Signature (optional)">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Upload signature (PNG/JPG/WEBP, max 5MB)
              </label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={(e) => setSignature(e.target.files?.[0] || null)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            {signature && (
              <img
                src={URL.createObjectURL(signature)}
                alt="Signature preview"
                className="w-28 h-auto object-contain border rounded shadow"
              />
            )}
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow hover:from-yellow-500 hover:to-orange-600"
          >
            Show Resume Templates
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b font-semibold">
        {title}
      </div>
      <div className="p-5 md:p-6 space-y-4">{children}</div>
    </div>
  );
}

function EducationSection({ title, items, onAdd, onRemove, render }) {
  return (
    <div className="border rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="font-semibold">{title}</div>
        <button
          type="button"
          className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
          onClick={onAdd}
        >
          + Add Section
        </button>
      </div>
      <div className="p-5 md:p-6 space-y-4">
        {items?.length === 0 && (
          <div className="text-sm text-gray-600">
            No sections added yet. Click “+ Add Section”.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white/70">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => onRemove(item.id)}
              >
                Delete Section
              </button>
            </div>
            {render(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function DynamicList({ items, onAdd, onRemove, render }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
          onClick={onAdd}
        >
          + Add
        </button>
      </div>
      {items?.length === 0 && (
        <div className="text-sm text-gray-600">No items added.</div>
      )}
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 bg-white/70">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={() => onRemove(item.id)}
            >
              Delete
            </button>
          </div>
          {render(item)}
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false, placeholder, error }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label}{required ? " *" : ""}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && (
        <div className="mt-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded px-2 py-1">
          {error}
        </div>
      )}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
    </div>
  );
}

function Select({ label, value, onChange, options = [], required = false, error }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label}{required ? " *" : ""}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      {error && (
        <div className="mt-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded px-2 py-1">
          {error}
        </div>
      )}
    </div>
  );
}

function MonthPicker({ label, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function DatePicker({ label, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      <label className="text-sm">{label}</label>
    </div>
  );
}
