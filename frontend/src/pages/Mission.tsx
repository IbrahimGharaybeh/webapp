import { useMemo, useState } from 'react';
import './PermitPage.css';
import Form from '../components/Form/Form';
import DatePicker from '../components/DatePicker/DatePicker';
import Input from '../components/Input/Input';
import SearchList, { type SearchListItem } from '../components/SearchList/SearchList';
import { getApiUrl } from '../lib/api';

function Mission() {
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<SearchListItem[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    contractNo: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedIds = useMemo(
    () =>
      selectedPeople
        .map((person) => Number(person.id))
        .filter((id) => Number.isInteger(id)),
    [selectedPeople]
  );

  const peopleUrl = getApiUrl('/api/data/people');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      location: formData.location,
      contractNo: formData.contractNo,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      people: selectedIds
    };
    void submitPayload(payload);
  };

  const handleSelectPerson = (item: SearchListItem) => {
    setSelectedPeople((prev) => {
      const exists = prev.some((person) => String(person.id) === String(item.id));
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const handleRemovePerson = (id: string | number) => {
    setSelectedPeople((prev) =>
      prev.filter((person) => String(person.id) !== String(id))
    );
  };

  const submitPayload = async (payload: {
    location: string;
    contractNo: string;
    description: string;
    startDate: string;
    endDate: string;
    people: number[];
  }) => {
    try {
      setLoading(true);
      setSubmitSuccess(false);
      setSubmitError(false);

      const response = await fetch(getApiUrl('/api/data/mission'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting mission:', error);
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="permit-page">
      <div className="permit-container">
        <div className="permit-header">
          <h1 className="permit-title">Registered Mission</h1>
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
              <legend>Mission Details</legend>
              <div>
                <label>Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />

                <label>Start Date</label>
                <DatePicker
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />

                <label>End Date</label>
                <DatePicker
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />

                <label>Contract No</label>
                <Input
                  name="contractNo"
                  value={formData.contractNo}
                  onChange={handleChange}
                />

                <label>Description</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <label>People</label>
                <SearchList
                  fetchUrl={peopleUrl}
                  rowField="name_arabic"
                  placeholder="Search registered people..."
                  emptyText="No people found."
                  onSelect={handleSelectPerson}
                />

                <label>Selected People IDs</label>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedPeople.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                      No people selected.
                    </div>
                  ) : (
                    selectedPeople.map((person) => (
                      <div
                        key={String(person.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          border: '1px solid #1f2937',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          background: '#0b1224'
                        }}
                      >
                        <span>{person.label} (ID: {person.id})</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePerson(person.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
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

export default Mission;
