// form/VehicleFormFiller.js
import fs from "fs/promises";
import { PDFDocument, TextAlignment } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// import bwipjs from "bwip-js";
// import { getBigBarcodeDataJS } from "./barcodeUtils.js";

export async function VehicleFormFiller(data) {
  // 1) Load template
  const formPdfBytes = await fs.readFile("./form/templates/Vehicle.pdf");
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  // 2) Fontkit + Arabic font
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = await fs.readFile("./form/fonts/arial.ttf");
  const arabicFont = await pdfDoc.embedFont(fontBytes);

  const form = pdfDoc.getForm();
  const safe = (v) => (v ? String(v) : "");

  // 3) Header / common fields
  form.getTextField("permitType").setText(safe(data.permitType));
  form.getTextField("permitNo").setText(safe(data.permitNo));
  form.getTextField("transactionType").setText(safe(data.transactionType));
  form.getTextField("cancelReason").setText(safe(data.cancelReason));
  form.getTextField("companyNameCode").setText(safe(data.companyNameCode));
  form.getTextField("companyName").setText(safe(data.companyName));

  // Vehicle details
  form.getTextField("plateKind").setText(safe(data.plateKind));
  form.getTextField("vehicleNo").setText(safe(data.vehicleNo));
  form.getTextField("ownerName").setText(safe(data.ownerName));
  form.getTextField("vehicleNationality").setText(safe(data.vehicleNationality));
  form.getTextField("vehicleKind").setText(safe(data.vehicleKind));
  form.getTextField("engineNo").setText(safe(data.engineNo));
  form.getTextField("corresNo").setText(safe(data.corresNo));
  form.getTextField("plateColor").setText(safe(data.plateColor));
  form.getTextField("placeOfIssue").setText(safe(data.placeOfIssue));
  form.getTextField("registExpiry").setText(safe(data.registExpiry));
  form.getTextField("vehicleCateg").setText(safe(data.vehicleCateg));
  form.getTextField("vehicleColor").setText(safe(data.vehicleColor));
  form.getTextField("chasisNo").setText(safe(data.chasisNo));
  form.getTextField("corresDate").setText(safe(data.corresDate));

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

  // Contracts + locations
  //change these to contractNo# later
  form.getTextField("ContractNo1").setText(safe(data.ContractNo1));
  form.getTextField("ContractNo2").setText(safe(data.ContractNo2));
  form.getTextField("ContractNo3").setText(safe(data.ContractNo3));
  form.getTextField("ContractNo4").setText(safe(data.ContractNo4));
  form.getTextField("ContractNo5").setText(safe(data.ContractNo5));
  form.getTextField("ContractNo6").setText(safe(data.ContractNo6));

  form.getTextField("permittedLocationCode1").setText(safe(data.permittedLocationCode1));
  form.getTextField("permittedLocationCode2").setText(safe(data.permittedLocationCode2));
  form.getTextField("permittedLocationCode3").setText(safe(data.permittedLocationCode3));
  form.getTextField("permittedLocationCode4").setText(safe(data.permittedLocationCode4));
  form.getTextField("permittedLocationCode5").setText(safe(data.permittedLocationCode5));
  form.getTextField("permittedLocationCode6").setText(safe(data.permittedLocationCode6));
  //change to permittedLocation# later
  form.getTextField("permittedLocationName1").setText(safe(data.permittedLocationName1));
  form.getTextField("permittedLocationName2").setText(safe(data.permittedLocationName2));
  form.getTextField("permittedLocationName3").setText(safe(data.permittedLocationName3));
  form.getTextField("permittedLocationName4").setText(safe(data.permittedLocationName4));
  form.getTextField("permittedLocationName5").setText(safe(data.permittedLocationName5));
  form.getTextField("permittedLocationName6").setText(safe(data.permittedLocationName6));

  form.getTextField("remarks").setText(safe(data.remarks));

  // 4) RTL + font size
  form.getFields().forEach((field) => {
    if (field.setAlignment) field.setAlignment(TextAlignment.Right);
    if (field.setFontSize) field.setFontSize(12);
  });

  form.updateFieldAppearances(arabicFont);

  // // 5) Barcode data (TYPE_CODE should be "6" for vehicle in data)
  // const rawBarcodeData = getBigBarcodeDataJS(data);

  // // 6) PDF417 barcode image
  // const pngBuffer = await bwipjs.toBuffer({
  //   bcid: "pdf417",
  //   text: rawBarcodeData,
  //   scale: 3,
  //   height: 10,
  //   includetext: false,
  // });

  // const barcodeImage = await pdfDoc.embedPng(pngBuffer);
  // const page = pdfDoc.getPages()[0];
  // const { height } = page.getSize();

  // const topBox = {
  //   x: 240,
  //   y: height - 170,
  //   width: 260,
  //   height: 70,
  // };

  // const dims = barcodeImage.scale(1);
  // const scale = Math.min(topBox.width / dims.width, topBox.height / dims.height);
  // const scaled = barcodeImage.scale(scale);

  // const drawX = topBox.x + (topBox.width - scaled.width) / 2;
  // const drawY = topBox.y + (topBox.height - scaled.height) / 2;

  // page.drawImage(barcodeImage, {
  //   x: drawX,
  //   y: drawY,
  //   width: scaled.width,
  //   height: scaled.height,
  // });

  return pdfDoc.save();
}
