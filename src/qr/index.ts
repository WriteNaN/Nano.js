import QrCode from "./qr";
import { nanoToRaw } from "../utils/convert";

export async function addressToQr(address: string, options?: Record<string, any>) {
  if (options) {
    const qrC = new QrCode(options);
    return await qrC.download();
  } else {
    const qrCode = new QrCode({ "width": 300, "height": 300, "data": `nano:${address}`, "margin": 0, "qrOptions": { "typeNumber": "0", "mode": "Byte", "errorCorrectionLevel": "Q" }, "imageOptions": { "hideBackgroundDots": true, "imageSize": 0.5, "margin": 0 }, "dotsOptions": { "type": "extra-rounded", "color": "#6a1a4c", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#d06caa" }, { "offset": 1, "color": "#2880c3" }] } }, "backgroundOptions": { "color": "transparent" }, "image": "https://raw.githubusercontent.com/WriteNaN/Nano.js/main/src/assets/nano.png", "dotsOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#6a1a4c", "color2": "#6a1a4c", "rotation": "0" } }, "cornersSquareOptions": { "type": "extra-rounded", "color": "#000000", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#e3168e" }, { "offset": 1, "color": "#1a96f4" }] } }, "cornersSquareOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "cornersDotOptions": { "type": "", "color": "#000000", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#f20d0d" }, { "offset": 1, "color": "#1018f4" }] } }, "cornersDotOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "backgroundOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#ffffff", "color2": "#ffffff", "rotation": "0" } } });
    return await qrCode.download();
  }
}

export default async function createQr(data: { address: string; amount: number; label?: string; message?: string; isRaw: boolean }) {
  const uriBase = `nano:${data.address}`;
  const queryParams = [`amount=${data.isRaw ? data.amount : nanoToRaw(data.amount)}`];
  if (data.label) queryParams.push(`label=${encodeURIComponent(data.label)}`);
  if (data.message) queryParams.push(`message=${encodeURIComponent(data.message)}`);
  const uri = `${uriBase}?${queryParams.join('&')}`;

  const defaultOption = {
    "width": 300,
    "height": 300,
    "data": uri,
    "margin": 0,
    "qrOptions": { "typeNumber": "0", "mode": "Byte", "errorCorrectionLevel": "L" },
    "imageOptions": { "hideBackgroundDots": true, "imageSize": data.isRaw ? 0.5 : 0.5, "margin": 0 },
    "dotsOptions": { "type": "extra-rounded", "color": "#6a1a4c", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#d06caa" }, { "offset": 1, "color": "#2880c3" }] } },
    "backgroundOptions": { "color": "transparent" },
    "image": "https://raw.githubusercontent.com/WriteNaN/Nano.js/main/src/assets/nano.png", "dotsOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#6a1a4c", "color2": "#6a1a4c", "rotation": "0" } }, "cornersSquareOptions": { "type": "extra-rounded", "color": "#000000", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#e3168e" }, { "offset": 1, "color": "#1a96f4" }] } }, "cornersSquareOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "cornersDotOptions": { "type": "", "color": "#000000", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#f20d0d" }, { "offset": 1, "color": "#1018f4" }] } }, "cornersDotOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "backgroundOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#ffffff", "color2": "#ffffff", "rotation": "0" } }
  };

  const qrCode = new QrCode(defaultOption);
  return {
    uri,
    qrCode: await qrCode.download()
  };
}
