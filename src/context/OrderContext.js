// src/context/OrderContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import OrderServices from "@services/OrderServices";
import CustomerServices from "@services/CustomerServices";
import { UserContext } from "@context/UserContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderData, setOrderData] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [error, setError] = useState("");
    const [documentsError, setDocumentsError] = useState("");
    const [lastFetched, setLastFetched] = useState(null);
    const [lastDocumentsFetched, setLastDocumentsFetched] = useState(null);
    const { state: { userInfo } } = useContext(UserContext);

    const fetchOrderData = async (force = false) => {
        // If we already have data and it's not forced, don't fetch again (1 minutes)
        if (orderData && !force && lastFetched && Date.now() - lastFetched < 1 * 60 * 1000) {
            return;
        }

        setLoading(true);
        try {
            const data = await OrderServices.getOrderCustomer({
                // page: currentPage,
                // limit: 8,
            });
            setOrderData(data);
            setLastFetched(Date.now());
            setError("");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchDocumentData = async (force = false) => {
        // If we already have data and it's not forced, don't fetch again (1 minutes)
        if (documentData && !force && lastDocumentsFetched && Date.now() - lastDocumentsFetched < 1 * 60 * 1000) {
            return;
        }

        setDocumentsLoading(true);
        try {
            const data = await CustomerServices.getCustomerDocuments();
            setDocumentData(data);
            setLastDocumentsFetched(Date.now());
            setDocumentsError("");
        } catch (err) {
            console.error('err :>> ', err);
            if (err.response && err.response.data && err.response.data.message) {
                setDocumentsError(err.response.data.message);
            } else {
                setDocumentsError(err.message);
            }
        } finally {
            setDocumentsLoading(false);
        }
    };

    // Fetch data when user is logged in, clear data when logged out
    useEffect(() => {
        if (userInfo) {
            fetchOrderData();
            fetchDocumentData();
        } else {
            // Reset all data when user logs out
            setOrderData(null);
            setDocumentData(null);
            setError("");
            setDocumentsError("");
            setLastFetched(null);
            setLastDocumentsFetched(null);
            setLoading(true);
            setDocumentsLoading(true);
        }
    }, [userInfo]);

    return (
        <OrderContext.Provider
            value={{
                orderData,
                documentData,
                loading,
                documentsLoading,
                error,
                documentsError,
                fetchOrderData,
                fetchDocumentData,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider; 