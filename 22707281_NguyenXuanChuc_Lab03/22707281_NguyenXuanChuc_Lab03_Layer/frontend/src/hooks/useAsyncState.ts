import { useState } from "react";

export const useAsyncState = <T>(initial: T) => {
    const [data, setData] = useState<T>(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    return {
        data,
        loading,
        error,
        setData,
        setLoading,
        setError,
    };
};
