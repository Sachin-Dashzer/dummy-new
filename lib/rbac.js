export const PATIENT_WRITE_FIELDS = {
  Agent: ["personal", "medical"],
  Counsellor: ["counselling"],
  Admin: ["personal", "medical", "counselling", "surgery", "payments", "ops"],
};

export const PATIENT_READ_FIELDS = {
  Agent: ["personal", "medical", "ops"],
  Counsellor: ["personal", "counselling", "ops"],
  Admin: [], // all
};

export function filterWritable(role, payload) {
  if (role === "Admin") return payload;
  const allowed = new Set(PATIENT_WRITE_FIELDS[role] || []);
  const cleaned = {};
  for (const key of Object.keys(payload)) {
    if (allowed.has(key)) cleaned[key] = payload[key];
  }
  return cleaned;
}

export function projectionFor(role) {
  const fields = PATIENT_READ_FIELDS[role];
  if (!fields || fields.length === 0) return {}; // show all
  const proj = {};
  for (const f of fields) proj[f] = 1;
  return proj;
}
