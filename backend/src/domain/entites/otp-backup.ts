export interface OtpBackupCodeProps {
    id?: number; // Optionnel car généré par la BDD
    user_id: string; 
    codes: string; // On stockera souvent ça sous forme de JSON stringifié
    nb_code_used: number;
    nb_consecutive_tests: number;
}

export class OtpBackupCode {
    constructor(public props: OtpBackupCodeProps) {}

    validateOrThrow() {
        if (!this.props.codes) {
            throw new Error('codes is required');
        }

        if (typeof this.props.nb_code_used !== 'number' || this.props.nb_code_used < 0) {
            throw new Error('nb_code_used is required');
        }

        if (typeof this.props.nb_consecutive_tests !== 'number' || this.props.nb_consecutive_tests < 0) {
            throw new Error('nb_consecutive_tests is required');
        }
    }
}