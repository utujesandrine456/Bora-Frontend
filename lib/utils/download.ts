/**
 * Utility to download a string as a file in the browser
 */
export const downloadAsFile = (filename: string, content: string, contentType: string = 'text/plain') => {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Very basic JSON to CSV converter
 */
export const jsonToCsv = (data: any[]): string => {
  if (!data || !data.length) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName];
        const stringValue = value !== undefined && value !== null ? String(value) : '';
        // Escape quotes and wrap in quotes if contains comma
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
};
