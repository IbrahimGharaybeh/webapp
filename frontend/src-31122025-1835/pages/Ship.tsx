import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

interface Company {
  company: string;
  name: string;
}

interface Representative {
  rep_id: number;
  rep_name_ar: string;
  rep_name_en: string;
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
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
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
      representative: '',
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/permits/ship', {
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
            <legend>{l.shipDetails}</legend>
            <div>
              <label>{l.shipPrmNo}</label>
              <input
                name="shipPrmNo"
                value={formData.shipPrmNo}
                onChange={handleChange}
              />

              <label>{l.shipNumber}</label>
              <input
                name="shipNumber"
                value={formData.shipNumber}
                onChange={handleChange}
              />

              <label>{l.shipName}</label>
              <input
                name="shipName"
                value={formData.shipName}
                onChange={handleChange}
              />

              <label>{l.crewCount}</label>
              <select
                name="crewCount"
                value={formData.crewCount}
                onChange={handleChange}
              >
                <option value="">{l.select}</option>
              </select>

              <label>{l.totalWeight}</label>
              <input
                name="totalWeight"
                value={formData.totalWeight}
                onChange={handleChange}
              />

              <label>{l.callSignChannel}</label>
              <input
                name="callSignChannel"
                value={formData.callSignChannel}
                onChange={handleChange}
              />

              <label>{l.navigLicValidity}</label>
              <input
                type="date"
                name="navigLicValidity"
                value={formData.navigLicValidity}
                onChange={handleChange}
              />

              <label>{l.shipsOwner}</label>
              <input
                name="shipsOwner"
                value={formData.shipsOwner}
                onChange={handleChange}
              />

              <label>{l.shipsCategory}</label>
              <select
                name="shipsCategory"
                value={formData.shipsCategory}
                onChange={handleChange}
              >
                <option value="">{l.select}</option>
              </select>

              <label>{l.shipsNationality}</label>
              <input
                name="shipsNationality"
                value={formData.shipsNationality}
                onChange={handleChange}
              />

              <label>{l.registrationPort}</label>
              <select
                name="registrationPort"
                value={formData.registrationPort}
                onChange={handleChange}
              >
                <option value="">{l.select}</option>
              </select>

              <label>{l.permanentHarbor}</label>
              <select
                name="permanentHarbor"
                value={formData.permanentHarbor}
                onChange={handleChange}
              >
                <option value="">{l.select}</option>
              </select>

              <label>{l.assignedActivity}</label>
              <input
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
                <input
                  value={member.permissionNo}
                  onChange={(e) => handleCrewChange(index, 'permissionNo', e.target.value)}
                />
                <input
                  value={member.name}
                  onChange={(e) => handleCrewChange(index, 'name', e.target.value)}
                />
              </div>
            ))}
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

export default Ship;
