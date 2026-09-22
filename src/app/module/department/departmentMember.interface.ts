import type { StaffPosition } from "../../../../generated/prisma/enums";

export interface IAddDepartmentMember {
	userId: string;
	position: StaffPosition;
}

export interface IUpdateDepartmentMember {
	position?: StaffPosition;
	isActive?: boolean;
}
