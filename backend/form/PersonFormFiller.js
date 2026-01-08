// fillPermitForm.js

import fs from "fs/promises";
import { PDFDocument, TextAlignment } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

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
  form.getTextField("permitNo").setText(safe(data.permissionNo));
  form.getTextField("transactionType").setText(safe(data.transactionType));
  form.getTextField("cancelReason").setText(safe(data.cancelReason));
  form.getTextField("companyNameCode").setText(safe(data.companyNameCode));
  form.getTextField("companyName").setText(safe(data.companyName));

  form.getTextField("unifiedId").setText(safe(data.unifiedNo));
  form.getTextField("phoneNo").setText(safe(data.mobileNo));
  form.getTextField("name").setText(safe(data.nameArabic));
  form.getTextField("emiratesId").setText(safe(data.emiratesIdNo));
  form.getTextField("nationalityCode").setText(safe(data.nationalityCode));
  form.getTextField("nationality").setText(safe(data.nationality));
  form.getTextField("religionCode").setText(safe(data.religionCode));
  form.getTextField("occupation").setText(safe(data.occupation));
  form.getTextField("occupationCode").setText(safe(data.occupationCode));
  form.getTextField("religion").setText(safe(data.religionDen));
  form.getTextField("passportNo").setText(safe(data.passportNo));
  form.getTextField("passportExpiryDate").setText(safe(data.passportExpiryDate));
  form.getTextField("residenceNo").setText(safe(data.fullResidenceNo));
  form.getTextField("expiryDate1").setText(safe(data.expiryDate1));
  form.getTextField("dateOfBirth").setText(safe(data.dob));
  form.getTextField("expiryDate2").setText(safe(data.expiryDate2));
  form.getTextField("molNo").setText(safe(data.molNo));

  // Handle permitted locations array
  if (data.permittedLocations && Array.isArray(data.permittedLocations)) {
    for (let i = 0; i < 6; i++) {
      const location = data.permittedLocations[i];
      form.getTextField(`contractNo${i + 1}`).setText(safe(location?.contractNo));
      form.getTextField(`permittedLocationCode${i + 1}`).setText(
        safe(location?.contractLocationsNo || location?.code)
      );
      form.getTextField(`permittedLocation${i + 1}`).setText(
        safe(location?.contractLocationsDesc || location?.name || location?.location)
      );
    }
  }

  form.getTextField("remarks").setText(safe(data.remarks));

  // 6) Make ALL text fields RTL-aligned and set font size
  const allFields = form.getFields();
  allFields.forEach((field) => {
    if (typeof field.setAlignment === "function") {
      field.setAlignment(TextAlignment.Right);
    }
    if (typeof field.setFontSize === "function") {
      field.setFontSize(12);
    }
  });

  // 7) Update appearance with the embedded font
  form.updateFieldAppearances(arabicFont);

  // 11) Save PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export { PersonFormFiller };
