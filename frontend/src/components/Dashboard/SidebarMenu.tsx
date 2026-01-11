import type { CSSProperties } from 'react';

export type DashboardViewKey = 'profile' | 'companies' | 'history';

type SidebarMenuProps = {
  activeKey: DashboardViewKey;
  onSelect: (key: DashboardViewKey) => void;
};

const menuContainerStyle: CSSProperties = {
  background: '#0b1224',
  border: '1px solid #1f2937',
  borderRadius: '16px',
  padding: '16px',
  display: 'grid',
  gap: '10px',
  position: 'sticky',
  top: '24px',
};

const menuHeaderStyle: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#94a3b8',
};

const menuButtonStyle: CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'transparent',
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: 600,
  textAlign: 'left',
  cursor: 'pointer',
};

const activeMenuButtonStyle: CSSProperties = {
  ...menuButtonStyle,
  background: '#0f172a',
  border: '1px solid #1f2937',
  color: '#f8fafc',
  boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
};

const menuItems: Array<{ key: DashboardViewKey; label: string }> = [
  { key: 'profile', label: 'Profile' },
  { key: 'companies', label: 'Companies' },
  { key: 'history', label: 'History' },
];

function SidebarMenu({ activeKey, onSelect }: SidebarMenuProps) {
  return (
    <aside style={menuContainerStyle}>
      <p style={menuHeaderStyle}>Menu</p>
      {menuItems.map((item) => (
        <button
          key={item.key}
          type="button"
          style={activeKey === item.key ? activeMenuButtonStyle : menuButtonStyle}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default SidebarMenu;
