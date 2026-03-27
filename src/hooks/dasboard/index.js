import { useState, useEffect, useRef } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

const DATE_RECORD = "2026-03-01T00:00:00Z";

const useStats = () => {
  const [stats, setStats] = useState([]);
  const didRun = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProducts = async () => {
    try {
      const response = await rootApiService.get(API_ENDPOINTS.PRODUCT.LIST);

      const incrementUserCount = response.filter(
        (product) => new Date(product.creationAt) >= new Date(DATE_RECORD),
      ).length;

      const percentageChange = (
        (incrementUserCount / response.length) *
        100
      ).toFixed(2);

      const newStats = {
        title: "Tổng số sản phẩm",
        value: incrementUserCount,
        change: `+${percentageChange}%`,
        desc: "Số sản phẩm mới từ ngày 1/3/2026",
        sub: "Tổng số sản phẩm hiện tại",
        icon: "pi pi-arrow-up",
        color: "text-green-500",
      };
      setStats((prevStats) => [...prevStats, newStats]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await rootApiService.get(API_ENDPOINTS.CATEGORY.LIST);
      const incrementCategoryCount = response.filter(
        (category) => new Date(category.creationAt) >= new Date(DATE_RECORD),
      ).length;

      const percentageChange = (
        (incrementCategoryCount / response.length) *
        100
      ).toFixed(2);
      setStats((prevStats) => [
        ...prevStats,
        {
          title: "Tổng số danh mục",
          value: response.length,
          change: `+${percentageChange}%`,
          desc: "Số danh mục mới",
          sub: "Tổng số danh mục hiện tại",
          icon: "pi pi-list",
          color: "text-blue-500",
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await rootApiService.get(API_ENDPOINTS.LOCATIONS.LIST);

      const newStats = {
        title: "Tổng số địa điểm",
        value: response.length,
        change: "+0%",
        desc: "Số địa điểm mới",
        sub: "Tổng số địa điểm hiện tại",
        icon: "pi pi-map-marker",
        color: "text-orange-500",
      };
      setStats((prevStats) => [...prevStats, newStats]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await rootApiService.get(API_ENDPOINTS.USER.LIST);

      const incrementUserCount = response.filter(
        (user) => new Date(user.creationAt) >= new Date(DATE_RECORD),
      ).length;

      const percentageChange = (
        (incrementUserCount / response.length) *
        100
      ).toFixed(2);

      const newStats = {
        title: "Tổng số người dùng",
        value: response.length,
        change: `+${percentageChange}%`,
        desc: "Số người dùng mới từ ngày 1/3/2026",
        sub: "Tổng số người dùng hiện tại",
        icon: "pi pi-users",
        color: "text-green-500",
      };
      setStats((prevStats) => [...prevStats, newStats]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    fetchAllProducts();
    fetchCategories();
    fetchLocations();
    fetchUsers();
  }, []);

  return {
    stats,
    loading,
    error,
  };
};

export default useStats;
