import { useEffect, useState } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

export const useGetUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
        const response = await rootApiService.get(API_ENDPOINTS.USER.LIST);
        setUsers(response || []);
        } catch (err) {
        setError(err);
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const refetch = fetchUsers;

    return {
        users,
        isLoading,
        error,
        refetch,
    };
};


export const useCreateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const mutateAsync = async (newUser) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await rootApiService.post(
                API_ENDPOINTS.USER.CREATE, newUser
            );
            setData(response);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
        setIsLoading(false);
        }
    };

    return {
        mutateAsync,
        isPending: isLoading,
        error,
        data,
    };
};

export const useUpdateUser = (userId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const mutateAsync = async (updatedUser) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await rootApiService.put(
                API_ENDPOINTS.USER.UPDATE(userId),
                updatedUser,
        );
            setData(response);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutateAsync,
        isPending: isLoading,
        error,
        data,
    };
};

export const useDeleteUser = (userId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const mutateAsync = async (userId) => {
        setIsLoading(true);
        setError(null);
        try {
        const response = await rootApiService.delete(
            API_ENDPOINTS.USER.DELETE(userId),
        );
        setData(response);
        return response;
        } catch (err) {
        setError(err);
        throw err;
        } finally {
        setIsLoading(false);
        }
    };

    return {
        mutateAsync,
        isPending: isLoading,
        error,
        data,
    };
};