import qrcode from "qrcode";
// On utilise require pour contourner le bug de types de otplib
const { authenticator } = require("otplib");
import { iQrCode } from "../../domain/interface/qrCodeRepositoryInterface";

export class QrCodeGenerator implements iQrCode  {
    constructor(private readonly appName: string) {}
    
    async generate(username: string, secret: string) {
        return qrcode.toDataURL(authenticator.keyuri(username, this.appName, secret)).then((image) => {
            return Promise.resolve({image, username, secret});
        });
    }
}