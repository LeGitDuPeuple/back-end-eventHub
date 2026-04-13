import { OtpBackupCode } from "../../domain/entites/otp-backup";
import { IOtpBackupCodeRepository } from "../../domain/interface/otpBackupCodeRepository";

export class MemoryOtpBackupCodeRepository implements IOtpBackupCodeRepository {
    private codesBackup: OtpBackupCode[] = [];

    async save(codeBackup: OtpBackupCode) : Promise<OtpBackupCode> {
        this.codesBackup.push(codeBackup);
        return codeBackup;
    }

    async findByUserId(id: string) : Promise<OtpBackupCode | null> {
        return this.codesBackup.find((codesBackup) => codesBackup.props.user_id === id) ?? null;
    }
}