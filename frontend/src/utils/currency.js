export const formatPrice = (product, currency = 'TRY', isCompareAt = false) => {
  let val = 0;
  if (currency === 'TRY') {
    val = isCompareAt ? product.compareAtPriceTry : product.priceTry;
  } else if (currency === 'USD') {
    val = product.priceUsd || (product.priceTry / 33); // simple fallback
  } else if (currency === 'EUR') {
    val = product.priceEur || (product.priceTry / 35); // simple fallback
  }
  
  if (!val) return '';
  
  const formatted = Number(val).toFixed(2);
  
  if (currency === 'TRY') return `${formatted}₺`;
  if (currency === 'USD') return `$${formatted}`;
  if (currency === 'EUR') return `€${formatted}`;
  
  return `${formatted}`;
};

export const formatRawPrice = (val, currency = 'TRY') => {
  if (val === undefined || val === null) return '';
  const formatted = Number(val).toFixed(2);
  if (currency === 'TRY') return `${formatted}₺`;
  if (currency === 'USD') return `$${formatted}`;
  if (currency === 'EUR') return `€${formatted}`;
  return `${formatted}`;
};

export const getRawPrice = (product, currency = 'TRY', isCompareAt = false) => {
  let val = 0;
  if (currency === 'TRY') {
    val = isCompareAt ? product.compareAtPriceTry : product.priceTry;
  } else if (currency === 'USD') {
    val = product.priceUsd || (product.priceTry / 33);
  } else if (currency === 'EUR') {
    val = product.priceEur || (product.priceTry / 35);
  }
  return Number(val) || 0;
};

export const getCurrencySymbol = (currency) => {
  if (currency === 'TRY') return '₺';
  if (currency === 'USD') return '$';
  if (currency === 'EUR') return '€';
  return '';
};
