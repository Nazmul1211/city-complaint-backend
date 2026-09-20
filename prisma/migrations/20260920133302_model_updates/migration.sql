-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIAL',
ALTER COLUMN "googleId" DROP NOT NULL,
ALTER COLUMN "githubId" DROP NOT NULL;
