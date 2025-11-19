// form/ShipFormFiller.js
import fs from "fs/promises";
import { PDFDocument, TextAlignment } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// import bwipjs from "bwip-js";
// import { getBigBarcodeDataJS } from "./barcodeUtils.js";

export async function ShipFormFiller(data) {
  // adjust file if your template has a different name
  const formPdfBytes = await fs.readFile("./form/templates/Ship.pdf");
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

  // Ship details
  form.getTextField("shipNo").setText(safe(data.shipNo));
  form.getTextField("shipName").setText(safe(data.shipName));
  form.getTextField("crewCount").setText(safe(data.crewCount));
  form.getTextField("totalWeight").setText(safe(data.totalWeight));
  form.getTextField("callSignChannelLeft").setText(safe(data.callSignChannelLeft));
  form.getTextField("callSignChannelRight").setText(safe(data.callSignChannelRight));
  form.getTextField("permanentHarbor").setText(safe(data.permanentHarbor));
  form.getTextField("licenseExpiry").setText(safe(data.licenseExpiry));
  form.getTextField("ownerName").setText(safe(data.ownerName));
  form.getTextField("category").setText(safe(data.category));
  form.getTextField("shipNationality").setText(safe(data.shipNationality));
  form.getTextField("registrationPort").setText(safe(data.registrationPort));
  form.getTextField("assignedWork").setText(safe(data.assignedWork));

  // Names 1–6
  form.getTextField("name1").setText(safe(data.name1));
  form.getTextField("name2").setText(safe(data.name2));
  form.getTextField("name3").setText(safe(data.name3));
  form.getTextField("name4").setText(safe(data.name4));
  form.getTextField("name5").setText(safe(data.name5));
  form.getTextField("name6").setText(safe(data.name6));
  form.getTextField("name7").setText(safe(data.name6));
  form.getTextField("name8").setText(safe(data.name6));
  form.getTextField("name9").setText(safe(data.name6));
  form.getTextField("name10").setText(safe(data.name6));

  // Applicant permission numbers
  form.getTextField("applicantPermissionNo1").setText(safe(data.applicantPermissionNo1));
  form.getTextField("applicantPermissionNo2").setText(safe(data.applicantPermissionNo2));
  form.getTextField("applicantPermissionNo3").setText(safe(data.applicantPermissionNo3));
  form.getTextField("applicantPermissionNo4").setText(safe(data.applicantPermissionNo4));
  form.getTextField("applicantPermissionNo5").setText(safe(data.applicantPermissionNo5));
  form.getTextField("applicantPermissionNo6").setText(safe(data.applicantPermissionNo6));
  form.getTextField("applicantPermissionNo7").setText(safe(data.applicantPermissionNo7));
  form.getTextField("applicantPermissionNo8").setText(safe(data.applicantPermissionNo8));
  form.getTextField("applicantPermissionNo9").setText(safe(data.applicantPermissionNo9));
  form.getTextField("applicantPermissionNo10").setText(safe(data.applicantPermissionNo10));

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

  form.getTextField("permittedLocation1").setText(safe(data.permittedLocation1));
  form.getTextField("permittedLocation2").setText(safe(data.permittedLocation2));
  form.getTextField("permittedLocation3").setText(safe(data.permittedLocation3));
  form.getTextField("permittedLocation4").setText(safe(data.permittedLocation4));
  form.getTextField("permittedLocation5").setText(safe(data.permittedLocation5));
  form.getTextField("permittedLocation6").setText(safe(data.permittedLocation6));


  // RTL + font size
  form.getFields().forEach((field) => {
    if (field.setAlignment) field.setAlignment(TextAlignment.Right);
    if (field.setFontSize) field.setFontSize(12);
  });

  form.updateFieldAppearances(arabicFont);

//   // Barcode (TYPE_CODE should be "5" in data)
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
