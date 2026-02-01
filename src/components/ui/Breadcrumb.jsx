import { ROUTES } from "@/common/constants/routes";
import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = ({ theme = "light" }) => {
  const { pathname } = useLocation();

  const matchPathToPattern = useCallback((pathname, pattern) => {
    if (!pattern) return false;
    const pathParts = pathname.split("/").filter(Boolean);
    const patternParts = pattern.split("/").filter(Boolean);
    if (pathParts.length !== patternParts.length) return false;
    return pathParts.every((part, idx) => {
      const patternPart = patternParts[idx];
      return patternPart === part || patternPart.startsWith(":");
    });
  }, []);

  const findRouteByKey = useCallback((obj, key) => {
    const search = (searchObj) => {
      for (const value of Object.values(searchObj)) {
        const item = value;
        if (item.key === key) return item;
        if (item.children) {
          const result = search(item.children);
          if (result) return result;
        }
      }
      return null;
    };
    return search(obj);
  }, []);

  const findMatchingRoute = useCallback(
    (routes, targetPath) => {
      let bestMatch = null;
      let maxDepth = -1;
      const traverse = (obj, depth, parentKey) => {
        for (const item of Object.values(obj)) {
          const route = item;
          if (route.path) {
            const isMatch = matchPathToPattern(targetPath, route.path);
            if (isMatch) {
              const hasNoChildren =
                !route.children || Object.keys(route.children).length === 0;
              if (depth > maxDepth || (depth === maxDepth && hasNoChildren)) {
                bestMatch = { ...route, parentKey };
                maxDepth = depth;
              }
            }
          }
          if (route.children) traverse(route.children, depth + 1, route.key);
        }
      };
      traverse(routes, 0);
      return bestMatch;
    },
    [matchPathToPattern],
  );

  const breadcrumbChain = useMemo(() => {
    const homeItem = {
      label: "Trang chủ",
      path: "/",
      icon: "pi-home",
    };

    if (pathname === "/") {
      return [homeItem];
    }

    const matchedRoute = findMatchingRoute(ROUTES.MAIN, pathname);
    if (!matchedRoute) {
      return [homeItem];
    }

    const buildChainReverse = (route) => {
      const chain = [];
      let currentRoute = route;
      while (currentRoute) {
        chain.unshift({
          label: currentRoute.label,
          path: currentRoute.path,
          icon: currentRoute.icon,
        });
        currentRoute = currentRoute.parentKey
          ? findRouteByKey(ROUTES.MAIN, currentRoute.parentKey)
          : null;
      }
      return chain;
    };

    const routeChain = buildChainReverse(matchedRoute);

    if (routeChain.length === 0 || routeChain[0].path !== "/") {
      return [homeItem, ...routeChain];
    }

    return routeChain;
  }, [pathname, findMatchingRoute, findRouteByKey]);

  return (
    <div className="flex items-center px-2 py-1 md:px-4 md:py-2">
      <nav className="flex items-center gap-1">
        {breadcrumbChain.map((item, idx) => {
          const isLast = idx === breadcrumbChain.length - 1;
          const isFirst = idx === 0;
          const isDark = theme === "dark";

          return (
            <div key={idx} className="flex items-center gap-1">
              {!isFirst && (
                <i
                  className={`pi pi-angle-right text-[0.65rem] md:text-xs px-1 ${
                    isDark ? "text-[#595959]" : "text-[#bfbfbf]"
                  }`}
                />
              )}

              {isLast || !item.path ? (
                <span
                  className={`flex items-center gap-2 font-semibold cursor-default text-[0.65rem] md:text-[0.7rem] lg:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.icon && (
                    <i className={`pi ${item.icon} text-[0.75em]`} />
                  )}
                  <span>{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 no-underline transition-all duration-200 text-[0.65rem] md:text-[0.7rem] lg:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-[#1890ff] hover:text-[#40a9ff] hover:bg-[#1890ff]/5`}
                >
                  {item.icon && (
                    <i className={`pi ${item.icon} text-[0.75em]`} />
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
