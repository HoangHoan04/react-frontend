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
    DETAIL: (id: number) => `/products/${id}`,
    SLUG: (slug: string) => `/products/slug/${slug}`,
    CREATE: "/products/",
    UPDTE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    PAGINATION: (limit: number, offset: number) =>
      `/products?offset=${offset}&limit=${limit}`,
    RELATED_BY_ID: (id: number) => `/products/${id}/related`,
    RELATED_BY_SLUG: (slug: string) => `/products/slug/${slug}/related`,
  },

  FILTER_PRODUCT: {
    FIND_BY_TITLE: (title: string) => `/products/?title=${title}`,
    FIND_BY_PRICE: (price: number) => `/products/?price=${price}`,
    FIND_BY_PRICE_RANGE: (price_min: number, price_max: number) =>
      `/products/?price_min=${price_min}&price_max=${price_max}`,
    FIND_BY_CATEGORY_ID: (categoryId: number) =>
      `/products/?categoryId=${categoryId}`,
    FIND_BY_CATEGORY_SLUG: (categorySlug: string) =>
      `/products/?categorySlug=${categorySlug}`,
  },

  CATEGORY: {
    LIST: "/categories",
    DETAIL: (id: number) => `/categories/${id}`,
    SLUG: (slug: string) => `/categories/slug/${slug}`,
    CREATE: "/categories/",
    UPDATE: (id: number) => `/categories/${id}`,
    DELETE: (id: number) => `/categories/${id}`,
    GET_ALL_PRODUCTS_BY_CATEGORY: (id: number) => `/categories/${id}/products`,
  },

  USER: {
    LIST: "/users",
    DETAIL: (id: number) => `/users/${id}`,
    CREATE: "/users/",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    CHECK_EMAIL: (email: string) => `/users/is-available?email=${email}`,
  },

  LOCATIONS: {
    LIST: "/locations",
    GET_BY_ORIGIN: (origin: string) => `/locations/?origin=${origin}`,
    GET_WITH_LIMIT: (limit: number) => `/locations/?limit=${limit}`,
    GET_WITHIN_RADIUS: (radius: number, origin: string) =>
      `/locations?origin=${origin}&radius=${radius}`,
  },

  FILES: {
    UPLOAD_FILE: "/files/upload",
    GET_FILE: (fileName: string) => `/files/${fileName}`,
  },
};
