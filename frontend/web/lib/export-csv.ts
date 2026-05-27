/**
 * Utility to export data as CSV files.
 * Used across dashboard components for data export functionality.
 */

interface ExportCSVOptions<T> {
  /** The data rows to export */
  data: T[];
  /** Column definitions mapping header label to accessor function */
  columns: { header: string; accessor: (row: T) => string | number }[];
  /** Filename without extension */
  filename: string;
}

export function exportToCSV<T>({ data, columns, filename }: ExportCSVOptions<T>): void {
  if (data.length === 0) return;

  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = col.accessor(row);
      // Escape values that contain commas, quotes, or newlines
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
