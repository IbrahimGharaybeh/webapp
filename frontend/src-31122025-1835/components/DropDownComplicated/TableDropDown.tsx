import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './TableDropDown.css';

interface DropdownItem2Col {
  code: number;
  name: string;
}

interface DropdownItem3Col {
  code: number;
  nameAr: string;
  nameEn: string;
}

type DropdownItem = DropdownItem2Col | DropdownItem3Col;

interface TableDropDown {
  csvPath: string;
  columns: 2 | 3;
}

export const TableDropDown: React.FC<TableDropDown> = ({ csvPath, columns }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [codeFilter, setCodeFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(csvPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        const lines = text.split('\n');
        const data: DropdownItem[] = [];
        
        for (let i = 0; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          
          if (columns === 2 && values.length >= 2 && values[0] && values[1]) {
            const code = parseFloat(values[0]);
            if (!isNaN(code)) {
              data.push({
                code: code,
                name: values[1]
              } as DropdownItem2Col);
            }
          } else if (columns === 3 && values.length >= 3 && values[0] && values[1] && values[2]) {
            const code = parseFloat(values[0]);
            if (!isNaN(code)) {
              data.push({
                code: code,
                nameAr: values[1],
                nameEn: values[2]
              } as DropdownItem3Col);
            }
          }
        }
        
        setItems(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error loading CSV:', err);
        setError(err instanceof Error ? err.message : 'Failed to load CSV file');
        setLoading(false);
      }
    };

    loadCSV();
  }, [csvPath, columns]);

  useEffect(() => {
    if (selectedValue && items.length > 0) {
      const item = items.find(i => i.code.toString() === selectedValue);
      if (item) {
        if (columns === 2) {
          const item2 = item as DropdownItem2Col;
          setDisplayText(`${item2.code} - ${item2.name}`);
        } else {
          const item3 = item as DropdownItem3Col;
          setDisplayText(`${item3.code} - ${item3.nameAr}`);
        }
      } else {
        setDisplayText(selectedValue);
      }
    } else {
      setDisplayText('');
    }
  }, [selectedValue, items, columns]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Changed to startsWith for code filtering
        const codeMatch = codeFilter === '' || item.code.toString().startsWith(codeFilter);
        
        if (columns === 2) {
          const item2 = item as DropdownItem2Col;
          const nameMatch = nameFilter === '' || item2.name.toLowerCase().includes(nameFilter.toLowerCase());
          return codeMatch && nameMatch;
        } else {
          const item3 = item as DropdownItem3Col;
          const nameMatch = nameFilter === '' || 
            item3.nameAr.includes(nameFilter) ||
            item3.nameEn.toLowerCase().includes(nameFilter.toLowerCase());
          return codeMatch && nameMatch;
        }
      })
      .slice(0, 100);
  }, [items, codeFilter, nameFilter, columns]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeFilter(e.target.value);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  }, []);

  const handleCodeKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && codeFilter) {
      const matchedItem = items.find(item => item.code.toString() === codeFilter);
      if (matchedItem) {
        handleSelectItem(matchedItem);
      }
    }
  }, [codeFilter, items]);

  const handleSelectItem = useCallback((item: DropdownItem) => {
    setSelectedValue(item.code.toString());
    setIsOpen(false);
    setCodeFilter('');
    setNameFilter('');
  }, []);

  if (loading) {
    return <div className="dropdown-loading">Loading...</div>;
  }

  return (
    <div className="occupation-dropdown">
      <button
        type="button"
        onClick={() => !loading && !error && setIsOpen(!isOpen)}
        disabled={loading || !!error}
        className={`dropdown-button ${loading || error ? 'disabled' : ''}`}
      >
        <span className={error ? 'error-text' : ''}>
          {error ? 'Error loading data' : (displayText || 'Select an item')}
        </span>
        <svg className={`dropdown-arrow ${isOpen ? 'open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !loading && !error && (
        <>
          <div 
            className="dropdown-backdrop" 
            onClick={() => setIsOpen(false)}
          />
          <div className="dropdown-content-box">
            <div className="dropdown-filters">
              <div className="filter-grid">
                <input
                  type="text"
                  value={codeFilter}
                  onChange={handleCodeChange}
                  onKeyDown={handleCodeKeyDown}
                  placeholder="Code"
                  className="filter-input"
                  autoFocus
                />
                <input
                  type="text"
                  value={nameFilter}
                  onChange={handleNameChange}
                  placeholder="Name"
                  className="filter-input"
                />
              </div>
            </div>

            <div className="dropdown-scroll-box">
              {filteredItems.length > 0 ? (
                <>
                  {filteredItems.map((item) => (
                    <div
                      key={item.code}
                      onClick={() => handleSelectItem(item)}
                      className={`dropdown-item ${columns === 3 ? 'three-col' : ''} ${selectedValue === item.code.toString() ? 'selected' : ''}`}
                    >
                      <div className="item-code">{item.code}</div>
                      {columns === 2 ? (
                        <div className="item-name">{(item as DropdownItem2Col).name}</div>
                      ) : (
                        <>
                          <div className="item-name">{(item as DropdownItem3Col).nameAr}</div>
                          <div className="item-name">{(item as DropdownItem3Col).nameEn}</div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-results">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};