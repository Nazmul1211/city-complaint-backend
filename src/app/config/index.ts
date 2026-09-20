import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    port: process.env.PORT!,
    database_url: process.env.DATABASE_URL!,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND!,
    super_admin_name: process.env.SUPER_ADMIN_NAME!,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL!,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD!,
    tester_admin_name: process.env.TESTER_ADMIN_NAME!,
    tester_admin_email: process.env.TESTER_ADMIN_EMAIL!,
    tester_admin_password: process.env.TESTER_ADMIN_PASSWORD!,
    tester_citizen_name: process.env.TESTER_CITIZEN_NAME!,
    tester_citizen_email: process.env.TESTER_CITIZEN_EMAIL!,
    tester_citizen_password: process.env.TESTER_CITIZEN_PASSWORD!,
}



