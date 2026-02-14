import { useEffect, useState } from 'react';
import './PermitPage.css';
import Form from '../components/Form/Form';
import DatePicker from '../components/DatePicker/DatePicker';
import Input from '../components/Input/Input';
import Dropdown from '../components/Dropdown/Dropdown';
import { TableDropDown } from '../components/DropDownComplicated/TableDropDown';
import { useAuth } from '../lib/AuthContext';
import { getApiUrl } from '../lib/api';

interface Company {
  company: string;
  name: string;
}

function RegisteredPeople() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    nameArabic: '',
    passportNo: '',
    fullResidenceNo: '',
    emiratesIdNo: '',
    nationality: '',
    dob: '',
    passportExpiryDate: '',
    mobileNo: '',
    email: '',
    occupation: '',
    religionDen: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) {
        setCompanies([]);
        return;
      }
      try {
        const response = await fetch(getApiUrl('/api/members/companyCheck'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({})
        });
        if (!response.ok) throw new Error('Failed to fetch companies');
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...formData,
      companyId: formData.companyName,
    };
    void submitPayload(payload);
  };

  const submitPayload = async (payload: typeof formData & { companyId: string }) => {
    try {
      setLoading(true);
      setSubmitSuccess(false);
      setSubmitError(false);
      const response = await fetch(getApiUrl('/api/data/people'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting registered people:', error);
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="permit-page">
      <div className="permit-container">
        <div className="permit-header">
          <h1 className="permit-title">Registered People</h1>
        </div>
        <div className="permit-card">
          <Form onSubmit={handleSubmit}>
            {submitSuccess && (
              <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', marginBottom: '1rem', borderRadius: '4px' }}>
                Saved successfully.
              </div>
            )}
            {submitError && (
              <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '1rem', borderRadius: '4px' }}>
                Error saving. Please try again.
              </div>
            )}
            <fieldset>
              <legend>Person Details</legend>
              <div>
                <label>Company Name</label>
                <Dropdown
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  options={companies.map((company) => ({
                    code: company.company,
                    en: company.name,
                    ar: company.name
                  }))}
                  language="en"
                  placeholder="-- Select a company --"
                />

                <label>Name (Arabic)</label>
                <Input
                  name="nameArabic"
                  value={formData.nameArabic}
                  onChange={handleChange}
                />

                <label>Passport No.</label>
                <Input
                  name="passportNo"
                  value={formData.passportNo}
                  onChange={handleChange}
                />

                <label>Full Residence No.</label>
                <Input
                  name="fullResidenceNo"
                  value={formData.fullResidenceNo}
                  onChange={handleChange}
                />

                <label>Emirates ID No.</label>
                <Input
                  name="emiratesIdNo"
                  value={formData.emiratesIdNo}
                  onChange={handleChange}
                />

                <label>Nationality</label>
                <TableDropDown
                  csvPath="/csv/CNIA_NATS.txt"
                  columns={2}
                  onSelect={(code) =>
                    setFormData((prev) => ({ ...prev, nationality: code }))
                  }
                />

                <label>Date of Birth</label>
                <DatePicker
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />

                <label>Passport Expiry Date</label>
                <DatePicker
                  name="passportExpiryDate"
                  value={formData.passportExpiryDate}
                  onChange={handleChange}
                />

                <label>Mobile No.</label>
                <Input
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                />

                <label>Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <label>Occupation</label>
                <TableDropDown
                  csvPath="/csv/CNIA_JOBS.txt"
                  columns={2}
                  onSelect={(code) =>
                    setFormData((prev) => ({ ...prev, occupation: code }))
                  }
                />

                <label>Religion / Den.</label>
                <TableDropDown
                  csvPath="/csv/CNIA.RELIGION.txt"
                  columns={2}
                  onSelect={(code) =>
                    setFormData((prev) => ({ ...prev, religionDen: code }))
                  }
                />
              </div>
            </fieldset>
            <div className="permit-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default RegisteredPeople;
