import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import config from "../../../app/config";



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

const loginUser = async() => {

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
