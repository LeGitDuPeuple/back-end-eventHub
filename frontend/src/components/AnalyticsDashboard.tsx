import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axiosConfig";

/**
 * Composant de statistiques simplifié.
 * Affiche le nombre d'inscriptions par jour sous forme d'histogramme.
 */
export const AnalyticsDashboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/analytics/user-stats");
                setData(response.data.data || []);
            } catch (error) {
                console.error("Erreur stats:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ width: "100%", height: 350, backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Nombre d'inscriptions par jour</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};