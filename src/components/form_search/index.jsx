import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useResult } from "../../context/result_context";
import axios from "axios";
import { sx } from "./styles";
import mixpanel from "mixpanel-browser";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FormSearch = () => {
    const [query, setQuery] = useState("");
    const { updateResults, setLoading, loading } = useResult();

    const handleSearch = async () => {
        if (!query) return;

        try {
            setLoading(true);

            if (!BACKEND_URL) {
                throw new Error("Server error, backend url missed");
            }

            const response = await axios.get(`${BACKEND_URL}/api/v1/search/`, {
                params: {
                    query,
                    limit: 100,
                },
            });

            handleSendMessage(query, response.data.results.length);
            updateResults(response.data.results);
        } catch (error) {
            console.error("Error while searching:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box sx={sx.wrapper}>
                <h1>Пошуковий модуль</h1>
            </Box>
            <Box sx={sx.wrapper}>
                <TextField
                    label="Введіть пошуковий запит"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={sx.input}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={sx.button}
                    disabled={!query.trim() || loading}
                >
                    {loading ? "Зачекайте..." : "Пошук"}
                </Button>
            </Box>
        </>
    );
};

export default FormSearch;

const handleSendMessage = (query, resultsLength) => {
    console.log(query, resultsLength);

    mixpanel.track("Message Sent", {
        query: query,
        resultsLength: resultsLength,
        timestamp: new Date().toISOString(),
    });
};
