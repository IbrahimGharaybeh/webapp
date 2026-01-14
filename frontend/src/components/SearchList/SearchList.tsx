import { useEffect, useMemo, useState } from 'react';

type SearchListProps = {
  rows?: string[];
  items?: SearchListItem[];
  fetchUrl?: string;
  rowField?: string;
  idField?: string;
  placeholder?: string;
  emptyText?: string;
  filterField?: string;
  filterValue?: string;
  onSelect?: (item: SearchListItem) => void;
};

export type SearchListItem = {
  id: string | number;
  label: string;
  data?: Record<string, unknown>;
};

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gap: '10px',
};

const listStyle: React.CSSProperties = {
  display: 'grid',
  gap: '8px',
  maxHeight: '240px',
  overflowY: 'auto',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #1f2937',
  background: '#0f172a',
  color: '#e2e8f0',
  fontSize: '14px',
};

const rowStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #1f2937',
  background: '#0b1224',
  color: '#e2e8f0',
  fontSize: '14px',
};

const emptyStyle: React.CSSProperties = {
  margin: 0,
  color: '#94a3b8',
  fontSize: '13px',
};

function SearchList({
  rows = [],
  items,
  fetchUrl,
  rowField,
  idField = 'id',
  placeholder = 'Search...',
  emptyText = 'No results found.',
  filterField,
  filterValue,
  onSelect,
}: SearchListProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedItems, setFetchedItems] = useState<SearchListItem[]>([]);

  useEffect(() => {
    if (!fetchUrl) {
      setFetchedRows([]);
      return;
    }

    const fetchRows = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await fetch(fetchUrl, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to load results');
        }
        const result = await response.json();
        const data = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
        const mappedItems = data
          .map((item, index) => {
            if (typeof item === 'string') {
              return {
                id: index,
                label: item,
              };
            }
            const record = item && typeof item === 'object' ? item : {};
            const label = rowField && record && rowField in record
              ? String(record[rowField] ?? '')
              : String(record?.name_arabic ?? record?.nameArabic ?? '');
            const idValue = record && idField in record ? record[idField] : index;
            return {
              id: idValue,
              label,
              data: record,
            };
          })
          .filter((value) => value.label.trim().length > 0);
        setFetchedItems(mappedItems);
      } catch (error) {
        console.error('SearchList fetch failed:', error);
        setFetchError('Unable to load results.');
        setFetchedItems([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchRows();
  }, [fetchUrl, rowField, idField]);

  const resolvedItems = useMemo<SearchListItem[]>(() => {
    if (fetchUrl) return fetchedItems;
    if (items) return items;
    return rows.map((row, index) => ({ id: index, label: row }));
  }, [fetchUrl, fetchedItems, items, rows]);

  const filteredRows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    let sourceRows = resolvedItems;
    if (filterField && filterValue) {
      sourceRows = sourceRows.filter((row) => {
        const data = row.data ?? {};
        return String((data as Record<string, unknown>)[filterField] ?? '') === filterValue;
      });
    }
    if (!trimmed) return sourceRows;
    return sourceRows.filter((row) => row.label.toLowerCase().includes(trimmed));
  }, [query, resolvedItems, filterField, filterValue]);

  return (
    <div style={containerStyle}>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {loading && <p style={emptyStyle}>Loading...</p>}
      {!loading && fetchError && <p style={emptyStyle}>{fetchError}</p>}
      {!loading && !fetchError && filteredRows.length === 0 ? (
        <p style={emptyStyle}>{emptyText}</p>
      ) : (
        <div style={listStyle}>
          {filteredRows.map((row) => (
            <div
              key={`${row.id}-${row.label}`}
              style={rowStyle}
              role={onSelect ? 'button' : undefined}
              onClick={() => onSelect?.(row)}
            >
              {row.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchList;
