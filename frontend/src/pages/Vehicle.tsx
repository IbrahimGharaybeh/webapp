import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import './PermitPage.css';
import { TableDropDown } from '../components/DropDownComplicated/TableDropDown';
import SubmitChoiceModal from '../components/SubmitChoiceModal';
import Form from '../components/Form/Form';
import Dropdown from '../components/Dropdown/Dropdown';
import DatePicker from '../components/DatePicker/DatePicker';
import Input from '../components/Input/Input';
import Textarea from '../components/Textarea/Textarea';

interface Company {
  company: string;
  name: string;
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
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [showSubmitChoice, setShowSubmitChoice] = useState(false);
  const [isDraftChoice, setIsDraftChoice] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    representative: user?.id ?? '',
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
    emiratesIdNo: '',
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
      emiratesIdNo: 'Emirates ID No.',
      emiratesIdNo: 'Emirates ID No.',
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
      autoFillSubmit: 'Auto-fill & Submit',
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
      autoFillSubmit: 'Auto-fill & Submit',
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

  useEffect(() => {
    setFormData(prev => ({ ...prev, representative: user?.id ?? '' }));
  }, [user]);

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
      representative: user?.id ?? '',
      permitType: '',
      transactionType: '',
      unifiedNo: '',
      nameArabic: '',
      nationality: '',
      religionDen: '',
      passportNo: '',
    fullResidenceNo: '',
    occupation: '',
    emiratesIdNo: '',
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
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  const submitPayload = async (payload: typeof formData, draftChoice: boolean | null) => {
    if (draftChoice === null) return;
    try {
      setLoading(true);
      setSubmitSuccess(false);
      setSubmitError(false);
      console.log('Submitting vehicle form payload:', payload);
      const response = await fetch(`${API_URL}/api/data/vehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...payload,
          companyId: payload.companyName,
          isDraft: draftChoice
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      if (!draftChoice) {
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      }
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDraftChoice(null);
    setShowSubmitChoice(true);
  };

  const handleAutoFillSubmit = () => {
    if (!companies.length) return;

    const randomDigits = (length: number) =>
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    const now = new Date();
    const dobDate = new Date(now);
    dobDate.setFullYear(now.getFullYear() - 30);
    const expiryDate = new Date(now);
    expiryDate.setFullYear(now.getFullYear() + 1);

    setFormData(prev => ({
      ...prev,
      companyName: companies[0]?.company ?? '',
      permitType: String(vehiclePermitTypes[0]?.code ?? ''),
      transactionType: String(transactionTypes[0]?.code ?? ''),
      unifiedNo: randomDigits(9),
      nameArabic: 'Test User',
      nationality: '101',
      religionDen: '1',
      passportNo: randomDigits(9),
      fullResidenceNo: randomDigits(10),
      occupation: '1',
      emiratesIdNo: randomDigits(15),
      personPrmNo: randomDigits(8),
      mobileNo: randomDigits(10),
      dob: formatDate(dobDate),
      expiryDate1: formatDate(expiryDate),
      expiryDate2: formatDate(expiryDate),
      vehiclePrmNo: randomDigits(8),
      vehicleNumber: randomDigits(6),
      plateKind1: '1',
      nationalityVehicle: '101',
      ownerName: 'Owner',
      vehicleCategory: '1',
      engineNo: randomDigits(8),
      corresNo: randomDigits(6),
      placeOfIssue: '1',
      plateKind2: '1',
      vehicleType: '1',
      vehicleColor: 'Blue',
      chassisNumber: randomDigits(12),
      registExpiry: formatDate(expiryDate),
      corresExpiry: formatDate(expiryDate),
      remarks: 'Auto-filled',
      permittedLocations: Array.from({ length: 6 }, (_, index) => ({
        contractNo: randomDigits(6),
        contractLocationsNo: randomDigits(4),
        contractLocationsDesc: `Location ${index + 1}`
      }))
    }));
    setIsDraftChoice(null);
    setShowSubmitChoice(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <main className="permit-page">
      <div className="permit-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="permit-header">
          <h1 className="permit-title">{l.formTitle}</h1>
          <button type="button" onClick={toggleLanguage} className="permit-toggle">
            {l.switchLanguage}
          </button>
        </div>

      <div className="permit-card">
      <Form onSubmit={handleSubmit}>
        {submitSuccess && (
          <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', marginBottom: '1rem', borderRadius: '4px' }}>
            {l.submitSuccess ?? 'Form submitted successfully!'}
          </div>
        )}
        {submitError && (
          <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '1rem', borderRadius: '4px' }}>
            {l.submitError ?? 'Error submitting form. Please try again.'}
          </div>
        )}

        <fieldset>
          <legend>{l.companyPermitInfo}</legend>
          <div>
            <label>{l.companyName}</label>
            <Dropdown
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              options={companies.map(company => ({
                code: company.company,
                en: company.name,
                ar: company.name
              }))}
              language={language}
              placeholder={l.selectCompany}
            />

            <label>{l.permitType}</label>
            <Dropdown
              name="permitType"
              value={formData.permitType}
              onChange={handleChange}
              options={vehiclePermitTypes}
              language={language}
              placeholder={l.select}
            />

            <label>{l.transactionType}</label>
            <Dropdown
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              options={transactionTypes}
              language={language}
              placeholder={l.select}
            />
          </div>
        </fieldset>

        <div>
          <fieldset>
            <legend>{l.driverDetails}</legend>
            <div>
              <label>{l.unifiedNo}</label>
              <Input
                name="unifiedNo"
                value={formData.unifiedNo}
                onChange={handleChange}
              />

              <label>{l.nameArabic}</label>
              <Input
                name="nameArabic"
                value={formData.nameArabic}
                onChange={handleChange}
              />

              <label>{l.nationality}</label>
              <TableDropDown 
                csvPath='/csv/CNIA_NATS.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, nationality: code }))
                }
              />

              <label>{l.religionDen}</label>
              <TableDropDown 
                csvPath='/csv/CNIA.RELIGION.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, religionDen: code }))
                }
              />

              <label>{l.passportNo}</label>
              <Input
                name="passportNo"
                value={formData.passportNo}
                onChange={handleChange}
              />

              <label>{l.fullResidenceNo}</label>
              <Input
                name="fullResidenceNo"
                value={formData.fullResidenceNo}
                onChange={handleChange}
              />

              <label>{l.occupation}</label>
              <TableDropDown 
                csvPath='/csv/CNIA_JOBS.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, occupation: code }))
                }
              />

              <label>{l.emiratesIdNo}</label>
              <Input
                name="emiratesIdNo"
                value={formData.emiratesIdNo}
                onChange={handleChange}
              />

              <label>{l.personPrmNo}</label>
              <Input
                name="personPrmNo"
                value={formData.personPrmNo}
                onChange={handleChange}
              />

              <label>{l.mobileNo}</label>
              <Input
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
              />

              <label>{l.dob}</label>
              <DatePicker
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              <label>{l.expiryDate1}</label>
              <DatePicker
                name="expiryDate1"
                value={formData.expiryDate1}
                onChange={handleChange}
              />

              <label>{l.expiryDate2}</label>
              <DatePicker
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
              <Input
                name="vehiclePrmNo"
                value={formData.vehiclePrmNo}
                onChange={handleChange}
              />

              <label>{l.vehicleNumber}</label>
              <Input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />

              <label>{l.plateKind}</label>
              <TableDropDown 
                csvPath='/csv/CNIA_CAR_PLATE_TYPES.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, plateKind1: code }))
                }
              />

              <label>{l.nationalityVehicle}</label>
              <TableDropDown 
                csvPath='/csv/CNIA_NATS.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, nationalityVehicle: code }))
                }
              />

              <label>{l.ownerName}</label>
              <Input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
              />

              <label>{l.vehicleCategory}</label>
              <Input
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleChange}
              />

              <label>{l.engineNo}</label>
              <Input
                name="engineNo"
                value={formData.engineNo}
                onChange={handleChange}
              />

              <label>{l.corresNo}</label>
              <Input
                name="corresNo"
                value={formData.corresNo}
                onChange={handleChange}
              />

              <label>{l.placeOfIssue}</label>
              <TableDropDown 
                csvPath='/csv/vehicleplaceofissue.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, placeOfIssue: code }))
                }
              />

              <label>{l.plateKind}</label>
              <TableDropDown 
                csvPath='/csv/CNIA_CAR_PLATE_COLORS.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, plateKind2: code }))
                }
              />

              <label>{l.vehicleType}</label>
              <Input
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
              />

              <label>{l.vehicleColor}</label>
              <Input
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
              />

              <label>{l.chassisNumber}</label>
              <Input
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
              />

              <label>{l.registExpiry}</label>
              <DatePicker
                name="registExpiry"
                value={formData.registExpiry}
                onChange={handleChange}
              />

              <label>{l.corresExpiry}</label>
              <DatePicker
                name="corresExpiry"
                value={formData.corresExpiry}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        </div>

        <div>
          <label>{l.remarks}</label>
          <Textarea
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
              <Input
                value={location.contractNo}
                onChange={(e) => handleLocationChange(index, 'contractNo', e.target.value)}
              />
              <Input
                value={location.contractLocationsNo}
                onChange={(e) => handleLocationChange(index, 'contractLocationsNo', e.target.value)}
              />
              <Input
                value={location.contractLocationsDesc}
                onChange={(e) => handleLocationChange(index, 'contractLocationsDesc', e.target.value)}
              />
            </div>
          ))}
        </fieldset>

        <div className="permit-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : l.print}
          </button>
          <button type="button" onClick={handleAutoFillSubmit} disabled={loading || !companies.length}>
            {l.autoFillSubmit}
          </button>
          <button type="button" onClick={handleClear}>
            {l.clear}
          </button>
        </div>
      </Form>
      <SubmitChoiceModal
        open={showSubmitChoice}
        onCancel={() => {
          setShowSubmitChoice(false);
          setIsDraftChoice(null);
        }}
        onChoose={async (draftChoice) => {
          setIsDraftChoice(draftChoice);
          setShowSubmitChoice(false);
          await submitPayload(formData, draftChoice);
        }}
      />
      </div>
    </div>
    </main>
  );
}

export default Vehicle;






