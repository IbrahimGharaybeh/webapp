// form/PhotographyFormFiller.js
import fs from "fs/promises";
import { PDFDocument, TextAlignment } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// import bwipjs from "bwip-js";
// import { getBigBarcodeDataJS } from "./barcodeUtils.js";

export async function PhotographyFormFiller(data) {
  // adjust name if your template differs
  const formPdfBytes = await fs.readFile("./form/templates/Photography.pdf");
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  pdfDoc.registerFontkit(fontkit);
  const fontBytes = await fs.readFile("./form/fonts/arial.ttf");
  const arabicFont = await pdfDoc.embedFont(fontBytes);

  const form = pdfDoc.getForm();
  const safe = (v) => (v ? String(v) : "");

  // Common header
  form.getTextField("permitType").setText(safe(data.permitType));
  form.getTextField("permitNo").setText(safe(data.permitNo));
  form.getTextField("transactionType").setText(safe(data.transactionType));
  form.getTextField("cancelReason").setText(safe(data.cancelReason));
  form.getTextField("companyNameCode").setText(safe(data.companyNameCode));
  form.getTextField("companyName").setText(safe(data.companyName));

  // Person info
  form.getTextField("unifiedId").setText(safe(data.unifiedId));
  form.getTextField("mobileNo").setText(safe(data.mobileNo)); //change this to phoneNo
  form.getTextField("name").setText(safe(data.name));
  form.getTextField("secPermitNo").setText(safe(data.secPermitNo));
  form.getTextField("nationalityCode").setText(safe(data.nationalityCode));
  form.getTextField("nationality").setText(safe(data.nationality));
  form.getTextField("religionCode").setText(safe(data.religionCode));
  form.getTextField("occupation").setText(safe(data.occupation));
  form.getTextField("occupationCode").setText(safe(data.occupationCode));
  form.getTextField("religion").setText(safe(data.religion));
  form.getTextField("passportNo").setText(safe(data.passportNo));
  form.getTextField("residenceNo").setText(safe(data.residenceNo));
  form.getTextField("dateOfBirth").setText(safe(data.dateOfBirth));
  form.getTextField("expiryDate1").setText(safe(data.passportExpiryDate));
  form.getTextField("expiryDate2").setText(safe(data.residenceExpiryDate));

  // Camera details
  form.getTextField("cameraBrand1").setText(safe(data.cameraBrand1));
  form.getTextField("cameraBrand2").setText(safe(data.cameraBrand2));
  form.getTextField("cameraBrand3").setText(safe(data.cameraBrand3));
  form.getTextField("cameraBrand4").setText(safe(data.cameraBrand4));
  form.getTextField("cameraBrand5").setText(safe(data.cameraBrand5));
  form.getTextField("cameraBrand6").setText(safe(data.cameraBrand6));

  form.getTextField("cameraNo1").setText(safe(data.cameraNo1));
  form.getTextField("cameraNo2").setText(safe(data.cameraNo2));
  form.getTextField("cameraNo3").setText(safe(data.cameraNo3));
  form.getTextField("cameraNo4").setText(safe(data.cameraNo4));
  form.getTextField("cameraNo5").setText(safe(data.cameraNo5));
  form.getTextField("cameraNo6").setText(safe(data.cameraNo6));

  // Contracts + locations
  form.getTextField("contractNo1").setText(safe(data.contractNo1));
  form.getTextField("contractNo2").setText(safe(data.contractNo2));
  form.getTextField("contractNo3").setText(safe(data.contractNo3));
  form.getTextField("contractNo4").setText(safe(data.contractNo4));
  form.getTextField("contractNo5").setText(safe(data.contractNo5));
  form.getTextField("contractNo6").setText(safe(data.contractNo6));

  form.getTextField("permittedLocationCode1").setText(safe(data.permittedLocationCode1));
  form.getTextField("permittedLocationCode2").setText(safe(data.permittedLocationCode2));
  form.getTextField("permittedLocationCode3").setText(safe(data.permittedLocationCode3));
  form.getTextField("permittedLocationCode4").setText(safe(data.permittedLocationCode4));
  form.getTextField("permittedLocationCode5").setText(safe(data.permittedLocationCode5));
  form.getTextField("permittedLocationCode6").setText(safe(data.permittedLocationCode6));

  form.getTextField("permittedLocationName1").setText(safe(data.permittedLocationName1));
  form.getTextField("permittedLocationName2").setText(safe(data.permittedLocationName2));
  form.getTextField("permittedLocationName3").setText(safe(data.permittedLocationName3));
  form.getTextField("permittedLocationName4").setText(safe(data.permittedLocationName4));
  form.getTextField("permittedLocationName5").setText(safe(data.permittedLocationName5));
  form.getTextField("permittedLocationName6").setText(safe(data.permittedLocationName6));


  //add remarks
  //form.getTextField("remarks").setText(safe(data.remarks));

  // RTL + font size
  form.getFields().forEach((field) => {
    if (field.setAlignment) field.setAlignment(TextAlignment.Right);
    if (field.setFontSize) field.setFontSize(12);
  });

  form.updateFieldAppearances(arabicFont);

//   // Barcode (TYPE_CODE should be "7" for camera permit in data)
//   const rawBarcodeData = getBigBarcodeDataJS(data);

//   const pngBuffer = await bwipjs.toBuffer({
//     bcid: "pdf417",
//     text: rawBarcodeData,
//     scale: 3,
//     height: 10,
//     includetext: false,
//   });

//   const barcodeImage = await pdfDoc.embedPng(pngBuffer);
//   const page = pdfDoc.getPages()[0];
//   const { height } = page.getSize();

//   const topBox = {
//     x: 240,
//     y: height - 170,
//     width: 260,
//     height: 70,
//   };

//   const dims = barcodeImage.scale(1);
//   const scale = Math.min(topBox.width / dims.width, topBox.height / dims.height);
//   const scaled = barcodeImage.scale(scale);

//   const drawX = topBox.x + (topBox.width - scaled.width) / 2;
//   const drawY = topBox.y + (topBox.height - scaled.height) / 2;

//   page.drawImage(barcodeImage, {
//     x: drawX,
//     y: drawY,
//     width: scaled.width,
//     height: scaled.height,
//   });

  return pdfDoc.save();
}
