import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { TableDropDown } from '../components/DropDownComplicated/TableDropDown';

interface Company {
  company: string;
  name: string;
}

interface Representative {
  rep_id: number;
  rep_name_ar: string;
  rep_name_en: string;
}

interface PermittedLocation {
  contractNo: string;
  contractLocationsNo: string;
  contractLocationsDesc: string;
}

interface VehicleProps {
  initialLanguage?: 'en' | 'ar';
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function Vehicle({ initialLanguage = 'en' }: VehicleProps) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<'en' | 'ar'>(initialLanguage);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
    permitType: '',
    transactionType: '',
    // Driver fields
    unifiedNo: '',
    nameArabic: '',
    nationality: '',
    religionDen: '',
    passportNo: '',
    fullResidenceNo: '',
    occupation: '',
    personPrmNo: '',
    mobileNo: '',
    dob: '',
    expiryDate1: '',
    expiryDate2: '',
    // Vehicle fields
    vehiclePrmNo: '',
    vehicleNumber: '',
    plateKind1: '',
    nationalityVehicle: '',
    ownerName: '',
    vehicleCategory: '',
    engineNo: '',
    corresNo: '',
    placeOfIssue: '',
    plateKind2: '',
    vehicleType: '',
    vehicleColor: '',
    chassisNumber: '',
    registExpiry: '',
    corresExpiry: '',
    remarks: '',
    permittedLocations: Array.from({ length: 6 }, () => ({
      contractNo: '',
      contractLocationsNo: '',
      contractLocationsDesc: ''
    }))
  });

  const labels = {
    en: {
      formTitle: 'Application form for security permit for Vehicle with driver',
      companyPermitInfo: 'Company and Permit Info',
      driverDetails: 'Driver',
      vehicleDetails: 'Vehicle',
      permittedLocationsTitle: 'Contracts and Locations',
      companyName: 'Company Name',
      representative: 'Representative',
      permitType: 'Permit Type',
      transactionType: 'Transaction Type',
      unifiedNo: 'Unified No.',
      nameArabic: 'Name in Arabic',
      nationality: 'Nationality',
      religionDen: 'Religion / Den.',
      passportNo: 'Passport No.',
      fullResidenceNo: 'Full Residence No.',
      occupation: 'Occupation',
      personPrmNo: 'Person Prm. No.',
      mobileNo: 'Mobile No.',
      dob: 'Date Of Birth',
      expiryDate1: 'Expiry Date',
      expiryDate2: 'Expiry Date',
      vehiclePrmNo: 'Vehicle Prm. No.',
      vehicleNumber: 'Vehicle Number',
      plateKind: 'Plate Kind',
      nationalityVehicle: 'Nationality',
      ownerName: 'Owner Name',
      vehicleCategory: 'Vehicle category',
      engineNo: 'Engine Number',
      corresNo: 'Corres No.',
      placeOfIssue: 'Place of issue',
      vehicleType: 'Vehicle Type',
      vehicleColor: 'Vehicle Color',
      chassisNumber: 'Chassis Number',
      registExpiry: 'Regist. Expiry',
      corresExpiry: 'Corres. Expiry',
      remarks: 'Remarks',
      permittedLocations: {
        contractNo: 'Contract No',
        contractLocationsNo: 'Contract Locations No',
        contractLocationsDesc: 'Contract Locations Desc'
      },
      print: 'Print',
      clear: 'Clear',
      selectCompany: '-- Select a company --',
      select: '-- Select --',
      switchLanguage: 'عربي'
    },
    ar: {
      formTitle: 'طلب تصريح أمني لمركبة مع سائق',
      companyPermitInfo: 'بيانات الشركة و التصريح',
      driverDetails: 'السائق',
      vehicleDetails: 'المركبة',
      permittedLocationsTitle: 'العقود و المواقع',
      companyName: 'إسم الشركة',
      representative: 'المندوب',
      permitType: 'نوع التصريح',
      transactionType: 'نوع المعاملة',
      unifiedNo: 'الرقم الموحد',
      nameArabic: 'الإسم بالعربية',
      nationality: 'الجنسية',
      religionDen: 'الديانة و المذهب',
      passportNo: 'رقم الجواز',
      fullResidenceNo: 'رقم الإقامة الكامل',
      occupation: 'المهنة',
      personPrmNo: 'رقم تصريح السائق',
      mobileNo: 'الموبايل',
      dob: 'تاريخ الميلاد',
      expiryDate1: 'تاريخ الانتهاء',
      expiryDate2: 'تاريخ الانتهاء',
      vehiclePrmNo: 'رقم تصريح المركبة',
      vehicleNumber: 'رقم المركبة',
      plateKind: 'نوع اللوحة',
      nationalityVehicle: 'بلد الصنع',
      ownerName: 'إسم المالك',
      vehicleCategory: 'صنف المركبة',
      engineNo: 'رقم المحرك',
      corresNo: 'رقم كتاب المرور',
      placeOfIssue: 'جهة الترخيص',
      vehicleType: 'نوع المركبة',
      vehicleColor: 'لون المركبة',
      chassisNumber: 'رقم القاعدة',
      registExpiry: 'إنتهاء الترخيص',
      corresExpiry: 'تاريخ انتهاء الكتاب',
      remarks: 'ملاحظات',
      permittedLocations: {
        contractNo: 'رقم العقد',
        contractLocationsNo: 'أرقام مناطق العقد',
        contractLocationsDesc: 'إسم المناطق للعقد'
      },
      print: 'طباعة',
      clear: 'تفريغ الحقول',
      selectCompany: '-- اختر شركة --',
      select: '-- اختر --',
      switchLanguage: 'English'
    }
  };

  const transactionTypes = [
    { code: 1, en: 'New', ar: 'إصدار' },
    { code: 2, en: 'Renew', ar: 'تجديد' },
    { code: 3, en: 'Cancel', ar: 'إلغاء' },
    { code: 4, en: 'Missing', ar: 'بدل فاقد' },
    { code: 5, en: 'Damaged', ar: 'بدل تالف' }
  ];

  const vehiclePermitTypes = [
    { code: 1, en: 'With Driver', ar: 'مع سائق' },
    { code: 2, en: 'Without Driver', ar: 'مركبة' }
  ];

  const l = labels[language];

  // Fetch companies for current user
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) {
        setCompanies([]);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/members/companyCheck`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: user.id })
        });
        if (!response.ok) throw new Error('Failed to fetch companies');
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user]);

  // Fetch representatives when company is selected
  useEffect(() => {
    const fetchRepresentatives = async () => {
      if (!formData.companyName) {
        setRepresentatives([]);
        return;
      }

      try {
        setLoading(true);
        // TODO: Replace with actual API endpoint
        const response = await fetch(`/api/representatives?companyId=${formData.companyName}`);
        const data = await response.json();
        setRepresentatives(data);
      } catch (error) {
        console.error('Error fetching representatives:', error);
        setRepresentatives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentatives();
  }, [formData.companyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (index: number, field: string, value: string) => {
    const newLocations = [...formData.permittedLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setFormData(prev => ({ ...prev, permittedLocations: newLocations }));
  };

  const handleClear = () => {
    setFormData({
      companyName: '',
      representative: '',
      permitType: '',
      transactionType: '',
      unifiedNo: '',
      nameArabic: '',
      nationality: '',
      religionDen: '',
      passportNo: '',
      fullResidenceNo: '',
      occupation: '',
      personPrmNo: '',
      mobileNo: '',
      dob: '',
      expiryDate1: '',
      expiryDate2: '',
      vehiclePrmNo: '',
      vehicleNumber: '',
      plateKind1: '',
      nationalityVehicle: '',
      ownerName: '',
      vehicleCategory: '',
      engineNo: '',
      corresNo: '',
      placeOfIssue: '',
      plateKind2: '',
      vehicleType: '',
      vehicleColor: '',
      chassisNumber: '',
      registExpiry: '',
      corresExpiry: '',
      remarks: '',
      permittedLocations: Array.from({ length: 6 }, () => ({
        contractNo: '',
        contractLocationsNo: '',
        contractLocationsDesc: ''
      }))
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/permits/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <button type="button" onClick={toggleLanguage}>
          {l.switchLanguage}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h1>{l.formTitle}</h1>

        <fieldset>
          <legend>{l.companyPermitInfo}</legend>
          <div>
            <label>{l.companyName}</label>
            <select
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">{l.selectCompany}</option>
              {companies.map((company) => (
                <option key={company.company} value={company.company}>
                  {company.name}
                </option>
              ))}
            </select>

            <label>{l.representative}</label>
            <select
              name="representative"
              value={formData.representative}
              onChange={handleChange}
            >
              <option value="">{l.select}</option>
              {representatives.map((rep) => (
                <option key={rep.rep_id} value={rep.rep_id}>
                  {language === 'ar' ? rep.rep_name_ar : rep.rep_name_en}
                </option>
              ))}
            </select>

            <label>{l.permitType}</label>
            <select
              name="permitType"
              value={formData.permitType}
              onChange={handleChange}
            >
              <option value="">{l.select}</option>
              {vehiclePermitTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {language === 'ar' ? type.ar : type.en}
                </option>
              ))}
            </select>

            <label>{l.transactionType}</label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
            >
              <option value="">{l.select}</option>
              {transactionTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {language === 'ar' ? type.ar : type.en}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div>
          <fieldset>
            <legend>{l.driverDetails}</legend>
            <div>
              <label>{l.unifiedNo}</label>
              <input
                name="unifiedNo"
                value={formData.unifiedNo}
                onChange={handleChange}
              />

              <label>{l.nameArabic}</label>
              <input
                name="nameArabic"
                value={formData.nameArabic}
                onChange={handleChange}
              />

              <label>{l.nationality}</label>
              <TableDropDown 
                csvPath='\csv\CNIA_NATS.txt'
                columns={2}
              />

              <label>{l.religionDen}</label>
              <TableDropDown 
                csvPath='\csv\CNIA.RELIGION.txt'
                columns={2}
              />

              <label>{l.passportNo}</label>
              <input
                name="passportNo"
                value={formData.passportNo}
                onChange={handleChange}
              />

              <label>{l.fullResidenceNo}</label>
              <input
                name="fullResidenceNo"
                value={formData.fullResidenceNo}
                onChange={handleChange}
              />

              <label>{l.occupation}</label>
              <TableDropDown 
                csvPath='\csv\CNIA_JOBS.txt'
                columns={2}
              />

              <label>{l.personPrmNo}</label>
              <input
                name="personPrmNo"
                value={formData.personPrmNo}
                onChange={handleChange}
              />

              <label>{l.mobileNo}</label>
              <input
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
              />

              <label>{l.dob}</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              <label>{l.expiryDate1}</label>
              <input
                type="date"
                name="expiryDate1"
                value={formData.expiryDate1}
                onChange={handleChange}
              />

              <label>{l.expiryDate2}</label>
              <input
                type="date"
                name="expiryDate2"
                value={formData.expiryDate2}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>{l.vehicleDetails}</legend>
            <div>
              <label>{l.vehiclePrmNo}</label>
              <input
                name="vehiclePrmNo"
                value={formData.vehiclePrmNo}
                onChange={handleChange}
              />

              <label>{l.vehicleNumber}</label>
              <input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />

              <label>{l.plateKind}</label>
              <TableDropDown 
                csvPath='\csv\CNIA_JOBS.txt'
                columns={2}
              />

              <label>{l.nationalityVehicle}</label>
              <TableDropDown 
                csvPath='\csv\CNIA_NATS.txt'
                columns={2}
              />

              <label>{l.ownerName}</label>
              <input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
              />

              <label>{l.vehicleCategory}</label>
              <input
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleChange}
              />

              <label>{l.engineNo}</label>
              <input
                name="engineNo"
                value={formData.engineNo}
                onChange={handleChange}
              />

              <label>{l.corresNo}</label>
              <input
                name="corresNo"
                value={formData.corresNo}
                onChange={handleChange}
              />

              <label>{l.placeOfIssue}</label>
              <TableDropDown 
                csvPath='\csv\vehicleplaceofissue.txt'
                columns={2}
              />

              <label>{l.plateKind}</label>
              <TableDropDown 
                csvPath='\csv\platecolour.txt'
                columns={2}
              />

              <label>{l.vehicleType}</label>
              <input
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
              />

              <label>{l.vehicleColor}</label>
              <input
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
              />

              <label>{l.chassisNumber}</label>
              <input
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
              />

              <label>{l.registExpiry}</label>
              <input
                type="date"
                name="registExpiry"
                value={formData.registExpiry}
                onChange={handleChange}
              />

              <label>{l.corresExpiry}</label>
              <input
                type="date"
                name="corresExpiry"
                value={formData.corresExpiry}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        </div>

        <div>
          <label>{l.remarks}</label>
          <input
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        <fieldset>
          <legend>{l.permittedLocationsTitle}</legend>
          <div>
            <div>{l.permittedLocations.contractNo}</div>
            <div>{l.permittedLocations.contractLocationsNo}</div>
            <div>{l.permittedLocations.contractLocationsDesc}</div>
          </div>
          {formData.permittedLocations.map((location, index) => (
            <div key={index}>
              <input
                value={location.contractNo}
                onChange={(e) => handleLocationChange(index, 'contractNo', e.target.value)}
              />
              <input
                value={location.contractLocationsNo}
                onChange={(e) => handleLocationChange(index, 'contractLocationsNo', e.target.value)}
              />
              <input
                value={location.contractLocationsDesc}
                onChange={(e) => handleLocationChange(index, 'contractLocationsDesc', e.target.value)}
              />
            </div>
          ))}
        </fieldset>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : l.print}
          </button>
          <button type="button" onClick={handleClear}>
            {l.clear}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Vehicle;
