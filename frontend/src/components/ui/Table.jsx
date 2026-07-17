import { cn } from '@/utils/cn';

/**
 * Table shell — DESIGN.md §10.
 * Provides the structural wrapper. Pages render their own thead/tbody content.
 */
export default function Table({ className, children }) {
  return (
    <div className="w-full overflow-x-auto rounded-card border border-surface-border shadow-card">
      <table className={cn('w-full text-small', className)}>
        {children}
      </table>
    </div>
  );
}

Table.Head = function TableHead({ children }) {
  return (
    <thead className="bg-surface-muted border-b border-surface-border">
      {children}
    </thead>
  );
};

Table.HeadCell = function TableHeadCell({ className, children, ...props }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-caption font-semibold text-text-secondary uppercase tracking-wide',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

Table.Body = function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-surface-border bg-surface-card">
      {children}
    </tbody>
  );
};

Table.Row = function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn('hover:bg-surface-muted transition-colors duration-100', className)}
      {...props}
    >
      {children}
    </tr>
  );
};

Table.Cell = function TableCell({ className, children, ...props }) {
  return (
    <td className={cn('px-4 py-3 text-text-primary', className)} {...props}>
      {children}
    </td>
  );
};

Table.Empty = function TableEmpty({ message = 'No records found.', colSpan = 1 }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-text-secondary text-small"
      >
        {message}
      </td>
    </tr>
  );
};
