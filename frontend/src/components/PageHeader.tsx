import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, backTo = '/dashboard', backLabel = 'Voltar', right }: PageHeaderProps) {
  return (
    <header className="page-header">
      <Link to={backTo} className="back-link" aria-label={backLabel}>
        ← {backLabel}
      </Link>
      <h1 style={{ flex: 1, minWidth: 0 }}>{title}</h1>
      {right != null ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
    </header>
  );
}
