import { OtpBackupCode } from "../entites/otp-backup";

export interface IOtpBackupCodeRepository {
    save(codeBackup: OtpBackupCode): Promise<OtpBackupCode>;
    findByUserId(id: string): Promise<OtpBackupCode | null>;
}