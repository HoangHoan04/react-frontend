export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
      isShow: false,
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
      icon: "pi pi-home",
    },

    USER_MANAGER: {
      key: "USER_MANAGER",
      label: "Quản lý người dùng",
      icon: "pi pi-user",
      path: "/user-manager",
      children: {
        CUSTOMER_MANAGER: {
          key: "CUSTOMER_MANAGER",
          label: "Quản lý khách hàng",
          path: "/customer-manager",
          children: {
            ADD_CUSTOMER: {
              key: "ADD_CUSTOMER",
              label: "Thêm khách hàng",
              path: "/customer/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_CUSTOMER: {
              key: "EDIT_CUSTOMER",
              label: "Chỉnh sửa khách hàng",
              path: "/customer/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_CUSTOMER: {
              key: "DETAIL_CUSTOMER",
              label: "Chi tiết khách hàng",
              path: "/customer/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
        EMPLOYEE_MANAGER: {
          key: "EMPLOYEE_MANAGER",
          label: "Quản lý nhân viên viên",
          path: "/employee-manager",
          children: {
            ADD_EMPLOYEE: {
              key: "ADD_EMPLOYEE",
              label: "Thêm nhân viên viên",
              path: "/employee/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_EMPLOYEE: {
              key: "EDIT_EMPLOYEE",
              label: "Chỉnh sửa nhân viên viên",
              path: "/employee/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_EMPLOYEE: {
              key: "DETAIL_EMPLOYEE",
              label: "Chi tiết nhân viên viên",
              path: "/employee/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
      },
    },

    PRODUCT_MANAGER: {
      key: "PRODUCT_MANAGER",
      label: "Quản lý sản phẩm",
      icon: "pi pi-users",
      path: "/product-manager",
      children: {
        ADD_PRODUCT: {
          key: "ADD_PRODUCT",
          label: "Thêm sản phẩm",
          path: "/product/add",
          icon: "pi pi-plus-circle",
          isShow: false,
        },
        EDIT_PRODUCT: {
          key: "EDIT_PRODUCT",
          label: "Chỉnh sửa sản phẩm",
          path: "/product/edit/:id",
          icon: "pi pi-pencil-circle",
          isShow: false,
        },
        DETAIL_PRODUCT: {
          key: "DETAIL_PRODUCT",
          label: "Chi tiết sản phẩm",
          path: "/product/detail/:id",
          icon: "pi pi-info-circle",
          isShow: false,
        },
      },
    },

    CATEGORY_MANAGER: {
      key: "CATEGORY_MANAGER",
      label: "Quản lý thể loại",
      icon: "pi pi-images",
      path: "/category-manager",
      children: {
        ADD_CATEGORY: {
          key: "ADD_CATEGORY",
          label: "Thêm thể loại",
          path: "/category/add",
          isShow: false,
        },
        EDIT_CATEGORY: {
          key: "EDIT_CATEGORY",
          label: "Chỉnh sửa thể loại",
          path: "/category/edit/:id",
          isShow: false,
        },
        DETAIL_CATEGORY: {
          key: "DETAIL_CATEGORY",
          label: "Chi tiết thể loại",
          path: "/category/detail/:id",
          isShow: false,
        },
      },
    },

    LOCATION_MANAGER: {
      key: "LOCATION_MANAGER",
      label: "Quản lý vị trí",
      icon: "pi pi-shield",
      path: "/location-manager",
    },
  },
};
