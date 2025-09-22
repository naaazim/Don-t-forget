import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

function Confirmation() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        const confirmAccount = async () => {
            if (!token) return;

            try {
                await axios.get(`/api/v1/confirm?token=${token}`);
                navigate("/login");
            } catch (err) {
                console.error("Erreur de confirmation :", err.response?.data || err.message);
                navigate("/login");
            }
        };

        confirmAccount();
    }, [token, navigate]);

    return null;
}

export default Confirmation;
