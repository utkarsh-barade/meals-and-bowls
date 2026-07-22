/**
 * Formats a date string, ISO string, or Date object to DD/MM/YYYY format.
 * Returns 'N/A' if date is missing, invalid, or epoch 1970.
 */
export function formatDate(dateInput) {
  if (!dateInput) return 'N/A';

  const date = new Date(dateInput);
  if (isNaN(date.getTime()) || date.getFullYear() <= 1970) {
    return 'N/A';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Returns YYYY-MM-DD for local date inputs
 */
export function formatDateLocal(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
