/**
 * CSV Export Utility for Admin Panel
 * Supports exporting data to CSV format with proper escaping and formatting
 */

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | boolean | null | undefined);
}

/**
 * Escape CSV cell value to handle special characters
 */
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Check if the value needs to be quoted
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    // Escape double quotes by doubling them and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Generate CSV content from data array
 */
export function generateCSV<T>(data: T[], columns: ExportColumn<T>[]): string {
  // Generate header row
  const headerRow = columns.map(col => escapeCSVValue(col.header)).join(',');
  
  // Generate data rows
  const dataRows = data.map(item => {
    return columns.map(col => {
      const value = typeof col.accessor === 'function' 
        ? col.accessor(item) 
        : item[col.accessor];
      return escapeCSVValue(value);
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV and trigger download
 */
export function exportToCSV<T>(
  data: T[], 
  columns: ExportColumn<T>[], 
  filename: string
): void {
  const csvContent = generateCSV(data, columns);
  downloadCSV(csvContent, filename);
}

// Pre-defined column configurations for common exports

export const orderColumns = [
  { header: 'Order ID', accessor: 'id' as const },
  { header: 'Customer', accessor: (o: any) => o.user?.name || o.user?.email || 'Unknown' },
  { header: 'Email', accessor: (o: any) => o.user?.email || '' },
  { header: 'Product', accessor: (o: any) => o.product?.name || 'Unknown' },
  { header: 'Variant', accessor: (o: any) => o.variant?.name || 'N/A' },
  { header: 'Status', accessor: 'status' as const },
  { header: 'Bundle', accessor: (o: any) => o.bundleId ? 'Yes' : 'No' },
  { header: 'Created At', accessor: (o: any) => new Date(o.createdAt).toLocaleString() },
  { header: 'Updated At', accessor: (o: any) => new Date(o.updatedAt).toLocaleString() },
];

export const customerColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'Name', accessor: 'name' as const },
  { header: 'Email', accessor: 'email' as const },
  { header: 'Role', accessor: 'role' as const },
  { header: 'Joined', accessor: (c: any) => new Date(c.createdAt).toLocaleDateString() },
];

export const productColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'Name', accessor: 'name' as const },
  { header: 'Category', accessor: 'category' as const },
  { header: 'Original Price', accessor: 'originalPrice' as const },
  { header: 'Sale Price', accessor: 'salePrice' as const },
  { header: 'Duration', accessor: 'duration' as const },
  { header: 'Active', accessor: (p: any) => p.isActive ? 'Yes' : 'No' },
  { header: 'Stock', accessor: 'stockCount' as const },
  { header: 'Has Variants', accessor: (p: any) => p.hasVariants ? 'Yes' : 'No' },
];

export const ticketColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'Subject', accessor: 'subject' as const },
  { header: 'Customer', accessor: (t: any) => t.user?.name || t.user?.email || 'Unknown' },
  { header: 'Email', accessor: (t: any) => t.user?.email || '' },
  { header: 'Category', accessor: 'category' as const },
  { header: 'Priority', accessor: 'priority' as const },
  { header: 'Status', accessor: 'status' as const },
  { header: 'Created At', accessor: (t: any) => new Date(t.createdAt).toLocaleString() },
];

export const contactRequestColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'Name', accessor: 'name' as const },
  { header: 'Email', accessor: 'email' as const },
  { header: 'Subject', accessor: 'subject' as const },
  { header: 'Message', accessor: 'message' as const },
  { header: 'Status', accessor: 'status' as const },
  { header: 'Admin Response', accessor: 'admin_response' as const },
  { header: 'Created At', accessor: (c: any) => new Date(c.created_at).toLocaleString() },
];

export const premiumMembershipColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'User', accessor: (m: any) => (m.profiles as any)?.full_name || (m.profiles as any)?.email || 'Unknown' },
  { header: 'Email', accessor: (m: any) => (m.profiles as any)?.email || '' },
  { header: 'Plan', accessor: 'plan_type' as const },
  { header: 'Price Paid', accessor: 'price_paid' as const },
  { header: 'Payment Method', accessor: 'payment_method' as const },
  { header: 'Transaction ID', accessor: 'transaction_id' as const },
  { header: 'Status', accessor: 'status' as const },
  { header: 'Requested At', accessor: (m: any) => new Date(m.requested_at).toLocaleString() },
  { header: 'Expires At', accessor: (m: any) => m.expires_at ? new Date(m.expires_at).toLocaleString() : 'N/A' },
];

export const loyaltyColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'User ID', accessor: 'userId' as const },
  { header: 'Name', accessor: 'userName' as const },
  { header: 'Email', accessor: 'userEmail' as const },
  { header: 'Total Points', accessor: 'totalPoints' as const },
  { header: 'Lifetime Points', accessor: 'lifetimePoints' as const },
  { header: 'Tier', accessor: 'tier' as const },
];

export const bundleColumns = [
  { header: 'ID', accessor: 'id' as const },
  { header: 'Name', accessor: 'name' as const },
  { header: 'Description', accessor: 'description' as const },
  { header: 'Original Price', accessor: 'originalPrice' as const },
  { header: 'Sale Price', accessor: 'salePrice' as const },
  { header: 'Active', accessor: (b: any) => b.isActive ? 'Yes' : 'No' },
  { header: 'Valid Until', accessor: (b: any) => b.validUntil ? new Date(b.validUntil).toLocaleDateString() : 'N/A' },
];
