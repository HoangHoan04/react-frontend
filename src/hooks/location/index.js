import { useEffect, useState } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

export const useGetLocations = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(API_ENDPOINTS.LOCATIONS.LIST);
      setLocations(response || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const refetch = fetchLocations;

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};

export const useGetLocationsByOrigin = (origin) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    if (!origin) {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.LOCATIONS.GET_BY_ORIGIN(origin),
      );
      setLocations(response || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [origin]);

  const refetch = fetchLocations;

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};

export const useGetLocationsWithSize = (size) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    if (size === undefined || size === null || size === "") {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.LOCATIONS.GET_WITH_SIZE(size),
      );
      setLocations(response || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [size]);

  const refetch = fetchLocations;

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};

export const useGetLocationsWithinRadius = (radius, origin) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    if (!radius || !origin) {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.LOCATIONS.GET_WITHIN_RADIUS(radius, origin),
      );
      setLocations(response || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [radius, origin]);

  const refetch = fetchLocations;

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};
