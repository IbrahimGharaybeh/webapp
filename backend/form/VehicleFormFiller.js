const fs = require("fs/promises");
const { PDFDocument, TextAlignment } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");

async function VehicleFormFiller(data) {
    const formPdfBytes = await fs.readFile("./templates/Vehicle.pdf");
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fs.readFile("./fonts/arial.ttf");
    const arabicFont = await pdfDoc.embedFont(fontBytes);

    const form = pdfDoc.getForm();
    const safe = (v) => (v ? String(v) : "");

    form.getTextField("permitType").setText(safe(data.permitType));
    form.getTextField("permitNo").setText(safe(data.permitNo));
    form.getTextField("transactionType").setText(safe(data.transactionType));
    form.getTextField("cancelReason").setText(safe(data.cancelReason));
    form.getTextField("companyNameCode").setText(safe(data.companyNameCode));
    form.getTextField("companyName").setText(safe(data.companyName));

    //Vehicle details
    form.getTextField("plateKind").setText(safe(data.plateKind));
    form.getTextField("vehicleNo").setText(safe(data.vehicleNo));
    form.getTextField("ownerName").setText(safe(data.ownerName));
    form.getTextField("nationality").setText(safe(data.nationality));
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

  form.getTextField("unifiedId").setText(safe(data.unifiedId));
  form.getTextField("phoneNo").setText(safe(data.phoneNo));
  form.getTextField("name").setText(safe(data.name));
  form.getTextField("secPermitNo").setText(safe(data.secPermitNo));
  form.getTextField("nationalityCode").setText(safe(data.nationalityCode));
  form.getTextField("nationality").setText(safe(data.nationality));
  form.getTextField("religionCode").setText(safe(data.religionCode));
  form.getTextField("occupation").setText(safe(data.occupation));
  form.getTextField("occupationCode").setText(safe(data.occupationCode));
  form.getTextField("religion").setText(safe(data.religion));
  form.getTextField("religionCode").setText(safe(data.occupation));
  form.getTextField("passportNo").setText(safe(data.passportNo));
  form.getTextField("residenceNo").setText(safe(data.residenceNo));
  form.getTextField("dateOfBirth").setText(safe(data.dateOfBirth));
  form.getTextField("expiryDate1").setText(safe(data.passportExpiryDate));
  form.getTextField("expiryDate2").setText(safe(data.residenceExpiryDate));

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

    // 8) Save and return bytes
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

module.exports = { VehicleFormFiller };