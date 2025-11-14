import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PERMIT_TYPES: Record<number, string> = {
  1: 'Person',
  2: 'Vehicle',
  3: 'Ship',
  4: 'Photography'
};

const PERMIT_ROUTES: Record<number, string> = {
  1: '/person',
  2: '/vehicle',
  3: '/ship',
  4: '/photography',
};

const getPermitType = (permitId: number): string => {
  return PERMIT_TYPES[permitId] || 'Unknown';
};

interface PermitData {
  id: number;
  permit_type: number;
  user_id: string;
  company_id: string;
  posted_at: string;
  permit_id: number;
}

interface Company {
  company_id: string;
  company_name_ar: string;
  company_name_en: string;
}

interface FormHistoryProps {
  apiEndpoint?: string;
  onRowClick?: (item: PermitData) => void;
  className?: string;
}

function FormHistory({
  apiEndpoint = '/api/data/permithistory',
  onRowClick,
  className = ''
}: FormHistoryProps) {
  const navigate = useNavigate();
  const [permitData, setPermitData] = useState<PermitData[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPermitType, setSelectedPermitType] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const fetchUserCompanies = async () => {
    try {
      // TODO: Replace with actual API call when authentication is ready
      const response = await fetch('/api/data/companyretrieval', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        const companiesData = (result.data || []).map(item => item.company_info);
        setCompanies(companiesData);
      }
    } catch (err) {
      console.error('Error fetching user companies:', err);
    }
  };

  const fetchPermitData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (selectedCompany !== 'all') {
        params.append('company_id', selectedCompany);
      }
      
      const url = `${apiEndpoint}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const dataList = Array.isArray(data) ? data : [];
      
      let filtered = dataList;
      if (selectedPermitType !== 'all') {
        filtered = dataList.filter(item => item.permit_type === parseInt(selectedPermitType));
      }
      
      setPermitData(filtered);
      
      if (filtered.length === 0 && (selectedPermitType !== 'all' || selectedCompany !== 'all')) {
        setError('No permits match the selected filters');
      } else if (filtered.length === 0) {
        setError('No data found');
      }
    } catch (err: any) {
      setError('Failed to load data');
      console.error('Error fetching permit data:', err);
      setPermitData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermitAndNavigate = async (item: PermitData) => {
    try {
      console.log('Fetching permit details for ID:', item.id);
      
      const response = await fetch(`/api/permits/${item.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const permitData = await response.json();
      console.log('Permit data received:', permitData);
      
      const route = PERMIT_ROUTES[item.permit_type];
      
      if (route) {
        navigate(route, { state: { permitData } });
      } else {
        alert(`Viewing ${getPermitType(item.permit_type)} permits is not yet implemented`);
      }
      
    } catch (err: any) {
      console.error('Error fetching permit details:', err);
      alert('Failed to load permit details: ' + err.message);
    }
  };

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  useEffect(() => {
    fetchPermitData();
  }, [selectedPermitType, selectedCompany]);

  const handleRowClick = async (item: PermitData) => {
    console.log('Row clicked:', item);
    await fetchPermitAndNavigate(item);
    
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.company_id === companyId);
    return company ? company.company_name_en : companyId;
  };

  return (
    <div className={className}>
      <h2>Form History</h2>

      <div>
        <div>
          <div>
            <label htmlFor="permitTypeFilter">
              Filter by Permit Type
            </label>
            <select
              id="permitTypeFilter"
              value={selectedPermitType}
              onChange={(e) => setSelectedPermitType(e.target.value)}
            >
              <option value="all">All Permit Types</option>
              {Object.entries(PERMIT_TYPES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="companyFilter">
              Filter by Company
            </label>
            <select
              id="companyFilter"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.company_name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && !loading && (
        <div>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div>
          <p>Loading permits...</p>
        </div>
      )}

      {!loading && permitData.length > 0 && (
        <div>
          <div>
            {permitData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRowClick(item)}
              >
                <div>
                  <div>
                    <div>
                      <span>
                        {getPermitType(item.permit_type)}
                      </span>
                      <span>
                        Permit #{item.permit_type}
                      </span>
                    </div>
                    <div>
                      <p>
                        Company: {getCompanyName(item.company_id)}
                      </p>
                      <p>
                        Posted at: {formatDate(item.posted_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <p>Showing {permitData.length} {permitData.length === 1 ? 'permit' : 'permits'}</p>
          </div>
        </div>
      )}

      {!loading && permitData.length === 0 && !error && (
        <div>
          <p>No permits found</p>
        </div>
      )}
    </div>
  );
}

export default FormHistory;