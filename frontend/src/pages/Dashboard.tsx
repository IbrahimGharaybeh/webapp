import { useEffect, useMemo, useState } from 'react';
import FormHistory from '../components/FormHistory/FormHistory';
import { useAuth } from '../lib/AuthContext';
import { getApiUrl } from '../lib/api';

type Company = {
  company: string;
  name: string;
};

type Representative = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  is_admin?: boolean;
};

type PermitEntry = {
  permitType: number;
  permitId: number;
  isDraft?: boolean;
  permit?: unknown;
};

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
  const [permitNameFilters, setPermitNameFilters] = useState<Record<string, string>>({});
  const [permitDraftFilters, setPermitDraftFilters] = useState<Record<string, string>>({});
  const [permitTypeFilters, setPermitTypeFilters] = useState<Record<string, string>>({});
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    void fetchCompanies(user.id);
  }, [user?.id]);

  const fetchCompanies = async (userId: string) => {
    setCompanyLoading(true);
    setCompanyError(null);
    try {
      const [adminResponse, memberResponse] = await Promise.all([
        fetch(getApiUrl('/api/members/companyCheckAdmin'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId })
        }),
        fetch(getApiUrl('/api/members/companyCheck'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId })
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
      void fetchRepresentatives(company.company, user.id);
    });
  }, [adminCompanies, user?.id, representativesByCompany]);

  const fetchRepresentatives = async (companyId: string, adminId: string) => {
    setRepresentativeLoading((prev) => ({ ...prev, [companyId]: true }));
    setRepresentativeErrors((prev) => ({ ...prev, [companyId]: '' }));
    try {
      const response = await fetch(getApiUrl('/api/members/companyRepresentatives'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ companyId, adminId })
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

  const fetchCompanyPermits = async (companyId: string, adminId: string) => {
    setPermitLoading((prev) => ({ ...prev, [companyId]: true }));
    setPermitErrors((prev) => ({ ...prev, [companyId]: '' }));
    try {
      const response = await fetch(getApiUrl('/api/members/companyPermits'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ companyId, adminId })
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

  const labelStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#94a3b8',
  };

  const valueStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#e2e8f0',
  };

  const chipStyle = (verified: boolean): React.CSSProperties => ({
    alignSelf: 'flex-start',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    backgroundColor: verified ? 'rgba(34,197,94,0.18)' : 'rgba(251,191,36,0.2)',
    color: verified ? '#4ade80' : '#fbbf24',
    border: `1px solid ${verified ? 'rgba(34,197,94,0.4)' : 'rgba(251,191,36,0.5)'}`
  });

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

  const repRowStyle: React.CSSProperties = {
    background: '#0b1224',
    border: '1px solid #1f2937',
    borderRadius: '10px',
    padding: '10px 12px',
    display: 'grid',
    gap: '4px',
  };

  const permitRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '12px',
    padding: '8px 10px',
    borderBottom: '1px solid #1f2937',
    color: '#cbd5f5',
    fontSize: '12px',
  };

  const permitHeaderStyle: React.CSSProperties = {
    ...permitRowStyle,
    fontWeight: 600,
    color: '#e2e8f0',
    background: '#0f172a',
  };

  const permitCellStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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

        <div style={gridStyle}>
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Profile snapshot</h2>
            <p style={labelStyle}>Signed in as</p>
            <p style={valueStyle}>{displayName}</p>
            <p style={{ margin: 0, color: '#94a3b8' }}>{user?.email || 'No email on file'}</p>
            {!loading && (
              <span style={chipStyle(Boolean(user?.emailVerified))}>
                {user?.emailVerified ? 'Email verified' : 'Email not verified'}
              </span>
            )}
          </section>

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
              const hasPermitEntry = Object.prototype.hasOwnProperty.call(
                permitsByCompany,
                company.company
              );
              const permitList = permitsByCompany[company.company] || [];
              const permitLoadingState = permitLoading[company.company];
              const permitError = permitErrors[company.company];
              const permitNameFilter = permitNameFilters[company.company] || '';
              const permitDraftFilter = permitDraftFilters[company.company] || 'all';
              const permitTypeFilter = permitTypeFilters[company.company] || 'all';
              const filteredPermitList = permitList.filter((permit) => {
                const permitData = permit.permit as Record<string, unknown> | null | undefined;
                const nameArabic = (permitData?.name_arabic as string) ?? '';
                const matchesName = permitNameFilter.trim().length === 0
                  || nameArabic.toLowerCase().includes(permitNameFilter.trim().toLowerCase());
                const matchesDraft =
                  permitDraftFilter === 'all'
                    ? true
                    : permitDraftFilter === 'true'
                      ? Boolean(permit.isDraft)
                      : !permit.isDraft;
                const matchesType =
                  permitTypeFilter === 'all'
                    ? true
                    : String(permit.permitType) === permitTypeFilter;
                return matchesName && matchesDraft && matchesType;
              });
              const isExpanded = expandedCompanyId === company.company;
              return (
                <div key={company.company} style={{ display: 'grid', gap: '10px' }}>
                  <div
                    style={rowStyle}
                    onClick={() => {
                      const nextExpanded = isExpanded ? null : company.company;
                      setExpandedCompanyId(nextExpanded);
                      if (!isExpanded && user?.id) {
                        const hasPermits = Boolean(permitsByCompany[company.company]);
                        const isPermitsLoading = Boolean(permitLoading[company.company]);
                        if (!hasPermits && !isPermitsLoading) {
                          void fetchCompanyPermits(company.company, user.id);
                        }
                      }
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{company.name}</span>
                    <span style={{ color: '#94a3b8' }}>
                      {isExpanded ? 'Hide' : 'View'}
                    </span>
                  </div>
                  {isExpanded && (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Search by name..."
                          value={permitNameFilter}
                          onChange={(event) =>
                            setPermitNameFilters((prev) => ({
                              ...prev,
                              [company.company]: event.target.value
                            }))
                          }
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #1f2937',
                            background: '#0f172a',
                            color: '#e2e8f0'
                          }}
                        />
                        <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
                          <select
                            value={permitTypeFilter}
                            onChange={(event) =>
                              setPermitTypeFilters((prev) => ({
                                ...prev,
                                [company.company]: event.target.value
                              }))
                            }
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #1f2937',
                              background: '#0f172a',
                              color: '#e2e8f0'
                            }}
                          >
                            <option value="all">All Permit Types</option>
                            {permitTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={permitDraftFilter}
                            onChange={(event) =>
                              setPermitDraftFilters((prev) => ({
                                ...prev,
                                [company.company]: event.target.value
                              }))
                            }
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #1f2937',
                              background: '#0f172a',
                              color: '#e2e8f0'
                            }}
                          >
                            <option value="all">All Draft States</option>
                            <option value="true">Draft</option>
                            <option value="false">Final</option>
                          </select>
                        </div>
                      </div>
                      {hasPermitEntry &&
                        !permitLoadingState &&
                        !permitError &&
                        filteredPermitList.length === 0 && (
                        <p style={{ margin: 0, color: '#94a3b8' }}>
                          No permits found.
                        </p>
                      )}
                      {permitLoadingState && (
                        <p style={{ margin: 0, color: '#94a3b8' }}>
                          Loading permits...
                        </p>
                      )}
                      {!permitLoadingState && permitError && (
                        <p style={{ margin: 0, color: '#fda4af' }}>{permitError}</p>
                      )}
                      {!permitLoadingState && !permitError && filteredPermitList.length > 0 && (
                        <div style={{ border: '1px solid #1f2937', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={permitHeaderStyle}>
                            <div style={permitCellStyle}>Name (Arabic)</div>
                            <div style={permitCellStyle}>Permit Type</div>
                            <div style={permitCellStyle}>Representative</div>
                            <div style={permitCellStyle}>Is Draft</div>
                          </div>
                          {filteredPermitList.map((permit) => {
                            const permitData = permit.permit as Record<string, unknown> | null | undefined;
                            const nameArabic = (permitData?.name_arabic as string) ?? '—';
                            const representative = (permit.repName as string) ??
                              (permitData?.representative as string) ??
                              '—';
                            return (
                              <div key={`${permit.permitType}-${permit.permitId}`} style={permitRowStyle}>
                                <div style={permitCellStyle}>{nameArabic}</div>
                                <div style={permitCellStyle}>
                                  {permitTypeLabels[permit.permitType] || 'Unknown'}
                                </div>
                                <div style={permitCellStyle}>{representative}</div>
                                <div style={permitCellStyle}>{permit.isDraft ? 'true' : 'false'}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {isLoading && (
                        <p style={{ margin: 0, color: '#94a3b8' }}>
                          Loading representatives...
                        </p>
                      )}
                      {!isLoading && error && (
                        <p style={{ margin: 0, color: '#fda4af' }}>{error}</p>
                      )}
                      {!isLoading && !error && reps.length === 0 && (
                        <p style={{ margin: 0, color: '#94a3b8' }}>
                          No representatives found.
                        </p>
                      )}
                      {!isLoading &&
                        !error &&
                        reps.map((rep) => {
                          const label = rep.name || rep.username || rep.email || rep.id;
                          return (
                            <div key={rep.id} style={repRowStyle}>
                              <span style={{ fontWeight: 600 }}>{label}</span>
                              {rep.email && (
                                <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                  {rep.email}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          <section style={cardStyle}>
            <FormHistory />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

