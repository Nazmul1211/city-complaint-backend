
export interface IRegistryPayload {
    name: string;
    email: string;
    password: string;
    citizen?: {
        name?: string;
        email?: string;
        contactNumber?: string;
        address?: string;
    }
}

export interface ILoginUserPayload {
    email: string;
    password: string;
}

export interface IGoogleLoginPayload {
	idToken: string;
}