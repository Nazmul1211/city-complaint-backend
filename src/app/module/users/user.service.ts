import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../../generated/prisma/enums";
import type { IUpdateMyProfile } from "./user.interface";
import { cloudinary } from "../../lib/cloudinary";

const getMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			citizen: true,
		},
		omit: { password: true },
	});

	if (!user) {
		throw new Error("User not found!");
	}

	return user;
};

const updateMyProfile = async (userId: string, payload: IUpdateMyProfile) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is deleted!");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is Blocked!");
	}

	const { citizen: citizenData, ...userData } = payload;

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			...userData,
			...(citizenData && {
				citizen: {
					update: {
						contactNumber: citizenData.contactNumber,
						address: citizenData.address,
					},
				},
			}),
		},
		include: {
			citizen: true,
		},
		omit: { password: true },
	});

	return updatedUser;
};

const uploadProfileImage = async (buffer: Buffer, userId : string) => {
  
  cloudinary.uploader.upload_stream(
    {
      resource_type: "auto"
    },
    async (error, result)=> {
      if(error){
        console.log(error);
        throw new Error(error.message);
      }
      console.log(result, "result");
      const updateUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          imageUrl : result?.secure_url,
          publicImageId : result?.public_id
        }
      }
      )
      console.log(updateUser)

      
    }
  ).end(buffer)

};

const deleteMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is already deleted!");
	}

	// Self soft delete: same flagging logic as the admin-initiated delete,
	// so the account is deactivated while related records stay intact.
	const deletedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isDeleted: true,
			deletedAt: new Date(),
			status: UserStatus.DELETED,
		},
		omit: { password: true },
	});

	return deletedUser;
};

export const userService = {
	getMe,
	updateMyProfile,
	uploadProfileImage,
	deleteUser: deleteMe,
};
