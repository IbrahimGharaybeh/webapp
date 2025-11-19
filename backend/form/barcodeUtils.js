// // barcodeUtils.js
// // ---------------------------------------------------------
// // FULL C# logic converted to Node.js with 100% DES/AES match
// // ---------------------------------------------------------

// import CryptoJS from "crypto-js";

// // --------------------------------------
// // 1) DES encryption (CBC + ZeroPadding)
// // --------------------------------------
// function encryptDES(input) {
//   if (!input) return "";

//   const key = CryptoJS.enc.Utf8.parse("FdBnM8Az");     // 8 bytes
//   const iv  = CryptoJS.enc.Utf8.parse("V9qaHj7x");     // 8 bytes

//   const encrypted = CryptoJS.DES.encrypt(input, key, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.ZeroPadding,
//   });

//   return encrypted.ciphertext.toString().toUpperCase();
// }

// // --------------------------------------
// // 2) AES encryption (CBC + ZeroPadding)
// //    matches C# RijndaelManaged (128-bit)
// // --------------------------------------
// export function encryptAES(input) {
//   if (!input) return "";

//   const key = CryptoJS.enc.Utf8.parse("FdBnM8Azm1GfYpLz"); // 16 bytes
//   const iv  = CryptoJS.enc.Utf8.parse("4sScV0qaHj7xYgq9"); // 16 bytes

//   const encrypted = CryptoJS.AES.encrypt(input, key, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.ZeroPadding,
//   });

//   return encrypted.ciphertext.toString().toUpperCase();
// }

// // --------------------------------------
// // 3) Arabic normalization (like C#)
// // --------------------------------------
// export function convertArabicString(str) {
//   if (!str) return "";
//   return String(str)
//     .replace(/ي/g, "ي")
//     .replace(/ة/g, "ة")
//     .replace(/ه/g, "ه")
//     .replace(/أ/g, "ا")
//     .replace(/إ/g, "ا")
//     .replace(/آ/g, "ا")
//     .trim();
// }

// // --------------------------------------
// // 4) YYYYMMDD formatter (C# to_char)
// // --------------------------------------
// export function toChar(dateStr) {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   if (isNaN(d.getTime())) return "";
//   return (
//     String(d.getFullYear()) +
//     String(d.getMonth() + 1).padStart(2, "0") +
//     String(d.getDate()).padStart(2, "0")
//   );
// }

// // --------------------------------------
// // 5) getMandoobNoYear (matches C# logic)
// // --------------------------------------
// export function getMandoobNoYear(mandoobPermNo) {
//   if (!mandoobPermNo) return "";
//   // C# takes last 6 characters: ####YY
//   return mandoobPermNo.slice(-6);
// }

// // --------------------------------------
// // 6) MAIN: getBigBarcodeDataJS (FULL C# PORT)
// // --------------------------------------
// export function getBigBarcodeDataJS(ds) {
//   let out = "";
//   const TYPE = String(ds.TYPE_CODE || "");

//   // PERSON types: 1,2,3,4,8
//   const isPerson =
//     TYPE === "1" || TYPE === "2" || TYPE === "3" || TYPE === "4" || TYPE === "8";

//   if (isPerson) {
//     out += ds.APP_ID + ",";
//     out += encryptDES(TYPE) + ",";
//     out += encryptDES(ds.TRANS_CODE) + ",";
//     out += encryptDES(ds.EST_CODE) + ",";
//     out += getMandoobNoYear(ds.MANDOOB_PERM_NO) + ",";
//     out += "7014,";

//     out += encryptDES(convertArabicString(ds.PRS_NAME_A)) + ",";
//     out += encryptAES(ds.PRS_UN_NO) + ",";

//     out += ds.PRS_NAT_CODE + ",";
//     out += ds.PRS_JOB_CODE + ",";

//     out += encryptDES(convertArabicString(ds.PRS_JOB_DESC)) + ",";
//     out += toChar(ds.PRS_BIRTH_DATE) + ",";

//     out += ds.PRS_RELIGION_CODE + ",";
//     out += encryptDES(ds.PRS_PASSPORT_NO) + ",";
//     out += encryptDES(ds.PRS_RESIDENCE_NO) + ",";

//     out += toChar(ds.PRS_PASSPORT_END_DATE) + ",";
//     out += toChar(ds.PRS_RESIDENCE_END_DATE);

//     // TYPE_CODE == 4 special padding
//     if (TYPE === "4") {
//       out += ",,,,,,";
//     } else {
//       out += "," + ds.CONT_NO_1;
//       out += "," + ds.CONT_NO_2;
//       out += "," + ds.CONT_NO_3;
//       out += "," + ds.CONT_NO_4;
//       out += "," + ds.CONT_NO_5;
//       out += "," + ds.CONT_NO_6;
//     }

//     out += "," + ds.CANCEL_REASON;
//     out += "," + ds.TO_BE_RENEW_NO;
//     out += "," + ds.PRS_MOBILE;

//     if (TYPE === "4") {
//       out += ",,,,,,";
//     } else {
//       out += "," + (ds.AREA_NO_1 || "").replace(/,/g, "^");
//       out += "," + (ds.AREA_NO_2 || "").replace(/,/g, "^");
//       out += "," + (ds.AREA_NO_3 || "").replace(/,/g, "^");
//       out += "," + (ds.AREA_NO_4 || "").replace(/,/g, "^");
//       out += "," + (ds.AREA_NO_5 || "").replace(/,/g, "^");
//       out += "," + (ds.AREA_NO_6 || "").replace(/,/g, "^");
//     }

//     out += "," + encryptDES(convertArabicString(ds.COMPANY_NAME_ARABIC));
//     out += "," + ds.LBR_FLAG;

//     if (ds.LBR_FLAG === "Y") {
//       out += "," + toChar(ds.LBR_FROM_DATE);
//       out += "," + toChar(ds.LBR_TO_DATE);
//       out += "," + ds.LBR_PRM_NO;
//     } else {
//       out += ",,,";
//     }
//   }

//   // Append version
//   out += "," + ds.VERSION;

//   // Append Emirates ID + social media (C# logic)
//   if (isPerson) {
//     out += "," + ds.SHIP_CAMERA_NAME_10;
//     out += "," + ds.EMAIL;
//     out += "," + ds.FACEBOOK;
//     out += "," + ds.INSTAGRAM;
//     out += "," + ds.TWITTER;
//     out += "," + ds.OTHERS;
//   }

//   return out;
// }

// // Export everything
// export {
//   encryptDES,
//   encryptAES,
//   getBigBarcodeDataJS,
//   convertArabicString,
//   getMandoobNoYear,
//   toChar,
// };