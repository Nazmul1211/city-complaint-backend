export interface IUpdateMyProfile {
	name?: string;
	phone?: string;
	avatarUrl?: string;
	citizen?: {
		contactNumber?: string;
		address?: string;
	};
}
