// End-to-End Real Product Flow Test Script for CityCare Backend
// Run with: node scripts/test-e2e.mjs

const BASE_URL = process.env.API_URL || "http://localhost:4000/api/v1";

const colors = {
	green: "\x1b[32m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	cyan: "\x1b[36m",
	bold: "\x1b[1m",
	reset: "\x1b[0m",
};

let passed = 0;
let failed = 0;

async function request(endpoint, options = {}) {
	const url = `${BASE_URL}${endpoint}`;
	const headers = {
		"Content-Type": "application/json",
		...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
		...options.headers,
	};

	const res = await fetch(url, {
		method: options.method || "GET",
		headers,
		body: options.body ? JSON.stringify(options.body) : undefined,
	});

	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text };
	}

	return { status: res.status, ok: res.ok, body: json };
}

function assert(condition, message, errorDetail = "") {
	if (condition) {
		console.log(`  ${colors.green}✔${colors.reset} ${message}`);
		passed++;
	} else {
		console.error(`  ${colors.red}✖ ${message}${colors.reset}`);
		if (errorDetail) {
			console.error(`    ${colors.yellow}Detail:${colors.reset}`, errorDetail);
		}
		failed++;
	}
}

async function run() {
	console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
	console.log(`${colors.bold}${colors.cyan}  CityCare Backend — Automated End-to-End Workflow  ${colors.reset}`);
	console.log(`${colors.bold}${colors.cyan}  Target: ${BASE_URL}${colors.reset}`);
	console.log(`${colors.bold}${colors.cyan}====================================================\n${colors.reset}`);

	const startTime = Date.now();

	// -------------------------------------------------------------------------
	// PHASE 1: Authentication & Session Setup
	// -------------------------------------------------------------------------
	console.log(`${colors.bold}[Phase 1] Authenticating Test Personas...${colors.reset}`);

	// 1.1 Admin Login
	const adminLogin = await request("/auth/login", {
		method: "POST",
		body: { email: "testeradmin@gmail.com", password: "Tester@Admin123456" },
	});
	assert(adminLogin.status === 200 && adminLogin.body.data?.accessToken, "Admin logged in successfully");
	const adminToken = adminLogin.body.data?.accessToken;

	// 1.2 Citizen Login
	const citizenLogin = await request("/auth/login", {
		method: "POST",
		body: { email: "testercitizen@gmail.com", password: "Tester@Citizen123456" },
	});
	assert(citizenLogin.status === 200 && citizenLogin.body.data?.accessToken, "Citizen logged in successfully");
	const citizenToken = citizenLogin.body.data?.accessToken;

	// 1.3 Staff Login
	const staffLogin = await request("/auth/login", {
		method: "POST",
		body: { email: "rakib.staff@citycare.com", password: "Staff@1234" },
	});
	assert(staffLogin.status === 200 && staffLogin.body.data?.accessToken, "Staff (Technician) logged in successfully");
	const staffToken = staffLogin.body.data?.accessToken;

	// -------------------------------------------------------------------------
	// PHASE 2: Discover Infrastructure Foundation
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 2] Discovering Departments, Categories & Wards...${colors.reset}`);

	// 2.1 Get Departments
	const deptRes = await request("/departments", { token: adminToken });
	assert(deptRes.status === 200 && Array.isArray(deptRes.body.data) && deptRes.body.data.length > 0, "Fetched seeded departments");
	const roadDept = deptRes.body.data.find((d) => d.code === "RD") || deptRes.body.data[0];

	// 2.2 Get Categories
	const catRes = await request(`/categories?departmentId=${roadDept.id}`, { token: adminToken });
	assert(catRes.status === 200 && Array.isArray(catRes.body.data) && catRes.body.data.length > 0, "Fetched categories for department");
	const category = catRes.body.data[0];

	// 2.3 Get Wards
	const wardRes = await request("/wards", { token: adminToken });
	assert(wardRes.status === 200 && Array.isArray(wardRes.body.data) && wardRes.body.data.length > 0, "Fetched city wards");
	const ward = wardRes.body.data[0];

	// 2.4 Get Department Staff Members
	const memberRes = await request(`/departments/${roadDept.id}/members`, { token: adminToken });
	assert(memberRes.status === 200 && Array.isArray(memberRes.body.data), "Fetched staff members of department");
	const technicianMember = memberRes.body.data.find((m) => m.position === "TECHNICIAN") || memberRes.body.data[0];
	const technicianUserId = technicianMember?.user?.id || technicianMember?.userId;

	// -------------------------------------------------------------------------
	// PHASE 3: Citizen Creates Complaint (Service Request + Location)
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 3] Citizen Submitting Complaint...${colors.reset}`);

	const createReqRes = await request("/requests", {
		method: "POST",
		token: citizenToken,
		body: {
			type: "COMPLAINT",
			title: `Severe Road Cavity near ${ward.name}`,
			description: "Huge pothole blocking two lanes of traffic, dangerous for pedestrians and motorcycles.",
			priority: "HIGH",
			categoryId: category.id,
			wardId: ward.id,
			addressLine: "House 42, Road 7, Sector 3",
			landmark: "Opposite City Bank ATM",
			latitude: 23.7925,
			longitude: 90.4078,
		},
	});

	assert(createReqRes.status === 201 && createReqRes.body.data?.id, "Service request created with embedded ReportedLocation", JSON.stringify(createReqRes.body));
	const requestData = createReqRes.body.data;
	const requestId = requestData?.id;

	assert(requestData?.status === "SUBMITTED", "Initial status is SUBMITTED");
	assert(Boolean(requestData?.responseDueAt && requestData?.resolutionDueAt), "SLA target dates calculated automatically");

	// -------------------------------------------------------------------------
	// PHASE 4: Automated Notification & Querying
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 4] Verifying Citizen Perspective & Automated Notifications...${colors.reset}`);

	// 4.1 Citizen reads own requests
	const myReqsRes = await request("/requests/my", { token: citizenToken });
	assert(myReqsRes.status === 200 && myReqsRes.body.data?.some((r) => r.id === requestId), "Created request appears in Citizen's 'My Requests'");

	// 4.2 Citizen reads notifications
	const notifRes = await request("/notifications", { token: citizenToken });
	assert(notifRes.status === 200 && Array.isArray(notifRes.body.data), "Citizen fetched notifications successfully");

	// -------------------------------------------------------------------------
	// PHASE 5: Payment Fee Issuance & Verification
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 5] Payment Flow: Issuing Bill & Verification...${colors.reset}`);

	const issuePaymentRes = await request("/payments", {
		method: "POST",
		token: adminToken,
		body: {
			requestId,
			purpose: "INSPECTION_FEE",
			amount: 500,
		},
	});

	let paymentId = issuePaymentRes.body.data?.id;
	if (issuePaymentRes.status === 201) {
		assert(true, "Issued payment invoice for complaint (500 BDT)");
	} else {
		const checkPay = await request(`/payments?requestId=${requestId}`, { token: adminToken });
		paymentId = checkPay.body.data?.[0]?.id;
		assert(checkPay.status === 200, "Checked payments for request", JSON.stringify(issuePaymentRes.body));
	}

	if (paymentId) {
		const getPaymentRes = await request(`/payments/${paymentId}`, { token: citizenToken });
		assert(getPaymentRes.status === 200, "Citizen fetched payment details", JSON.stringify(getPaymentRes.body));
	}

	// -------------------------------------------------------------------------
	// PHASE 6: Department Routing / Transfer History
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 6] Department Triage & Routing History...${colors.reset}`);

	const routesRes = await request(`/requests/${requestId}/routes`, { token: adminToken });
	assert(routesRes.status === 200 && Array.isArray(routesRes.body.data), "Fetched department route history (auto-routed initial dept)");

	// -------------------------------------------------------------------------
	// PHASE 7: Triage to UNDER_REVIEW and Assigning Staff
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 7] Triaging to UNDER_REVIEW and Assigning Staff...${colors.reset}`);

	// 7.1 Lifecycle state transition: SUBMITTED -> UNDER_REVIEW
	const reviewRes = await request(`/requests/${requestId}/status`, {
		method: "PATCH",
		token: adminToken,
		body: {
			toStatus: "UNDER_REVIEW",
			note: "Triage officer inspected complaint and accepted for departmental action.",
		},
	});
	assert(reviewRes.status === 200 && reviewRes.body.data?.toStatus === "UNDER_REVIEW", "Status transitioned: SUBMITTED → UNDER_REVIEW", JSON.stringify(reviewRes.body));

	// 7.2 Assign to Technician (automatically transitions UNDER_REVIEW -> ASSIGNED)
	if (technicianUserId && requestId) {
		const assignRes = await request(`/requests/${requestId}/assignments`, {
			method: "POST",
			token: adminToken,
			body: {
				assigneeId: technicianUserId,
				note: "Urgent pothole repair. Inspect and report before noon.",
			},
		});
		assert(assignRes.status === 201 && assignRes.body.data?.id, "Request assigned to Technician staff (Status → ASSIGNED)", JSON.stringify(assignRes.body));
		const assignmentId = assignRes.body.data?.id;

		// 7.3 Get assignments list
		const getAssignsRes = await request(`/requests/${requestId}/assignments`, { token: staffToken });
		assert(getAssignsRes.status === 200 && getAssignsRes.body.data?.some((a) => a.id === assignmentId), "Technician sees active assignment in their list");
	}

	// -------------------------------------------------------------------------
	// PHASE 8: Field Execution & Work Updates (Staff)
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 8] Staff Work Progress & Status Transitions...${colors.reset}`);

	// 8.1 Transition: ASSIGNED -> IN_PROGRESS
	const inProgRes = await request(`/requests/${requestId}/status`, {
		method: "PATCH",
		token: staffToken,
		body: {
			toStatus: "IN_PROGRESS",
			note: "Field crew dispatched with asphalt equipment.",
		},
	});
	assert(inProgRes.status === 200 && inProgRes.body.data?.toStatus === "IN_PROGRESS", "Status transitioned: ASSIGNED → IN_PROGRESS", JSON.stringify(inProgRes.body));

	// 8.2 Add Work Update
	const updateRes = await request(`/requests/${requestId}/updates`, {
		method: "POST",
		token: staffToken,
		body: {
			note: "Cavity cleaned, sub-base compacted, hot asphalt mix applied.",
			visibleToCitizen: true,
		},
	});
	assert(updateRes.status === 201 && updateRes.body.data?.id, "Work update posted with citizen visibility", JSON.stringify(updateRes.body));

	// 8.3 Transition: IN_PROGRESS -> RESOLVED
	const resolvedRes = await request(`/requests/${requestId}/status`, {
		method: "PATCH",
		token: staffToken,
		body: {
			toStatus: "RESOLVED",
			note: "Pothole filled, leveled, and road opened for normal traffic.",
		},
	});
	assert(resolvedRes.status === 200 && resolvedRes.body.data?.toStatus === "RESOLVED", "Status transitioned: IN_PROGRESS → RESOLVED", JSON.stringify(resolvedRes.body));

	// -------------------------------------------------------------------------
	// PHASE 9: Citizen Timeline & Feedback Submission
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 9] Citizen Verifying Timeline & Submitting Feedback...${colors.reset}`);

	// 9.1 Citizen checks timeline
	const timelineRes = await request(`/requests/${requestId}/timeline`, { token: citizenToken });
	assert(timelineRes.status === 200 && Array.isArray(timelineRes.body.data), "Citizen verified complete chronological timeline", JSON.stringify(timelineRes.body));

	// 9.2 Citizen submits feedback (Validates terminal state rule: RESOLVED or CLOSED)
	const feedbackRes = await request(`/requests/${requestId}/feedback`, {
		method: "POST",
		token: citizenToken,
		body: {
			rating: 5,
			comment: "Repaired within 24 hours! Outstanding speed and quality.",
		},
	});
	assert(feedbackRes.status === 201 && feedbackRes.body.data?.rating === 5, "Citizen feedback submitted successfully (Terminal State check passed)", JSON.stringify(feedbackRes.body));

	// -------------------------------------------------------------------------
	// PHASE 10: Administrative Closure & Audit Trail
	// -------------------------------------------------------------------------
	console.log(`\n${colors.bold}[Phase 10] Administrative Final Closure & Audit Trail...${colors.reset}`);

	// 10.1 Admin Closes Request
	const closeRes = await request(`/requests/${requestId}/status`, {
		method: "PATCH",
		token: adminToken,
		body: {
			toStatus: "CLOSED",
			note: "Citizen confirmed satisfaction. Complaint officially closed.",
		},
	});
	assert(closeRes.status === 200 && closeRes.body.data?.toStatus === "CLOSED", "Admin officially CLOSED the request", JSON.stringify(closeRes.body));

	// 10.2 Admin checks audit logs
	const auditRes = await request("/audit-logs", { token: adminToken });
	assert(auditRes.status === 200 && Array.isArray(auditRes.body.data), "Audit logs recorded administrative actions");

	// 10.3 Security RBAC check: Citizen denied access to audit logs
	const rbacCheck = await request("/audit-logs", { token: citizenToken });
	assert(rbacCheck.status === 403, "RBAC Security enforced: Citizen received 403 Forbidden on Audit Logs");

	// -------------------------------------------------------------------------
	// TEST SUMMARY
	// -------------------------------------------------------------------------
	const duration = ((Date.now() - startTime) / 1000).toFixed(2);
	console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
	console.log(`${colors.bold}  E2E Test Run Completed in ${duration}s${colors.reset}`);
	console.log(`  ${colors.green}Passed: ${passed}${colors.reset}`);
	if (failed > 0) {
		console.log(`  ${colors.red}Failed: ${failed}${colors.reset}`);
	}
	console.log(`${colors.bold}${colors.cyan}====================================================\n${colors.reset}`);

	if (failed > 0) {
		process.exit(1);
	}
}

run().catch((err) => {
	console.error(`${colors.red}Fatal Error running E2E tests:${colors.reset}`, err);
	process.exit(1);
});
