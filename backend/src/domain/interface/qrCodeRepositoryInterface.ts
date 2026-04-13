export interface iQrCode {
    generate(username: string, secret: string): Promise<object>;
}