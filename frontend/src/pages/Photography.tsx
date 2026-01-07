import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import './PermitPage.css';
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

interface Camera {
  cameraNo: string;
  cameraBrand: string;
}

interface PermittedLocation {
  contractNo: string;
  contractLocationsNo: string;
  contractLocationsDesc: string;
}

interface PhotographyProps {
  initialLanguage?: 'en' | 'ar';
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function Photography({ initialLanguage = 'en' }: PhotographyProps) {
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
    unifiedNo: '',
    nameArabic: '',
    nationality: '',
    religionDen: '',
    passportNo: '',
    fullResidenceNo: '',
    occupation: '',
    emiratesIdNo: '',
    mobileNo: '',
    permissionNo: '',
    dob: '',
    expiryDate1: '',
    expiryDate2: '',
    remarks: '',
    cameras: Array.from({ length: 6 }, () => ({ 
      cameraNo: '', 
      cameraBrand: '' 
    })),
    permittedLocations: Array.from({ length: 6 }, () => ({
      contractNo: '',
      contractLocationsNo: '',
      contractLocationsDesc: ''
    }))
  });

  const labels = {
    en: {
      formTitle: 'Application form for photography permit',
      companyPermitInfo: 'Company and Permit Info',
      applicantDetails: "Applicant's Details",
      cameraEquipment: 'Camera Equipment',
      permittedLocationsTitle: 'Permitted Locations',
      companyName: 'Company Name',
      representative: 'Representative',
      permitType: 'Permit Type',
      transactionType: 'Transaction Type',
      unifiedNo: 'Unified No.',
      nameArabic: 'Name in Arabic',
      nationality: 'Nationality',
      religionDen: 'Religion/Den',
      passportNo: 'Passport No',
      fullResidenceNo: 'Full Residence No',
      occupation: 'Occupation',
      emiratesIdNo: 'Emirates ID No.',
      mobileNo: 'Mobile No.',
      permissionNo: 'Permission No.',
      dob: 'Date of Birth',
      expiryDate1: 'Expiry Date',
      expiryDate2: 'Expiry Date',
      remarks: 'Remarks',
      cameraNo: 'Camera No',
      cameraBrand: 'Camera Brand',
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
      formTitle: 'نموذج طلب تصريح التصوير',
      companyPermitInfo: 'بيانات الشركة و التصريح',
      applicantDetails: 'بيانات طلب التصريح',
      cameraEquipment: 'معدات التصوير',
      permittedLocationsTitle: 'المناطق المصرح بها',
      companyName: 'اسم الشركة',
      representative: 'الممثل',
      permitType: 'نوع التصريح',
      transactionType: 'نوع المعاملة',
      unifiedNo: 'الرقم الموحد',
      nameArabic: 'الاسم بالعربية',
      nationality: 'الجنسية',
      religionDen: 'الديانة/الطائفة',
      passportNo: 'رقم الجواز',
      fullResidenceNo: 'رقم الإقامة الكامل',
      occupation: 'المهنة',
      emiratesIdNo: 'رقم الهوية الإماراتية',
      mobileNo: 'رقم الجوال',
      permissionNo: 'رقم الإذن',
      dob: 'تاريخ الميلاد',
      expiryDate1: 'تاريخ الانتهاء',
      expiryDate2: 'تاريخ الانتهاء',
      remarks: 'ملاحظات',
      cameraNo: 'رقم الكاميرا',
      cameraBrand: 'ماركة الكاميرا',
      permittedLocations: {
        contractNo: 'رقم العقد',
        contractLocationsNo: 'رقم مواقع العقد',
        contractLocationsDesc: 'وصف مواقع العقد'
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

  const handleCameraChange = (index: number, field: string, value: string) => {
    const newCameras = [...formData.cameras];
    newCameras[index] = { ...newCameras[index], [field]: value };
    setFormData(prev => ({ ...prev, cameras: newCameras }));
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
      emiratesIdNo: '',
      mobileNo: '',
      permissionNo: '',
      dob: '',
      expiryDate1: '',
      expiryDate2: '',
      remarks: '',
      cameras: Array.from({ length: 6 }, () => ({ 
        cameraNo: '', 
        cameraBrand: '' 
      })),
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
      const response = await fetch('/api/permits/photography', {
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
    <main className="permit-page">
      <div className="permit-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="permit-header">
          <h1 className="permit-title">{l.formTitle}</h1>
          <button type="button" onClick={toggleLanguage} className="permit-toggle">
            {l.switchLanguage}
          </button>
        </div>

      <div className="permit-card">
      <form onSubmit={handleSubmit}>

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

        <fieldset>
          <legend>{l.applicantDetails}</legend>
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
              csvPath='/csv/CNIA_NATS.txt'
              columns={2}
            />

            <label>{l.religionDen}</label>
            <TableDropDown 
              csvPath='/csv/CNIA.RELIGION.txt'
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
              csvPath='/csv/CNIA_JOBS.txt'
              columns={2}
            />

            <label>{l.emiratesIdNo}</label>
            <input
              name="emiratesIdNo"
              value={formData.emiratesIdNo}
              onChange={handleChange}
            />

            <label>{l.mobileNo}</label>
            <input
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
            />

            <label>{l.permissionNo}</label>
            <input
              name="permissionNo"
              value={formData.permissionNo}
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
          <legend>{l.cameraEquipment}</legend>
          <div>
            <div>{l.cameraNo}</div>
            <div>{l.cameraBrand}</div>
          </div>
          {formData.cameras.map((camera, index) => (
            <div key={index}>
              <input
                value={camera.cameraNo}
                onChange={(e) => handleCameraChange(index, 'cameraNo', e.target.value)}
              />
              <input
                value={camera.cameraBrand}
                onChange={(e) => handleCameraChange(index, 'cameraBrand', e.target.value)}
              />
            </div>
          ))}
        </fieldset>

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

        <div className="permit-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : l.print}
          </button>
          <button type="button" onClick={handleClear}>
            {l.clear}
          </button>
        </div>
      </form>
      </div>
    </div>
    </main>
  );
}

export default Photography;

