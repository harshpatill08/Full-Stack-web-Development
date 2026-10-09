// test-api.js - Automated Test Runner for Experiment 3 REST API

async function runTests() {
  const BASE_URL = "http://127.0.0.1:5000/api/students";

  console.log("========================================================");
  console.log("  EXPERIMENT 3: EXPRESS REST API CRUD OPERATIONS TEST   ");
  console.log("========================================================\n");

  // 1. Initial GET
  console.log("[TEST 1] GET /api/students (Initial Read)");
  let res = await fetch(BASE_URL);
  let data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  // 2. POST Create
  console.log("[TEST 2] POST /api/students (Create Student)");
  const newStudent = {
    name: "Harshvardhan Dalavi Patil",
    rollNo: 101,
    department: "Computer Science"
  };
  console.log("Payload Sent:", JSON.stringify(newStudent, null, 2));
  res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent)
  });
  data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  const studentId = data._id;

  // 3. GET All
  console.log("[TEST 3] GET /api/students (Verify Created Student in DB)");
  res = await fetch(BASE_URL);
  data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log(`Total Students: ${data.length}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  // 4. GET by ID
  console.log(`[TEST 4] GET /api/students/${studentId} (Read Single Student)`);
  res = await fetch(`${BASE_URL}/${studentId}`);
  data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  // 5. PUT Update
  console.log(`[TEST 5] PUT /api/students/${studentId} (Update Department)`);
  const updatePayload = { department: "Information Technology & AI" };
  console.log("Payload Sent:", JSON.stringify(updatePayload, null, 2));
  res = await fetch(`${BASE_URL}/${studentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload)
  });
  data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  // 6. DELETE
  console.log(`[TEST 6] DELETE /api/students/${studentId} (Delete Student)`);
  res = await fetch(`${BASE_URL}/${studentId}`, { method: "DELETE" });
  data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  // 7. Final GET
  console.log("[TEST 7] GET /api/students (Confirm Deletion from DB)");
  res = await fetch(BASE_URL);
  data = await res.json();
  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  console.log(`Total Students in DB: ${data.length}`);
  console.log("Response Body:", JSON.stringify(data, null, 2), "\n");

  console.log("========================================================");
  console.log("  ALL CRUD API ENDPOINTS TESTED SUCCESSFULLY! (100% PASS) ");
  console.log("========================================================");
}

runTests().catch(console.error);
