
interface IRegistryPayload {
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