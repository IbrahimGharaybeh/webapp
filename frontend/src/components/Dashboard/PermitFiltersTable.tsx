import type { CSSProperties } from 'react';

import type { PermitEntry } from './types';

type PermitOption = {
  value: string | number;
  label: string;
};

type PermitFiltersTableProps = {
  permitNameFilter: string;
  permitDraftFilter: string;
  permitTypeFilter: string;
  companyFilter: string;
  companyOptions: PermitOption[];
  permitTypeOptions: PermitOption[];
  permitTypeLabels: Record<number, string>;
  filteredPermitList: PermitEntry[];
  hasPermitEntry: boolean;
  permitLoadingState: boolean;
  permitError: string;
  onNameFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onDraftFilterChange: (value: string) => void;
  onCompanyFilterChange: (value: string) => void;
};

const filterInputStyle: CSSProperties = {
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #1f2937',
  background: '#0f172a',
  color: '#e2e8f0',
};

const permitRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr',
  gap: '12px',
  padding: '8px 10px',
  borderBottom: '1px solid #1f2937',
  color: '#cbd5f5',
  fontSize: '12px',
};

const permitHeaderStyle: CSSProperties = {
  ...permitRowStyle,
  fontWeight: 600,
  color: '#e2e8f0',
  background: '#0f172a',
};

const permitCellStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

function PermitFiltersTable({
  permitNameFilter,
  permitDraftFilter,
  permitTypeFilter,
  companyFilter,
  companyOptions,
  permitTypeOptions,
  permitTypeLabels,
  filteredPermitList,
  hasPermitEntry,
  permitLoadingState,
  permitError,
  onNameFilterChange,
  onTypeFilterChange,
  onDraftFilterChange,
  onCompanyFilterChange,
}: PermitFiltersTableProps) {
  return (
    <>
      <div style={{ display: 'grid', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={permitNameFilter}
          onChange={(event) => onNameFilterChange(event.target.value)}
          style={filterInputStyle}
        />
        <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <select
            value={permitTypeFilter}
            onChange={(event) => onTypeFilterChange(event.target.value)}
            style={filterInputStyle}
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
            onChange={(event) => onDraftFilterChange(event.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All Draft States</option>
            <option value="true">Draft</option>
            <option value="false">Final</option>
          </select>
          <select
            value={companyFilter}
            onChange={(event) => onCompanyFilterChange(event.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All Companies</option>
            {companyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {hasPermitEntry && !permitLoadingState && !permitError && filteredPermitList.length === 0 && (
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
            <div style={permitCellStyle}>Company</div>
            <div style={permitCellStyle}>Representative</div>
            <div style={permitCellStyle}>Is Draft</div>
          </div>
          {filteredPermitList.map((permit) => {
            const permitData = permit.permit as Record<string, unknown> | null | undefined;
            const nameArabic = (permitData?.name_arabic as string) ?? '';
            const shipName = (permitData?.ship_name as string)
              ?? (permitData?.shipName as string)
              ?? '';
            const displayName = permit.permitType === 3
              ? (shipName || nameArabic || 'N/A')
              : (nameArabic || 'N/A');
            const representative = (permit.repName as string)
              ?? (permitData?.representative as string)
              ?? 'N/A';
            const companyName = permit.companyName || permit.companyId || 'N/A';
            return (
              <div key={`${permit.permitType}-${permit.permitId}`} style={permitRowStyle}>
                <div style={permitCellStyle}>{displayName}</div>
                <div style={permitCellStyle}>
                  {permitTypeLabels[permit.permitType] || 'Unknown'}
                </div>
                <div style={permitCellStyle}>{companyName}</div>
                <div style={permitCellStyle}>{representative}</div>
                <div style={permitCellStyle}>{permit.isDraft ? 'true' : 'false'}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default PermitFiltersTable;
