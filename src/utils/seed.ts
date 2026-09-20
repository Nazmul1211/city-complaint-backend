import bcrypt from "bcryptjs";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../app/lib/prisma";
import config from "../app/config";

export const seedSuperAdmin = async () => {
	try {
		const isSuperAdminExists = await prisma.user.findFirst({
			where: {
				role: UserRole.SUPER_ADMIN,
			},
		});

		if (isSuperAdminExists) {
			console.log("Super Admin Exists!");
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
				needPasswordChange: false,
				emailVerified: true,
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
