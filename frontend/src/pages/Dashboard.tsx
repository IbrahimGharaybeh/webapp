import CompanyDashboard from "../components/CompanyDashboard/CompanyDashboard";
import FormHistory from "../components/FormHistory/FormHistory";
import { TableDropDown } from "../components/DropDownComplicated/TableDropDown";
import MemberControl from "../components/MemberControl/MemberControl";

function Dashboard() {
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
            <CompanyDashboard />
          </section>

          <section style={cardStyle}>
            <FormHistory />
          </section>

          <section style={cardStyle}>
            <TableDropDown csvPath="\csv\CNIA_JOBS.txt" columns={2}/>
          </section>

          <section style={cardStyle}>
            <MemberControl />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
