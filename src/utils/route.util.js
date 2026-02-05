export const convertRoutesToMenuItems = (routes) => {
  const convertToMenuItem = (route) => {
    if (!route || route.isShow === false) return null;

    const menuItem = {
      key: route.key,
      path: route.path,
      icon: route.icon,
      label: route.label,
      isShow: route.isShow !== false,
    };

    if (route.children && Object.keys(route.children).length > 0) {
      const childItems = Object.values(route.children)
        .map((child) => convertToMenuItem(child))
        .filter(Boolean);

      if (childItems.length > 0) {
        menuItem.items = childItems;
      }
    }

    return menuItem;
  };

  return Object.values(routes)
    .map((route) => convertToMenuItem(route))
    .filter(Boolean);
};
