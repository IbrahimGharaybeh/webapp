import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../lib/AuthContext';

type Company = {
  company: string;
};

type MemberControlProps = {
  apiBase?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function MemberControl({ apiBase = `${API_URL}/api/members` }: MemberControlProps) {
  const { user, loading: authLoading, refetch } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [action, setAction] = useState<'add' | 'remove'>('add');
  const [targetUserId, setTargetUserId] = useState('');
  const [status, setStatus] = useState('Loading companies...');

  useEffect(() => {
    if (!user && !authLoading) {
      setStatus('You must be logged in to manage members.');
      return;
    }
    if (action === 'remove' && targetUserId === user.id) {
      setStatus('You cannot remove yourself.');
      return;
    }
    if (!user) return;
    fetchCompanies(user.id);
  }, [user, authLoading]);

  console.log('logged-in user:', user);


  const fetchCompanies = async (userId: string) => {
    try {
      setStatus('Loading companies...');
      const res = await fetch(`${apiBase}/companyCheckAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to load companies');
      const data = await res.json();
      const normalized = Array.isArray(data) ? data : [];
      setCompanies(normalized);
      setSelectedCompany(normalized[0]?.company ?? '');
      setStatus(normalized.length ? '' : 'No admin companies found.');
    } catch (err: any) {
      setStatus(`Error loading companies: ${err.message}`);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setStatus('You must be logged in.');
      return;
    }
    if (!selectedCompany) {
      setStatus('Select a company.');
      return;
    }
    if (!targetUserId) {
      setStatus('Enter a user UUID.');
      return;
    }

    const url =
      action === 'add'
        ? `${apiBase}/companyMemberControls/inviteMember`
        : `${apiBase}/companyMemberControls/removeMember`;

    const payload = {
      admin: user.id,
      company: selectedCompany,
      user: targetUserId,
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }
      setStatus(
        action === 'add'
          ? `Invited user ${targetUserId} to company ${selectedCompany}.`
          : `Removed user ${targetUserId} from company ${selectedCompany}.`
      );
      setTargetUserId('');
      await refetch();
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            name="member-action"
            value="add"
            checked={action === 'add'}
            onChange={() => setAction('add')}
          />
          Add (invite)
        </label>
        <label>
          <input
            type="radio"
            name="member-action"
            value="remove"
            checked={action === 'remove'}
            onChange={() => setAction('remove')}
          />
          Remove
        </label>
      </div>

      <div>
        <label>
          Company
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            disabled={!companies.length}
          >
            {!companies.length && <option value="">Loading...</option>}
            {companies.map((c) => (
              <option key={c.company} value={c.company}>
                {c.company}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          User UUID
          <input
            type="text"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="UUID of user"
          />
        </label>
      </div>

      <button type="submit">
        {action === 'add' ? 'Invite User' : 'Remove User'}
      </button>

      {status && <p>{status}</p>}
    </form>
  );
}

export default MemberControl;
