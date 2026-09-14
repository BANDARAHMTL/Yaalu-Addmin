/**
 * Formats long UUIDs / Mongo ObjectIDs into clean, short numeric IDs (e.g. 10001, 10002)
 * or clean prefixed IDs if specified.
 */
export function formatShortId(id: string | number | undefined | null, offset: number = 10000): string {
  if (!id) return `${offset + 1}`;
  const str = String(id).trim();
  
  // If it's already a short number (e.g. 1, 2 or 10001)
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return String(num < 10000 ? offset + num : num);
  }
  
  // Hash the string deterministically into a 5-digit number starting at offset (10001)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash) % 8999 + 1; // 1 to 8999
  return String(offset + positiveHash); // e.g. 10001, 10002
}

export function formatRiderId(id: string | number | undefined | null): string {
  return formatShortId(id, 10000);
}

export function formatOrderId(id: string | number | undefined | null): string {
  return formatShortId(id, 20000);
}

export function formatCustomerId(id: string | number | undefined | null): string {
  return formatShortId(id, 30000);
}

export function formatMerchantId(id: string | number | undefined | null): string {
  return formatShortId(id, 40000);
}
