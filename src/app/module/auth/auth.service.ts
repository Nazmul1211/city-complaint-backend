import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import config from "../../../app/config";
import { jwtUtils } from "../../../utils/jwt";
import { SignOptions } from "jsonwebtoken";



const registerCitizen = async(payload: IRegistryPayload) => {
	const { name, password, citizen: citizenData } = payload;
	const email = payload.email.trim().toLowerCase();

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExists) {
		throw new Error("User with this email already exists");
	}


	const hashedPassword = await bcrypt.hash(password,  Number(config.bcrypt_salt_rounds));

    	const createdUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role: UserRole.CITIZEN,
			status: UserStatus.ACTIVE,
			emailVerified: false,
			citizen: {
				create: {
					name,
					email,
					contactNumber: citizenData?.contactNumber || "",
				},
			},
		},
		omit: { password: true },
		include: { citizen: true },
	});

	return createdUser;
}

const verifyCitizenEmail = async() => {

}

const loginUser = async(payload: ILoginUserPayload) => {

    const { password } = payload;
	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is blocked");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is deleted");
	}

	if (user.password !== null && user.googleId !== null) {
		throw new Error(
			"User Already has account, registered with Google. Try to login with Google!",
		);
	}

	const isPasswordMatched = await bcrypt.compare(
		password,
		user.password as string,
	);

	if (!isPasswordMatched) {
		throw new Error("Invalid credentials");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
}

const deleteUser = async() => {

}

const getMe = async() => {

}

const refreshToken = async() => {

}


const googleLogin = async() => {
    
}

const githubLogin = async() => {
    
}


const forgotPassword = async() => {
    
}

const resetPassword = async() => {
    
}

export const authService = {
    registerCitizen,
	verifyCitizenEmail,
	loginUser,
    deleteUser,
	getMe,
	refreshToken,
	googleLogin,
    githubLogin,
	forgotPassword,
	resetPassword,
}
