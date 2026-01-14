import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import './PermitPage.css';
import SubmitChoiceModal from '../components/SubmitChoiceModal';
import Form from '../components/Form/Form';
import Dropdown from '../components/Dropdown/Dropdown';
import DatePicker from '../components/DatePicker/DatePicker';
import Input from '../components/Input/Input';
import Textarea from '../components/Textarea/Textarea';
import { TableDropDown } from '../components/DropDownComplicated/TableDropDown';
import {
  ShipLocationsDropDown,
  ShipPortsDropDown,
  ShipTypesDropDown
} from '../components/DropDownComplicated/ShipDropDowns';

interface Company {
  company: string;
  name: string;
}

interface CrewMember {
  permissionNo: string;
  name: string;
}

interface PermittedLocation {
  contractNo: string;
  contractLocationsNo: string;
  contractLocationsDesc: string;
}

interface ShipProps {
  initialLanguage?: 'en' | 'ar';
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function Ship({ initialLanguage = 'en' }: ShipProps) {
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
    shipPrmNo: '',
    shipNumber: '',
    shipName: '',
    crewCount: '',
    totalWeight: '',
    callSignChannel: '',
    navigLicValidity: '',
    shipsOwner: '',
    shipsCategory: '',
    shipsNationality: '',
    registrationPort: '',
    permanentHarbor: '',
    assignedActivity: '',
    remarks: '',
    crew: Array.from({ length: 10 }, () => ({ 
      permissionNo: '', 
      name: '' 
    })),
    permittedLocations: Array.from({ length: 6 }, () => ({
      contractNo: '',
      contractLocationsNo: '',
      contractLocationsDesc: ''
    }))
  });

  const labels = {
    en: {
      formTitle: 'Application form for security permit for ships',
      companyPermitInfo: 'Company and Permit Info',
      shipDetails: 'Ship Details',
      crew: 'Crew',
      permittedLocationsTitle: 'Permitted Locations',
      companyName: 'Company Name',
      representative: 'Representative',
      permitType: 'Permit Type',
      transactionType: 'Transaction Type',
      shipPrmNo: 'Ship Prm No.',
      shipNumber: 'Ship Number',
      shipName: 'Ship Name',
      crewCount: 'Crew Count',
      totalWeight: 'Total Weight',
      callSignChannel: 'Call Sign/Channel',
      navigLicValidity: 'Navig. Lic. Validity',
      shipsOwner: "Ship's Owner",
      shipsCategory: "Ship's Category",
      shipsNationality: "Ship's Nationality",
      registrationPort: 'Registration Port',
      permanentHarbor: 'Permanent Harbor',
      assignedActivity: 'Assigned Activity',
      remarks: 'Remarks',
      permissionNo: 'Permission No',
      name: 'Name',
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
      formTitle: 'نموذج طلب تصريح أمني للسفن',
      companyPermitInfo: 'بيانات الشركة و التصريح',
      shipDetails: 'بيانات السفينة',
      crew: 'الطاقم',
      permittedLocationsTitle: 'المناطق المصرح بها',
      companyName: 'اسم الشركة',
      representative: 'الممثل',
      permitType: 'نوع التصريح',
      transactionType: 'نوع المعاملة',
      shipPrmNo: 'رقم تصريح السفينة',
      shipNumber: 'رقم السفينة',
      shipName: 'اسم السفينة',
      crewCount: 'عدد الطاقم',
      totalWeight: 'الوزن الإجمالي',
      callSignChannel: 'إشارة النداء/القناة',
      navigLicValidity: 'صلاحية رخصة الملاحة',
      shipsOwner: 'مالك السفينة',
      shipsCategory: 'فئة السفينة',
      shipsNationality: 'جنسية السفينة',
      registrationPort: 'ميناء التسجيل',
      permanentHarbor: 'المرفأ الدائم',
      assignedActivity: 'النشاط المخصص',
      remarks: 'ملاحظات',
      permissionNo: 'رقم الإذن',
      name: 'الاسم',
      permittedLocations: {
        contractNo: 'رقم العقد',
        contractLocationsNo: 'رقم مواقع العقد',
        contractLocationsDesc: 'وصف مواقع العقد'
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

  const handleCrewChange = (index: number, field: string, value: string) => {
    const newCrew = [...formData.crew];
    newCrew[index] = { ...newCrew[index], [field]: value };
    setFormData(prev => ({ ...prev, crew: newCrew }));
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
      shipPrmNo: '',
      shipNumber: '',
      shipName: '',
      crewCount: '',
      totalWeight: '',
      callSignChannel: '',
      navigLicValidity: '',
      shipsOwner: '',
      shipsCategory: '',
      shipsNationality: '',
      registrationPort: '',
      permanentHarbor: '',
      assignedActivity: '',
      remarks: '',
      crew: Array.from({ length: 10 }, () => ({ 
        permissionNo: '', 
        name: '' 
      })),
      permittedLocations: Array.from({ length: 6 }, () => ({
        contractNo: '',
        contractLocationsNo: '',
        contractLocationsDesc: ''
      }))
    });
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  const normalizePayload = (payload: typeof formData) => {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => {
        if (typeof value === 'string' && value.trim() === '') {
          return [key, null];
        }
        return [key, value];
      })
    ) as typeof formData;
  };

  const submitPayload = async (payload: typeof formData, draftChoice: boolean | null) => {
    if (draftChoice === null) return;
    try {
      setLoading(true);
      setSubmitSuccess(false);
      setSubmitError(false);
      const normalizedPayload = normalizePayload(payload);
      console.log('Submitting ship form payload:', normalizedPayload);
      const response = await fetch(`${API_URL}/api/data/ship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...normalizedPayload,
          companyId: normalizedPayload.companyName,
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
    const expiryDate = new Date(now);
    expiryDate.setFullYear(now.getFullYear() + 1);

    setFormData(prev => ({
      ...prev,
      companyName: companies[0]?.company ?? '',
      permitType: '1',
      transactionType: String(transactionTypes[0]?.code ?? ''),
      shipPrmNo: randomDigits(8),
      shipNumber: randomDigits(6),
      shipName: 'Test Ship',
      crewCount: '10',
      totalWeight: randomDigits(5),
      callSignChannel: randomDigits(4),
      navigLicValidity: formatDate(expiryDate),
      shipsOwner: 'Owner',
      shipsCategory: '1',
      shipsNationality: '101',
      registrationPort: '1',
      permanentHarbor: '1',
      assignedActivity: 'Activity',
      remarks: 'Auto-filled',
      crew: Array.from({ length: 10 }, (_, index) => ({
        permissionNo: randomDigits(6),
        name: `Crew ${index + 1}`
      })),
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
              options={[]}
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
            <legend>{l.shipDetails}</legend>
            <div>
              <label>{l.shipPrmNo}</label>
              <Input
                name="shipPrmNo"
                value={formData.shipPrmNo}
                onChange={handleChange}
              />

              <label>{l.shipNumber}</label>
              <Input
                name="shipNumber"
                value={formData.shipNumber}
                onChange={handleChange}
              />

              <label>{l.shipName}</label>
              <Input
                name="shipName"
                value={formData.shipName}
                onChange={handleChange}
              />

              <label>{l.crewCount}</label>
              <Input
                name="crewCount"
                value={formData.crewCount}
                onChange={handleChange}
              />

              <label>{l.totalWeight}</label>
              <Input
                name="totalWeight"
                value={formData.totalWeight}
                onChange={handleChange}
              />

              <label>{l.callSignChannel}</label>
              <Input
                name="callSignChannel"
                value={formData.callSignChannel}
                onChange={handleChange}
              />

              <label>{l.navigLicValidity}</label>
              <DatePicker
                name="navigLicValidity"
                value={formData.navigLicValidity}
                onChange={handleChange}
              />

              <label>{l.shipsOwner}</label>
              <Input
                name="shipsOwner"
                value={formData.shipsOwner}
                onChange={handleChange}
              />

              <label>{l.shipsCategory}</label>
              <ShipTypesDropDown
                value={formData.shipsCategory}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, shipsCategory: code }))
                }
              />

              <label>{l.shipsNationality}</label>
              <TableDropDown
                csvPath='/csv/CNIA_NATS.txt'
                columns={2}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, shipsNationality: code }))
                }
              />

              <label>{l.registrationPort}</label>
              <ShipPortsDropDown
                value={formData.registrationPort}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, registrationPort: code }))
                }
              />

              <label>{l.permanentHarbor}</label>
              <ShipLocationsDropDown
                value={formData.permanentHarbor}
                onSelect={(code) =>
                  setFormData(prev => ({ ...prev, permanentHarbor: code }))
                }
              />

              <label>{l.assignedActivity}</label>
              <Input
                name="assignedActivity"
                value={formData.assignedActivity}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>{l.crew}</legend>
            <div>
              <div></div>
              <div>{l.permissionNo}</div>
              <div>{l.name}</div>
            </div>
            {formData.crew.map((member, index) => (
              <div key={index}>
                <label>{index + 1}</label>
                <Input
                  value={member.permissionNo}
                  onChange={(e) => handleCrewChange(index, 'permissionNo', e.target.value)}
                />
                <Input
                  value={member.name}
                  onChange={(e) => handleCrewChange(index, 'name', e.target.value)}
                />
              </div>
            ))}
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

export default Ship;






