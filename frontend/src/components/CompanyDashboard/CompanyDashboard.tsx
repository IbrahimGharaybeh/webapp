import { useState, useEffect } from 'react';
import { getApiUrl } from '../../lib/api';

interface RepresentativeData {
  representative_name: string;
  number_of_permits: number;
}

interface CompanyDashboardProps {
  apiEndpoint?: string;
  className?: string;
}

function CompanyDashboard({ 
  apiEndpoint = '/api/company/representatives',
  className = '' 
}: CompanyDashboardProps) {
  const [representatives, setRepresentatives] = useState<RepresentativeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  const fetchRepresentatives = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call when endpoint is ready
      const response = await fetch(getApiUrl(apiEndpoint), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRepresentatives(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Failed to load representatives data');
      console.error('Error fetching representatives:', err);
      setRepresentatives([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <h2>Company Dashboard</h2>

      {error && !loading && (
        <div>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div>
          <p>Loading representatives...</p>
        </div>
      )}

      {!loading && representatives.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Representative Name</th>
                <th>Number of Permits</th>
              </tr>
            </thead>
            <tbody>
              {representatives.map((rep, index) => (
                <tr key={index}>
                  <td>{rep.representative_name}</td>
                  <td>{rep.number_of_permits}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <p>Showing {representatives.length} {representatives.length === 1 ? 'representative' : 'representatives'}</p>
          </div>
        </div>
      )}

      {!loading && representatives.length === 0 && !error && (
        <div>
          <p>No representatives found</p>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
