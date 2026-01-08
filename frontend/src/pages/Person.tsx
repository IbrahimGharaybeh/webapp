import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import './PermitPage.css';
import Form from '../components/Form/Form';
import Dropdown from '../components/Dropdown/Dropdown';
import DatePicker from '../components/DatePicker/DatePicker';
import Input from '../components/Input/Input';
import Textarea from '../components/Textarea/Textarea';
import { TableDropDown } from '../components/DropDownComplicated/TableDropDown';
import SubmitChoiceModal from '../components/SubmitChoiceModal';

interface Company {
  company: string;
  name: string;
}

interface Religion {
  religion_id: number;
  religion_name_ar: string;
  religion_name_en: string;
}

interface PermittedLocation {
  contractNo: string;
  contractLocationsNo: string;
  contractLocationsDesc: string;
}

interface PersonProps {
  initialLanguage?: 'en' | 'ar';
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function Person({ initialLanguage = 'en' }: PersonProps) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<'en' | 'ar'>(initialLanguage);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSubmitChoice, setShowSubmitChoice] = useState(false);
  const [isDraftChoice, setIsDraftChoice] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    representative: user?.id ?? '',
    permitType: '',
    transactionType: '',
    unifiedNo: '',
    nameArabic: '',
    nationality: '',
    religionDen: '',
    passportNo: '',
    passportExpiryDate: '',
    fullResidenceNo: '',
    occupation: '',
    emiratesIdNo: '',
    molNo: '',
    mobileNo: '',
    permissionNo: '',
    dob: '',
    expiryDate1: '',
    expiryDate2: '',
    email: '',
    instagram: '',
    twitter: '',
    facebook: '',
    others: '',
    remarks: '',
    permittedLocations: Array.from({ length: 6 }, () => ({
      contractNo: '',
      contractLocationsNo: '',
      contractLocationsDesc: ''
    }))
  });

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #0b1224 100%)',
    color: '#e5e7eb',
    padding: '32px 16px'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gap: '16px'
  };

  const cardStyle: React.CSSProperties = {
    background: '#0b1224',
    border: '1px solid #1f2937',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.28)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px'
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#f8fafc'
  };

  const toggleWrapStyle: React.CSSProperties = {
    textAlign: 'right',
    marginBottom: '1rem'
  };

  const toggleButtonStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #1f2937',
    background: '#111827',
    color: '#f8fafc',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
  };

  const sectionStyle: React.CSSProperties = {
    display: 'grid',
    gap: '16px'
  };

  const labels = {
    en: {
      companyName: 'Company Name',
      representative: 'Representative',
      permitType: 'Permit Type',
      transactionType: 'Transaction Type',
      unifiedNo: 'Unified No.',
      nameArabic: 'Name in Arabic',
      nationality: 'Nationality',
      religionDen: 'Religion/Den',
      passportNo: 'Passport No',
      passportExpiryDate: 'Passport Expiry Date',
      fullResidenceNo: 'Full Residence No',
      occupation: 'Occupation',
      emiratesIdNo: 'Emirates ID No.',
      molNo: 'MOL No.',
      mobileNo: 'Mobile No.',
      permissionNo: 'Permission No.',
      dob: 'Date of Birth',
      expiryDate1: 'Expiry Date',
      expiryDate2: 'Expiry Date',
      email: 'Email',
      instagram: 'Instagram',
      twitter: 'Twitter',
      facebook: 'Facebook',
      others: 'Others',
      remarks: 'Remarks',
      permittedLocations: {
        contractNo: 'Contract No',
        contractLocationsNo: 'Contract Locations No',
        contractLocationsDesc: 'Contract Locations Desc'
      },
      formTitle: 'Application form for security permit for persons',
      companyPermitInfo: 'Company and Permit Info',
      applicantDetails: "Applicant's Details",
      permittedLocationsTitle: 'Permitted Locations',
      print: 'Print',
      clear: 'Clear',
      submit: 'Submit',
      autoFillSubmit: 'Auto-fill & Submit',
      selectCompany: '-- Select a company --',
      select: '-- Select --',
      switchLanguage: 'عربي',
      loading: 'Loading...',
      submitSuccess: 'Form submitted successfully!',
      submitError: 'Error submitting form. Please try again.'
    },
    ar: {
      companyName: 'اسم الشركة',
      representative: 'الممثل',
      permitType: 'نوع التصريح',
      transactionType: 'نوع المعاملة',
      unifiedNo: 'الرقم الموحد',
      nameArabic: 'الاسم بالعربية',
      nationality: 'الجنسية',
      religionDen: 'الديانة/الطائفة',
      passportNo: 'رقم الجواز',
      passportExpiryDate: 'Passport Expiry Date',
      fullResidenceNo: 'رقم الإقامة الكامل',
      occupation: 'المهنة',
      emiratesIdNo: 'رقم الهوية الإماراتية',
      molNo: 'MOL No.',
      mobileNo: 'رقم الجوال',
      permissionNo: 'رقم الإذن',
      dob: 'تاريخ الميلاد',
      expiryDate1: 'تاريخ الانتهاء',
      expiryDate2: 'تاريخ الانتهاء',
      email: 'البريد الإلكتروني',
      instagram: 'انستجرام',
      twitter: 'تويتر',
      facebook: 'فيسبوك',
      others: 'أخرى',
      remarks: 'ملاحظات',
      permittedLocations: {
        contractNo: 'رقم العقد',
        contractLocationsNo: 'رقم مواقع العقد',
        contractLocationsDesc: 'وصف مواقع العقد'
      },
      formTitle: 'نموذج طلب تصريح أمني للأشخاص',
      companyPermitInfo: 'بيانات الشركة و التصريح',
      applicantDetails: 'بيانات طلب التصريح',
      permittedLocationsTitle: 'المناطق المصرح بها',
      print: 'طباعة',
      clear: 'تفريغ الحقول',
      submit: 'إرسال',
      autoFillSubmit: 'Auto-fill & Submit',
      selectCompany: '-- اختر شركة --',
      select: '-- اختر --',
      switchLanguage: 'English',
      loading: 'جاري التحميل...',
      submitSuccess: 'تم إرسال النموذج بنجاح!',
      submitError: 'خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى.'
    }
  };

  const transactionTypes = [
    { code: 1, en: 'New', ar: 'إصدار' },
    { code: 2, en: 'Renew', ar: 'تجديد' },
    { code: 3, en: 'Cancel', ar: 'إلغاء' },
    { code: 4, en: 'Missing', ar: 'بدل فاقد' },
    { code: 5, en: 'Damaged', ar: 'بدل تالف' },
    { code: 6, en: 'New with Vehicle', ar: 'إصدار مع مركبة' },
    { code: 7, en: 'Renew with Vehicle', ar: 'تجديد مع مركبة' },
    { code: 8, en: 'Missing with Vehicle', ar: 'بدل فاقد أفراد مع مركبة' },
    { code: 9, en: 'Personal cancel with vehicle', ar: 'إلغاء أفراد مع مركبة' },
    { code: 10, en: 'New Personal 2 years', ar: 'إصدار أفراد سنتين' },
    { code: 11, en: 'Renew Personal 2 years', ar: 'تجديد أفراد سنتين' },
    { code: 12, en: 'Personal 2 years cancel', ar: 'إلغاء أفراد سنتين' },
    { code: 13, en: 'Personal 2 years missing', ar: 'بدل فاقد سنتين' },
    { code: 14, en: 'Personal 2 years with vehicle', ar: 'إصدار أفراد سنتين مع مركبة' },
    { code: 15, en: 'Personal 2 years with vehicle renew', ar: 'تجديد أفراد سنتين مع مركبة' },
    { code: 16, en: 'Personal 2 years with vehicle cancel', ar: 'إلغاء أفراد سنتين مع مركبة' }
  ];

  const permitTypes = [
    { code: 1, en: 'Onshore', ar: 'بري داخل' },
    { code: 2, en: 'Offshore', ar: 'بحري داخل' },
    { code: 3, en: 'Temporary - 1 month', ar: 'مؤقت - شهر' },
    { code: 4, en: 'Representative', ar: 'مندوب' }
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
  // Fetch religions on component mount
  useEffect(() => {
    const fetchReligions = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API endpoint
        const response = await fetch('/api/religions');
        const data = await response.json();
        setReligions(data);
      } catch (error) {
        console.error('Error fetching religions:', error);
        setReligions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReligions();
  }, []);

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
      passportExpiryDate: '',
      fullResidenceNo: '',
      occupation: '',
      emiratesIdNo: '',
      molNo: '',
      mobileNo: '',
      permissionNo: '',
      dob: '',
      expiryDate1: '',
      expiryDate2: '',
      email: '',
      instagram: '',
      twitter: '',
      facebook: '',
      others: '',
      remarks: '',
      permittedLocations: Array.from({ length: 6 }, () => ({
        contractNo: '',
        contractLocationsNo: '',
        contractLocationsDesc: ''
      }))
    });
    setSubmitSuccess(false);
  };

  const submitPayload = async (payload: typeof formData, draftChoice: boolean | null) => {
    if (draftChoice === null) return;
    try {
      setLoading(true);
      setSubmitSuccess(false);
      console.log('Submitting person form payload:', payload);
      
      // TODO: Replace with actual API endpoint
      const response = await fetch(`${API_URL}/api/data/person`, {
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
      
      // Optionally clear form after successful submission
      // handleClear();
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDraftChoice(null);
    setShowSubmitChoice(true);
  };

  const handleAutoFillSubmit = async () => {
    if (!companies.length) return;

    const randomDigits = (length: number) =>
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    const now = new Date();
    const dobDate = new Date(now);
    dobDate.setFullYear(now.getFullYear() - 30);
    const expiryDate = new Date(now);
    expiryDate.setFullYear(now.getFullYear() + 1);

    const randomData = {
      ...formData,
      companyName: companies[1]?.company ?? '',
      permitType: String(permitTypes[0]?.code ?? ''),
      transactionType: String(transactionTypes[0]?.code ?? ''),
      unifiedNo: randomDigits(9),
      nameArabic: 'Test User',
      nationality: '101',
      religionDen: '1',
      passportNo: randomDigits(9),
      passportExpiryDate: formatDate(expiryDate),
      fullResidenceNo: randomDigits(10),
      occupation: '1',
      emiratesIdNo: randomDigits(15),
      molNo: randomDigits(10),
      mobileNo: randomDigits(10),
      permissionNo: randomDigits(8),
      dob: formatDate(dobDate),
      expiryDate1: formatDate(expiryDate),
      expiryDate2: formatDate(expiryDate),
      email: `test${randomDigits(4)}@example.com`,
      instagram: '@test',
      twitter: '@test',
      facebook: 'test',
      others: '',
      remarks: 'Auto-filled',
      permittedLocations: Array.from({ length: 6 }, (_, index) => ({
        contractNo: randomDigits(6),
        contractLocationsNo: randomDigits(4),
        contractLocationsDesc: `Location ${index + 1}`
      }))
    };

    setFormData(randomData);
    setIsDraftChoice(null);
    setShowSubmitChoice(true);
  };

  const handleChoice = async (draftChoice: boolean) => {
    setIsDraftChoice(draftChoice);
    setShowSubmitChoice(false);
    await submitPayload(formData, draftChoice);
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
            {l.submitSuccess}
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
              options={permitTypes}
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
            <legend>{l.applicantDetails}</legend>
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
              <label>{l.passportExpiryDate}</label>
              <DatePicker
                name="passportExpiryDate"
                value={formData.passportExpiryDate}
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
              <label>{l.molNo}</label>
              <Input
                name="molNo"
                value={formData.molNo}
                onChange={handleChange}
              />
              <label>{l.mobileNo}</label>
              <Input
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
              />
              <label>{l.permissionNo}</label>
              <Input
                name="permissionNo"
                value={formData.permissionNo}
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
            <div>
              <label>{l.email}</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label>{l.instagram}</label>
              <Input
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />

              <label>{l.twitter}</label>
              <Input
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
              />

              <label>{l.facebook}</label>
              <Input
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />

              <label>{l.others}</label>
              <Input
                name="others"
                value={formData.others}
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
            {loading ? l.loading : l.submit}
          </button>
          <button type="button" onClick={handleAutoFillSubmit} disabled={loading || !companies.length}>
            {l.autoFillSubmit || 'Auto-fill & Submit'}
          </button>
          <button type="button" onClick={handlePrint}>
            {l.print}
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
        onChoose={handleChoice}
      />
      </div>
    </div>
    </main>
  );
}

export default Person;

