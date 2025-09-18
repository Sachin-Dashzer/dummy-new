import fetch from "node-fetch";

async function run() {
  try {
    let ok = true;

    const health = await fetch("http://localhost:3000/api/health");
    if (!health.ok) { console.error("❌ Health failed"); ok = false; }

    const patients = await fetch("http://localhost:3000/api/patients");
    if (patients.status !== 401) { console.error("❌ Auth guard failed"); ok = false; }

    if (!ok) process.exit(1);
    console.log("✅ Smoke tests passed");
  } catch (e) {
    console.error("❌ Smoke error", e.message);
    process.exit(1);
  }
}
run();
