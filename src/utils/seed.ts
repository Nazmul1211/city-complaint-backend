import bcrypt from "bcryptjs";
import {
	StaffPosition,
	UserRole,
	UserStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../app/lib/prisma";
import config from "../app/config";

const activateIfPending = async (email: string) => {
	await prisma.user.updateMany({
		where: {
			email,
			status: UserStatus.PENDING_VERIFICATION,
		},
		data: {
			status: UserStatus.ACTIVE,
			emailVerified: true,
		},
	});
};

export const seedSuperAdmin = async () => {
	try {
		const isSuperAdminExists = await prisma.user.findFirst({
			where: {
				role: UserRole.SUPER_ADMIN,
			},
		});

		if (isSuperAdminExists) {
			console.log("Super Admin Exists!");
			await activateIfPending(config.super_admin_email);
			return;
		}

		const name = config.super_admin_name;
		const email = config.super_admin_email;
		const password = config.super_admin_password;

		if (!name || !email || !password) {
			throw new Error(
				"Super Admin Name, Email and Password are missing in env file!",
			);
		}

		const hashPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const superAdmin = await prisma.user.create({
			data: {
				name: name,
				email: email,
				password: hashPassword,
				role: UserRole.SUPER_ADMIN,
				status: UserStatus.ACTIVE,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Super Admin Created :", superAdmin);
	} catch (error) {
		console.log("Error seeding super admin: ", error);

		await prisma.user.delete({
			where: {
				email: config.super_admin_email,
			},
		});
	}
};

// Create Tester Admin

export const seedTesterAdmin = async () => {
	try {
		const isTesterAdminExists = await prisma.user.findUnique({
			where: {
				email: config.tester_admin_email,
			},
		});

		if (isTesterAdminExists) {
			console.log("Tester Admin already Exists!");
			await activateIfPending(config.tester_admin_email);
			return;
		}

		const name = config.tester_admin_name;
		const email = config.tester_admin_email;
		const password = config.tester_admin_password;

		if (!name || !email || !password) {
			throw new Error(
				"Tester Admin Name, Email and Password are missing in env file!",
			);
		}

		const hashPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const testerAdmin = await prisma.user.create({
			data: {
				name: name,
				email: email,
				password: hashPassword,
				role: UserRole.ADMIN,
				status: UserStatus.ACTIVE,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Tester Admin Created: ", testerAdmin);
	} catch (error) {
		console.log("Error seeding Tester Admin: ", error);

		await prisma.user.delete({
			where: {
				email: config.tester_admin_email,
			},
		});
	}
};

// Create Tester Doctor

export const seedTesterCitizen = async () => {
	try {
		const isTestercitizenExists = await prisma.user.findUnique({
			where: {
				email: config.tester_citizen_email,
			},
		});

		if (isTestercitizenExists) {
			console.log("Tester citizen already Exists!");
			await activateIfPending(config.tester_citizen_email);

			const existingCitizen = await prisma.citizen.findUnique({
				where: { userId: isTestercitizenExists.id },
			});
			if (!existingCitizen) {
				await prisma.citizen.create({
					data: {
						userId: isTestercitizenExists.id,
						name: isTestercitizenExists.name,
						email: isTestercitizenExists.email,
						contactNumber: "+8801700000000",
					},
				});
				console.log("Created missing Citizen profile for Tester Citizen!");
			}
			return;
		}

		const name = config.tester_citizen_name;
		const email = config.tester_citizen_email;
		const password = config.tester_citizen_password;

		if (!name || !email || !password) {
			throw new Error(
				"Tester citizen Name, Email and Password are missing in env file!",
			);
		}

		const hashPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const testercitizen = await prisma.user.create({
			data: {
				name: name,
				email: email,
				password: hashPassword,
				role: UserRole.CITIZEN,
				status: UserStatus.ACTIVE,
				needPasswordChange: false,
				emailVerified: true,
				citizen: {
					create: {
						name,
						email,
						contactNumber: "+8801700000000",
					},
				},
			},
		});

		console.log("Tester citizen Created: ", testercitizen);
	} catch (error) {
		console.log("Error seedign Tester citizen: ", error);

		await prisma.user.delete({
			where: {
				email: config.tester_citizen_email,
			},
		});
	}
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo data seed — departments, staff, members, categories, SLAs, wards.
// Goal: a development database that is immediately usable, without having to
// call POST /departments, POST /categories, POST /wards, POST /sla ... by hand.
//
// Chain: Admin → Department → Staff members → Categories → SLA → Wards
//
// Every function below is idempotent (upsert / check-first), so it is safe to
// run on every server start — existing rows are kept, missing rows are created.
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_STAFF_PASSWORD = "Staff@1234";

export const seedDepartments = async () => {
	const departmentData = [
		{
			code: "WM",
			name: "Waste Management",
			description: "Garbage collection, street cleaning and waste disposal",
		},
		{
			code: "RD",
			name: "Road & Infrastructure",
			description: "Road damage, footpath and drainage repair",
		},
	];

	const departments = [];

	for (const data of departmentData) {
		// If the department was soft deleted earlier, bring the demo one back so
		// the dev database stays usable.
		const department = await prisma.department.upsert({
			where: { code: data.code },
			update: { deletedAt: null, isActive: true },
			create: data,
		});

		console.log(`Demo Department ready: ${department.name} (${department.code})`);
		departments.push(department);
	}

	return departments;
};

export const seedStaffUsers = async () => {
	const staffData = [
		{ name: "Tanvir Ahmed", email: "tanvir.staff@citycare.com" },
		{ name: "Sadia Islam", email: "sadia.staff@citycare.com" },
		{ name: "Mahmudul Hasan", email: "mahmud.staff@citycare.com" },
		{ name: "Rakibul Karim", email: "rakib.staff@citycare.com" },
	];

	// One hash for all demo staff — same default dev password.
	const hashPassword = await bcrypt.hash(
		DEMO_STAFF_PASSWORD,
		Number(config.bcrypt_salt_rounds),
	);

	const staffUsers = [];

	for (const data of staffData) {
		const staff = await prisma.user.upsert({
			where: { email: data.email },
			update: {
				isDeleted: false,
				deletedAt: null,
				status: UserStatus.ACTIVE,
				emailVerified: true,
			},
			create: {
				...data,
				password: hashPassword,
				role: UserRole.STAFF,
				status: UserStatus.ACTIVE,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log(`Demo Staff ready: ${staff.name} (${staff.email})`);
		staffUsers.push(staff);
	}

	return staffUsers;
};

export const seedDepartmentMembers = async (
	departments: Awaited<ReturnType<typeof seedDepartments>>,
	staffUsers: Awaited<ReturnType<typeof seedStaffUsers>>,
) => {
	// Tanvir & Sadia → Waste Management, Mahmud & Rakib → Road & Infrastructure
	const memberData = [
		{
			departmentCode: "WM",
			email: "tanvir.staff@citycare.com",
			position: StaffPosition.MANAGER,
		},
		{
			departmentCode: "WM",
			email: "sadia.staff@citycare.com",
			position: StaffPosition.CASE_OFFICER,
		},
		{
			departmentCode: "RD",
			email: "mahmud.staff@citycare.com",
			position: StaffPosition.CASE_OFFICER,
		},
		{
			departmentCode: "RD",
			email: "rakib.staff@citycare.com",
			position: StaffPosition.TECHNICIAN,
		},
	];

	for (const data of memberData) {
		const department = departments.find((d) => d.code === data.departmentCode);
		const staff = staffUsers.find((u) => u.email === data.email);

		if (!department || !staff) {
			continue;
		}

		const member = await prisma.departmentMember.upsert({
			where: {
				departmentId_userId: {
					departmentId: department.id,
					userId: staff.id,
				},
			},
			update: { isActive: true },
			create: {
				departmentId: department.id,
				userId: staff.id,
				position: data.position,
			},
		});

		console.log(
			`Demo Member ready: ${staff.name} → ${department.name} (${member.position})`,
		);
	}
};

export const seedCategories = async (
	departments: Awaited<ReturnType<typeof seedDepartments>>,
) => {
	const categoryData = [
		{
			departmentCode: "WM",
			name: "Garbage Collection Delay",
			description: "Household or street garbage not collected on schedule",
			paymentRequired: false,
		},
		{
			departmentCode: "WM",
			name: "Illegal Dumping",
			description: "Waste dumped in open spaces, drains or roadside",
			paymentRequired: false,
		},
		{
			departmentCode: "RD",
			name: "Road Damage",
			description: "Potholes, broken footpaths and damaged roads",
			paymentRequired: false,
		},
		{
			departmentCode: "RD",
			name: "Blocked Drainage",
			description: "Clogged drains causing waterlogging",
			paymentRequired: false,
		},
	];

	const categories = [];

	for (const data of categoryData) {
		const department = departments.find((d) => d.code === data.departmentCode);

		if (!department) {
			continue;
		}

		const { departmentCode, ...payload } = data;

		const category = await prisma.category.upsert({
			where: {
				departmentId_name: {
					departmentId: department.id,
					name: payload.name,
				},
			},
			update: { deletedAt: null, isActive: true },
			create: {
				...payload,
				departmentId: department.id,
			},
		});

		console.log(`Demo Category ready: ${category.name} (${department.code})`);
		categories.push(category);
	}

	return categories;
};

export const seedSlaPolicies = async (
	categories: Awaited<ReturnType<typeof seedCategories>>,
) => {
	const slaData = [
		{
			categoryName: "Garbage Collection Delay",
			responseWithinHours: 24,
			resolutionWithinHours: 48,
			reopenWindowHours: 72,
		},
		{
			categoryName: "Illegal Dumping",
			responseWithinHours: 48,
			resolutionWithinHours: 96,
			reopenWindowHours: 168,
		},
		{
			categoryName: "Road Damage",
			responseWithinHours: 24,
			resolutionWithinHours: 72,
			reopenWindowHours: 168,
		},
		{
			categoryName: "Blocked Drainage",
			responseWithinHours: 12,
			resolutionWithinHours: 48,
			reopenWindowHours: 72,
		},
	];

	for (const data of slaData) {
		const category = categories.find((c) => c.name === data.categoryName);

		if (!category) {
			continue;
		}

		const { categoryName, ...payload } = data;

		const sla = await prisma.slaPolicy.upsert({
			where: { categoryId: category.id },
			update: payload,
			create: {
				...payload,
				categoryId: category.id,
			},
		});

		console.log(
			`Demo SLA ready: ${category.name} → ${sla.responseWithinHours}h response / ${sla.resolutionWithinHours}h resolution`,
		);
	}
};

export const seedWards = async () => {
	const wardData = [
		{ code: "DHK-01", name: "Ward 01 — Motijheel", city: "Dhaka" },
		{ code: "DHK-02", name: "Ward 02 — Gulshan", city: "Dhaka" },
		{ code: "DHK-10", name: "Ward 10 — Dhanmondi", city: "Dhaka" },
		{ code: "DHK-15", name: "Ward 15 — Mirpur", city: "Dhaka" },
		{ code: "DHK-20", name: "Ward 20 — Uttara", city: "Dhaka" },
		{ code: "CTG-01", name: "Ward 01 — Agrabad", city: "Chattogram" },
		{ code: "CTG-02", name: "Ward 02 — Khulshi", city: "Chattogram" },
	];

	for (const data of wardData) {
		const ward = await prisma.ward.upsert({
			where: { code: data.code },
			update: {},
			create: data,
		});

		console.log(`Demo Ward ready: ${ward.name} (${ward.code})`);
	}
};

/**
 * Runs all demo-data seeds in dependency order.
 * Called from server.ts after the user seeds.
 */
export const seedDemoData = async () => {
	try {
		const departments = await seedDepartments();
		const staffUsers = await seedStaffUsers();
		await seedDepartmentMembers(departments, staffUsers);
		const categories = await seedCategories(departments);
		await seedSlaPolicies(categories);
		await seedWards();
	} catch (error) {
		// Demo data must never block server startup.
		console.log("Error seeding demo data: ", error);
	}
};
