import { useEffect, useMemo, useState } from 'react';
import PermitFiltersTable from '../components/Dashboard/PermitFiltersTable';
import ProfileSnapshot from '../components/Dashboard/ProfileSnapshot';
import RepresentativeList from '../components/Dashboard/RepresentativeList';
import SidebarMenu, { type DashboardViewKey } from '../components/Dashboard/SidebarMenu';
import type { Company, PermitEntry, Representative } from '../components/Dashboard/types';
import { useAuth } from '../lib/AuthContext';
import { getApiUrl } from '../lib/api';

function Dashboard() {
  const { user, loading } = useAuth();
  const [adminCompanies, setAdminCompanies] = useState<Company[]>([]);
  const [memberCompanies, setMemberCompanies] = useState<Company[]>([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [representativesByCompany, setRepresentativesByCompany] = useState<Record<string, Representative[]>>({});
  const [representativeLoading, setRepresentativeLoading] = useState<Record<string, boolean>>({});
  const [representativeErrors, setRepresentativeErrors] = useState<Record<string, string>>({});
  const [permitsByCompany, setPermitsByCompany] = useState<Record<string, PermitEntry[]>>({});
  const [permitLoading, setPermitLoading] = useState<Record<string, boolean>>({});
  const [permitErrors, setPermitErrors] = useState<Record<string, string>>({});
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<DashboardViewKey>('profile');
  const [historyPermitNameFilter, setHistoryPermitNameFilter] = useState('');
  const [historyPermitDraftFilter, setHistoryPermitDraftFilter] = useState('all');
  const [historyPermitTypeFilter, setHistoryPermitTypeFilter] = useState('all');
  const [historyCompanyFilter, setHistoryCompanyFilter] = useState('all');

  useEffect(() => {
    if (!user?.id) return;
    void fetchCompanies();
  }, [user?.id]);

  const fetchCompanies = async () => {
    setCompanyLoading(true);
    setCompanyError(null);
    try {
      const [adminResponse, memberResponse] = await Promise.all([
        fetch(getApiUrl('/api/members/companyCheckAdmin'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({})
        }),
        fetch(getApiUrl('/api/members/companyCheck'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({})
        })
      ]);

      if (!adminResponse.ok || !memberResponse.ok) {
        throw new Error('Failed to load companies');
      }

      const adminData = await adminResponse.json();
      const memberData = await memberResponse.json();
      const adminList = Array.isArray(adminData) ? adminData : [];
      const memberList = Array.isArray(memberData) ? memberData : [];
      const adminIds = new Set(adminList.map((item: Company) => item.company));

      setAdminCompanies(adminList);
      setMemberCompanies(memberList.filter((item: Company) => !adminIds.has(item.company)));
    } catch (err) {
      console.error('Failed to load companies', err);
      setCompanyError('Unable to load company access right now.');
      setAdminCompanies([]);
      setMemberCompanies([]);
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    adminCompanies.forEach((company) => {
      if (representativesByCompany[company.company]) return;
      void fetchRepresentatives(company.company);
    });
  }, [adminCompanies, user?.id, representativesByCompany]);

  const fetchRepresentatives = async (companyId: string) => {
    setRepresentativeLoading((prev) => ({ ...prev, [companyId]: true }));
    setRepresentativeErrors((prev) => ({ ...prev, [companyId]: '' }));
    try {
      const response = await fetch(getApiUrl('/api/members/companyRepresentatives'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ companyId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRepresentativesByCompany((prev) => ({
        ...prev,
        [companyId]: Array.isArray(data) ? data : []
      }));
    } catch (err) {
      console.error('Failed to load representatives', err);
      setRepresentativeErrors((prev) => ({
        ...prev,
        [companyId]: 'Unable to load representatives.'
      }));
      setRepresentativesByCompany((prev) => ({ ...prev, [companyId]: [] }));
    } finally {
      setRepresentativeLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  const fetchCompanyPermits = async (companyId: string) => {
    setPermitLoading((prev) => ({ ...prev, [companyId]: true }));
    setPermitErrors((prev) => ({ ...prev, [companyId]: '' }));
    try {
      const response = await fetch(getApiUrl('/api/members/companyPermits'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ companyId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPermitsByCompany((prev) => ({
        ...prev,
        [companyId]: Array.isArray(data) ? data : []
      }));
    } catch (err) {
      console.error('Failed to load permits', err);
      setPermitErrors((prev) => ({
        ...prev,
        [companyId]: 'Unable to load permits.'
      }));
      setPermitsByCompany((prev) => ({ ...prev, [companyId]: [] }));
    } finally {
      setPermitLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  const displayName = useMemo(() => {
    if (!user) return 'Welcome back';
    return user.name || user.email || 'Welcome back';
  }, [user]);

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #0b1224 100%)',
    color: '#e5e7eb',
    padding: '48px 24px',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gap: '24px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '0.01em',
    color: '#f8fafc',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#111827',
    border: '1px solid #1f2937',
    color: '#f8fafc',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  };

  const contentLayoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    gap: '24px',
    alignItems: 'start',
  };

  const cardStyle: React.CSSProperties = {
    background: '#0b1224',
    border: '1px solid #1f2937',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.28)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#f8fafc',
  };

  const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: '18px',
    color: '#cbd5f5',
    display: 'grid',
    gap: '6px',
  };

  const rowStyle: React.CSSProperties = {
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  };

  const permitTypeLabels: Record<number, string> = {
    1: 'Person',
    2: 'Vehicle',
    3: 'Ship',
    4: 'Photography',
  };

  const permitTypeOptions = Object.entries(permitTypeLabels).map(([value, label]) => ({
    value,
    label,
  }));

  useEffect(() => {
    if (activeView !== 'history' || !user?.id) return;
    adminCompanies.forEach((company) => {
      const hasPermits = Boolean(permitsByCompany[company.company]);
      const isPermitsLoading = Boolean(permitLoading[company.company]);
      if (!hasPermits && !isPermitsLoading) {
        void fetchCompanyPermits(company.company);
      }
    });
  }, [activeView, adminCompanies, permitsByCompany, permitLoading, user?.id]);

  const handleHistoryPermitNameFilterChange = (value: string) => {
    setHistoryPermitNameFilter(value);
  };

  const handleHistoryPermitTypeFilterChange = (value: string) => {
    setHistoryPermitTypeFilter(value);
  };

  const handleHistoryPermitDraftFilterChange = (value: string) => {
    setHistoryPermitDraftFilter(value);
  };

  const handleHistoryCompanyFilterChange = (value: string) => {
    setHistoryCompanyFilter(value);
  };

  const handleRemoveMember = async (companyId: string, repId: string) => {
    if (!user?.id) return;
    try {
      await fetch(getApiUrl('/api/members/companyMemberControls/removeMember'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: repId,
          company: companyId,
        }),
      });
      void fetchRepresentatives(companyId);
    } catch (err) {
      console.error('Failed to remove member', err);
    }
  };

  const handleMakeAdmin = async (companyId: string, repId: string) => {
    if (!user?.id) return;
    try {
      await fetch(getApiUrl('/api/members/companyMemberControls/makeAdmin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: repId,
          company: companyId,
        }),
      });
      void fetchRepresentatives(companyId);
    } catch (err) {
      console.error('Failed to make admin', err);
    }
  };

  const historyCompanyOptions = adminCompanies.map((company) => ({
    value: company.company,
    label: company.name,
  }));

  const historyPermitList = adminCompanies.flatMap((company) =>
    (permitsByCompany[company.company] || []).map((permit) => ({
      ...permit,
      companyId: company.company,
      companyName: company.name,
    }))
  );

  const historyHasPermitEntry = adminCompanies.some((company) =>
    Object.prototype.hasOwnProperty.call(permitsByCompany, company.company)
  );

  const historyPermitLoadingState = adminCompanies.some(
    (company) => permitLoading[company.company]
  );

  const historyPermitErrors = adminCompanies
    .map((company) => permitErrors[company.company])
    .filter((value): value is string => Boolean(value));

  const historyPermitError = historyPermitErrors[0] || '';

  const filteredHistoryPermitList = historyPermitList.filter((permit) => {
    const permitData = permit.permit as Record<string, unknown> | null | undefined;
    const nameArabic = (permitData?.name_arabic as string) ?? '';
    const matchesName = historyPermitNameFilter.trim().length === 0
      || nameArabic.toLowerCase().includes(historyPermitNameFilter.trim().toLowerCase());
    const matchesDraft =
      historyPermitDraftFilter === 'all'
        ? true
        : historyPermitDraftFilter === 'true'
          ? Boolean(permit.isDraft)
          : !permit.isDraft;
    const matchesType =
      historyPermitTypeFilter === 'all'
        ? true
        : String(permit.permitType) === historyPermitTypeFilter;
    const matchesCompany =
      historyCompanyFilter === 'all'
        ? true
        : String(permit.companyId) === historyCompanyFilter;
    return matchesName && matchesDraft && matchesType && matchesCompany;
  });

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Dashboard</h1>
          <div style={actionsStyle}>
            <button style={actionButtonStyle}>Company</button>
            <button style={actionButtonStyle}>Representative</button>
          </div>
        </header>

        <div style={contentLayoutStyle}>
          <SidebarMenu activeKey={activeView} onSelect={setActiveView} />
          <div style={gridStyle}>
            {activeView === 'profile' && (
              <ProfileSnapshot
                cardStyle={cardStyle}
                displayName={displayName}
                user={user}
                loading={loading}
              />
            )}

            {activeView === 'companies' && (
              <>
                <section style={cardStyle}>
                  <h2 style={sectionTitleStyle}>Companies you belong to</h2>
                  {companyLoading && <p style={{ margin: 0, color: '#94a3b8' }}>Loading...</p>}
                  {!companyLoading && companyError && (
                    <p style={{ margin: 0, color: '#fda4af' }}>{companyError}</p>
                  )}
                  {!companyLoading && !companyError && (
                    <ul style={listStyle}>
                      {memberCompanies.length === 0 && <li>No member companies yet.</li>}
                      {memberCompanies.map((company) => (
                        <li key={company.company}>{company.name}</li>
                      ))}
                    </ul>
                  )}
                </section>

                <section style={cardStyle}>
                  <h2 style={sectionTitleStyle}>Companies you admin</h2>
                  {companyLoading && <p style={{ margin: 0, color: '#94a3b8' }}>Loading...</p>}
                  {!companyLoading && companyError && (
                    <p style={{ margin: 0, color: '#fda4af' }}>{companyError}</p>
                  )}
                  {!companyLoading && !companyError && adminCompanies.length === 0 && (
                    <p style={{ margin: 0, color: '#94a3b8' }}>
                      You are not an admin for any companies yet.
                    </p>
                  )}
                  {!companyLoading && !companyError && adminCompanies.map((company) => {
                    const reps = representativesByCompany[company.company] || [];
                    const isLoading = representativeLoading[company.company];
                    const error = representativeErrors[company.company];
                    const isExpanded = expandedCompanyId === company.company;
                    return (
                      <div key={company.company} style={{ display: 'grid', gap: '10px' }}>
                        <div
                          style={rowStyle}
                          onClick={() => {
                            const nextExpanded = isExpanded ? null : company.company;
                            setExpandedCompanyId(nextExpanded);
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{company.name}</span>
                          <span style={{ color: '#94a3b8' }}>
                            {isExpanded ? 'Hide' : 'View'}
                          </span>
                        </div>
                        {isExpanded && (
                          <div style={{ display: 'grid', gap: '8px' }}>
                            <RepresentativeList
                              representatives={reps}
                              loading={isLoading}
                              error={error}
                              onRemove={(repId) => handleRemoveMember(company.company, repId)}
                              onMakeAdmin={(repId) => handleMakeAdmin(company.company, repId)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              </>
            )}

            {activeView === 'history' && (
              <section style={cardStyle}>
                <h2 style={sectionTitleStyle}>Permit history</h2>
                {companyLoading && <p style={{ margin: 0, color: '#94a3b8' }}>Loading...</p>}
                {!companyLoading && companyError && (
                  <p style={{ margin: 0, color: '#fda4af' }}>{companyError}</p>
                )}
                {!companyLoading && !companyError && adminCompanies.length === 0 && (
                  <p style={{ margin: 0, color: '#94a3b8' }}>
                    You are not an admin for any companies yet.
                  </p>
                )}
                {!companyLoading && !companyError && adminCompanies.length > 0 && (
                  <PermitFiltersTable
                    permitNameFilter={historyPermitNameFilter}
                    permitDraftFilter={historyPermitDraftFilter}
                    permitTypeFilter={historyPermitTypeFilter}
                    companyFilter={historyCompanyFilter}
                    companyOptions={historyCompanyOptions}
                    permitTypeOptions={permitTypeOptions}
                    permitTypeLabels={permitTypeLabels}
                    filteredPermitList={filteredHistoryPermitList}
                    hasPermitEntry={historyHasPermitEntry}
                    permitLoadingState={historyPermitLoadingState}
                    permitError={historyPermitError}
                    onNameFilterChange={handleHistoryPermitNameFilterChange}
                    onTypeFilterChange={handleHistoryPermitTypeFilterChange}
                    onDraftFilterChange={handleHistoryPermitDraftFilterChange}
                    onCompanyFilterChange={handleHistoryCompanyFilterChange}
                  />
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

