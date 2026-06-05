export const formatShortDate = (iso: string, locale: string) => {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
  }).format(date);
  const month = new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    month: 'short',
  })
    .format(date)
    .replace('.', '')
    .toUpperCase();
  return `${day} ${month}`;
};

export const formatLongDate = (iso: string, locale: string) => {
  return new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
};
