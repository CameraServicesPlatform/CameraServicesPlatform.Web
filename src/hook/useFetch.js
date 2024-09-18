import { useEffect, useState } from "react";
import api from "../config/axios";

const useFetch = (url, method,requestData ) => {
    const [data, setData] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
    //    setIsLoading(true);
        try {
            let response;
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await api.get(url);
                    break;
                case 'POST':
                    response = await api.post(url,requestData );
                    break;
                case 'PUT':
                    response = await api.put(url,requestData );
                    break;
                case 'DELETE':
                    response = await api.delete(url);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
            setData(response.data);
        //    setIsLoading(false);
        } catch (error) {
            setIsError(true);
         //   setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url, method,requestData]); 

    return { data,  isError };
}

export default useFetch;
