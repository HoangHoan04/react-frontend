export const API_ROUTES = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://api.escuelajs.co/api/v1",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
    REFRESH_TOKEN: "/auth/refresh-token",
  },

  PRODUCT: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
    SLUG: (slug) => `/products/slug/${slug}`,
    CREATE: "/products/",
    UPDTE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    PAGINATION: (limit, offset) => `/products?offset=${offset}&limit=${limit}`,
    RELATED_BY_ID: (id) => `/products/${id}/related`,
    RELATED_BY_SLUG: (slug) => `/products/slug/${slug}/related`,
  },

  FILTER_PRODUCT: {
    FIND_BY_TITLE: (title) => `/products/?title=${title}`,
    FIND_BY_PRICE: (price) => `/products/?price=${price}`,
    FIND_BY_PRICE_RANGE: (price_min, price_max) =>
      `/products/?price_min=${price_min}&price_max=${price_max}`,
    FIND_BY_CATEGORY_ID: (categoryId) => `/products/?categoryId=${categoryId}`,
    FIND_BY_CATEGORY_SLUG: (categorySlug) =>
      `/products/?categorySlug=${categorySlug}`,
  },

  CATEGORY: {
    LIST: "/categories",
    DETAIL: (id) => `/categories/${id}`,
    SLUG: (slug) => `/categories/slug/${slug}`,
    CREATE: "/categories/",
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
    GET_ALL_PRODUCTS_BY_CATEGORY: (id) => `/categories/${id}/products`,
  },

  USER: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
    CREATE: "/users/",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    CHECK_EMAIL: (email) => `/users/is-available?email=${email}`,
  },

  LOCATIONS: {
    LIST: "/locations",
    GET_BY_ORIGIN: (origin) => `/locations/?origin=${origin}`,
    GET_WITH_LIMIT: (limit) => `/locations/?limit=${limit}`,
    GET_WITHIN_RADIUS: (radius, origin) =>
      `/locations?origin=${origin}&radius=${radius}`,
  },

  FILES: {
    UPLOAD_FILE: "/files/upload",
    GET_FILE: (fileName) => `/files/${fileName}`,
  },
};
