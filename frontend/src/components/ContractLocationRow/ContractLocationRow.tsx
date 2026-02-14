import { useState } from 'react';
import { getApiUrl } from '../../lib/api';

type ContractLocationValue = {
  contractNo: string;
  contractLocationsNo: string;
  contractLocationsDesc: string;
};

type ContractLocationRowProps = {
  value: ContractLocationValue;
  onChange: (next: ContractLocationValue) => void;
};

function ContractLocationRow({ value, onChange }: ContractLocationRowProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toDdMmYyyy = (raw: string) => {
    const normalized = raw.includes('T') ? raw.split('T')[0] : raw;
    const parts = normalized.split('-');
    if (parts.length !== 3) return raw;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const updateField = (field: keyof ContractLocationValue, fieldValue: string) => {
    if (field === 'contractNo') {
      setStartDate('');
      setEndDate('');
    }
    onChange({ ...value, [field]: fieldValue });
  };

  const handleContractLookup = async () => {
    const contractNo = value.contractNo.trim();
    if (!contractNo) return;

    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        getApiUrl(`/api/data/contract-location/${encodeURIComponent(contractNo)}`),
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Contract not found');
          return;
        }
        throw new Error(`Lookup failed (${response.status})`);
      }

      const payload = await response.json();
      const data = payload?.data ?? {};
      setStartDate(String(data.startDate ?? ''));
      setEndDate(String(data.endDate ?? ''));
      onChange({
        contractNo: String(data.contractNo ?? value.contractNo ?? ''),
        contractLocationsNo: String(data.contractLocationsNo ?? ''),
        contractLocationsDesc: String(data.contractLocationsDesc ?? '')
      });
    } catch (lookupError) {
      console.error('Contract lookup failed:', lookupError);
      setError('Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '4px' }}>
      <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
        <input
          type="text"
          value={value.contractNo}
          onChange={(event) => updateField('contractNo', event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void handleContractLookup();
            }
          }}
        />
        <input
          type="text"
          value={value.contractLocationsNo}
          onChange={(event) => updateField('contractLocationsNo', event.target.value)}
        />
        <input
          type="text"
          value={value.contractLocationsDesc}
          onChange={(event) => updateField('contractLocationsDesc', event.target.value)}
        />
        <input
          type="text"
          value={toDdMmYyyy(startDate)}
          readOnly
          placeholder="Start Date"
        />
        <input
          type="text"
          value={toDdMmYyyy(endDate)}
          readOnly
          placeholder="End Date"
        />
      </div>
      {(loading || error) && (
        <small style={{ color: error ? '#fca5a5' : '#93c5fd' }}>
          {error || 'Looking up contract...'}
        </small>
      )}
    </div>
  );
}

export default ContractLocationRow;
