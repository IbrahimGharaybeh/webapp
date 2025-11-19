// fillPermitForm.js

import fs from "fs/promises";
import { PDFDocument, TextAlignment } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// import bwipjs from "bwip-js";
// import { getBigBarcodeDataJS } from "./barcodeUtils.js";

async function PersonFormFiller(data) {
  // 1) Load the PDF template (fillable form)
  const formPdfBytes = await fs.readFile("./form/templates/Person.pdf");
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  // 2) Enable fontkit so we can embed custom fonts (like Arial with Arabic)
  pdfDoc.registerFontkit(fontkit);

  // 3) Load your font (make sure fonts/arial.ttf exists)
  const fontBytes = await fs.readFile("./form/fonts/arial.ttf");
  const arabicFont = await pdfDoc.embedFont(fontBytes);

  // 4) Get the form
  const form = pdfDoc.getForm();
  const safe = (v) => (v ? String(v) : "");

  // 5) Fill all known fields
  form.getTextField("permitType").setText(safe(data.permitType));
  form.getTextField("permitNo").setText(safe(data.permitNo));
  form.getTextField("transactionType").setText(safe(data.transactionType));
  form.getTextField("cancelReason").setText(safe(data.cancelReason));
  form.getTextField("companyNameCode").setText(safe(data.companyNameCode));
  form.getTextField("companyName").setText(safe(data.companyName));



  form.getTextField("unifiedId").setText(safe(data.unifiedId));
  form.getTextField("phoneNo").setText(safe(data.phoneNo));
  form.getTextField("name").setText(safe(data.name));
  form.getTextField("emiratesId").setText(safe(data.emiratesId));
  form.getTextField("nationalityCode").setText(safe(data.nationalityCode));
  form.getTextField("nationality").setText(safe(data.nationality));
  form.getTextField("religionCode").setText(safe(data.religionCode));
  form.getTextField("occupation").setText(safe(data.occupation));
  form.getTextField("occupationCode").setText(safe(data.occupationCode));
  form.getTextField("religion").setText(safe(data.religion));
  form.getTextField("passportNo").setText(safe(data.passportNo));
  form.getTextField("passportExpiryDate").setText(safe(data.passportExpiryDate));
  form.getTextField("residenceNo").setText(safe(data.residenceNo));
  form.getTextField("expiryDate1").setText(safe(data.residenceExpiryDate));
  form.getTextField("dateOfBirth").setText(safe(data.dateOfBirth));
  form.getTextField("expiryDate2").setText(safe(data.molExpiryDate));
  form.getTextField("molNo").setText(safe(data.molNo));

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

  form.getTextField("remarks").setText(safe(data.remarks));

  // 6) Make ALL text fields RTL-aligned and set font size
  const allFields = form.getFields();
  allFields.forEach((field) => {
    // Right alignment for any text-like field
    if (typeof field.setAlignment === "function") {
      field.setAlignment(TextAlignment.Right);
    }

    // Font size for any text-like field
    if (typeof field.setFontSize === "function") {
      field.setFontSize(12); // 👈 غيّر الرقم لتكبير/تصغير الخط (مثلاً 10 أو 14 أو 16)
    }
  });

  // 7) Update appearance with the embedded font
  form.updateFieldAppearances(arabicFont);

  // 8) Build barcode data using the full C# port logic
  // const rawBarcodeData = getBigBarcodeDataJS(data);

  // // 9) Generate PDF417 barcode image as PNG using bwip-js
  // const pngBuffer = await new Promise((resolve, reject) => {
  //   bwipjs.toBuffer(
  //     {
  //       bcid: "pdf417",
  //       text: rawBarcodeData,
  //       scale: 3,
  //       height: 10,
  //       includetext: false,
  //     },
  //     (err, png) => {
  //       if (err) reject(err);
  //       else resolve(png);
  //     }
  //   );
  // });

  // // 10) Embed the barcode image into the PDF (top box beside the photo)
  // //const barcodeImage = await pdfDoc.embedPng(pngBuffer);
  // //const page = pdfDoc.getPages()[0];
  // //const { width: pageWidth, height: pageHeight } = page.getSize();

  // // Define a top box area beside the photo – adjust x/y/width/height to fit exactly
  // const topBox = {
  //   x: 240,              // move right/left
  //   y: pageHeight - 170, // move up/down
  //   width: 260,
  //   height: 70,
  // };

  // // Optional: debug rectangle
  // // page.drawRectangle({
  // //   x: topBox.x,
  // //   y: topBox.y,
  // //   width: topBox.width,
  // //   height: topBox.height,
  // //   borderWidth: 1,
  // // });

  // const originalDims = barcodeImage.scale(1);
  // const scaleFactor = Math.min(
  //   topBox.width / originalDims.width,
  //   topBox.height / originalDims.height
  // );
  // const scaledDims = barcodeImage.scale(scaleFactor);

  // const drawX = topBox.x + (topBox.width - scaledDims.width) / 2;
  // const drawY = topBox.y + (topBox.height - scaledDims.height) / 2;

  // page.drawImage(barcodeImage, {
  //   x: drawX,
  //   y: drawY,
  //   width: scaledDims.width,
  //   height: scaledDims.height,
  // });

  // 11) Save PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export { PersonFormFiller };