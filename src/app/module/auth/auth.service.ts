import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import { AuthProvider, UserRole, UserStatus } from "../../../../generated/prisma/enums";
import config from "../../../app/config";
import { jwtUtils } from "../../../utils/jwt";
import { SignOptions } from "jsonwebtoken";
import { IGoogleLoginPayload, ILoginUserPayload, IRegisterPayload, IVerifyCitizenPayload } from "./auth.interface";
import { TokenPayload } from "google-auth-library";
import { googleClient } from "../../lib/googleAuth";
import { redisClient } from "../../lib/redis";
import crypto from "crypto"




const registerCitizen = async(payload: IRegisterPayload) => {
	const { name, password, citizen: citizenData } = payload;
	const email = payload.email.trim().toLowerCase();

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExists) {
		throw new Error("User with this email already exists");
	}


	const hashedPassword = await bcrypt.hash(password,  Number(config.bcrypt_salt_rounds));


	// store verify email otp to redis
	const otpKey = `citizen-registration-otp:${email}`;
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	const expirationSeconds = 5 * 60;

	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});


	// Store Registration Form Citizen Data to Redis In memory Buffer Storate as StringiFied Format
	const citizenRegistrationDataKey = `citizen-registration-data:${email}`
	const redisUserDataPayload = {
		name,
		email,
		password: hashedPassword,
		citizen: citizenData
	}

	await redisClient.set(citizenRegistrationDataKey, JSON.stringify(redisUserDataPayload), {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});


	
}



const verifyCitizenEmail = async(payload: IVerifyCitizenPayload) => {
	const email = payload.email.trim().toLowerCase();
	const otp = payload.otp;

	const isUserExists = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (isUserExists?.status === "BLOCKED") {
		throw new Error("User is Blocked!");
	}

	if (isUserExists?.emailVerified) {
		throw new Error("User not Verified!");
	}

	if (isUserExists?.isDeleted || isUserExists?.status === "DELETED") {
		throw new Error("User is Deleted!");
	}

	if (isUserExists?.googleId || isUserExists?.authProvider === "GOOGLE") {
		throw new Error("User has account with Google!");
	}

		
    // Get the OTP from redis, then comapare , finally delete the OTP
	const otpKey = `citizen-registration-otp:${email}`;
	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new Error("Invalid OTP");
	}

	if (redisOtp !== otp) {
		throw new Error("OTP does not match!");
	}

	await redisClient.del(otpKey);


	// Get the Citizen Data from Redis TEMP Storage, then create the user account , finally delete Redis User TEMP register Data
	const citizenRegistrationDataKey = `citizen-registration-data:${email}`
	const redisCitizentPayload = await redisClient.get(citizenRegistrationDataKey);

	if(!redisCitizentPayload){
		throw new Error("Redis Citizen Data Not Found!");
	}

	const citizenPayload : IRegisterPayload  = JSON.parse(redisCitizentPayload);

	const createdUser = await prisma.user.create({
		data: {
			name : citizenPayload.name,
			email : citizenPayload.email,
			password: citizenPayload.password,
			role: UserRole.CITIZEN,
			status: UserStatus.ACTIVE,
			emailVerified: true,
			citizen: {
				create: {
					name : citizenPayload.name,
			        email : citizenPayload.email,
					contactNumber: citizenPayload?.citizen?.contactNumber || "",
				},
			},
		},
		omit: { password: true },
		include: { citizen: true },
	});

	await redisClient.del(citizenRegistrationDataKey);


	// Set the jwtPayload and Store the user data into the Browser Cokkies.
	const { citizen, ...user } = createdUser;
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
		user,
		citizen,
		accessToken,
		refreshToken,
	};


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


const googleLogin = async (payload: IGoogleLoginPayload) => {
	let googleIdTokenPayload : TokenPayload | undefined | null = null;

	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Google Id Token verification failed: ", error);
		throw new Error("Invalid or expired Google Id Token");
	}

	if (!googleIdTokenPayload) {
		throw new Error("Invalid or expired Google Id Token");
	}

	if (!googleIdTokenPayload.email) {
		throw new Error("Google Email Not found!");
	}

	if (!googleIdTokenPayload.name) {
		throw new Error("Google Email user name Not found!");
	}

	const ifCitizenExistWithGoogleAuth = await prisma.user.findUnique({
		where: {
			email: googleIdTokenPayload.email,
			role: UserRole.CITIZEN,
			googleId: googleIdTokenPayload.sub,
		},
	});

	let user = ifCitizenExistWithGoogleAuth;

	if (!ifCitizenExistWithGoogleAuth) {
		const ifCitizenExistWithCredentials = await prisma.user.findUnique({
			where: {
				email: googleIdTokenPayload.email,
				role: UserRole.CITIZEN,
				authProvider: AuthProvider.CREDENTIAL,
			},
		});

		if (ifCitizenExistWithCredentials) {
			if (ifCitizenExistWithCredentials.emailVerified)
				throw new Error("Email not verified!");
			if (ifCitizenExistWithCredentials.status === UserStatus.BLOCKED) {
				throw new Error("User is Blocked!");
			}

			if (
				ifCitizenExistWithCredentials?.isDeleted ||
				ifCitizenExistWithCredentials?.status === UserStatus.DELETED
			) {
				throw new Error("User is Deleted");
			}
		}

		user = await prisma.user.update({
			where: {
				id: ifCitizenExistWithCredentials?.id,
			},

			data: {
				googleId: googleIdTokenPayload.sub,
			},
		});
	} else {
		// Google Register
		user = await prisma.user.create({
			data: {
				name: googleIdTokenPayload.name,
				email: googleIdTokenPayload.email,
				role: UserRole.CITIZEN,
				googleId: googleIdTokenPayload.sub,
				authProvider: AuthProvider.GOOGLE,
				emailVerified: true,
				citizen: {
					create: {
						name: googleIdTokenPayload.name,
						email: googleIdTokenPayload.email,
					},
				},
			},
		});

	}



	if (!user) {
		throw new Error("User Not Found");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is Blocked!");
	}

	if (user?.isDeleted || user?.status === UserStatus.DELETED) {
		throw new Error("User is Deleted");
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
};

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
