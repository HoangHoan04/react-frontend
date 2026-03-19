const DEFAULT_LOCALE = "vi-VN";

const normalizeDateValue = (value) => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (
  value,
  {
    locale = DEFAULT_LOCALE,
    fallback = "N/A",
    options = { day: "2-digit", month: "2-digit", year: "numeric" },
  } = {},
) => {
  const date = normalizeDateValue(value);
  if (!date) return fallback;

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatDateTime = (
  value,
  {
    locale = DEFAULT_LOCALE,
    fallback = "N/A",
    options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  } = {},
) => formatDate(value, { locale, fallback, options });
