import React, { useState, useEffect, useMemo, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { useResult } from "../../context/result_context";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Typography from "@mui/material/Typography";
import { sx } from "./style";
import Box from "@mui/material/Box";
import mixpanel from "mixpanel-browser";

export default function DateRangeFilter() {
    const { filters, setFilters, applyFilters, originalResults } = useResult();
    const [range, setRange] = useState(null);
    const hasInteracted = useRef(false); 

    const dateRangeFromResults = useMemo(() => {
        const allDates = originalResults
            .map((item) => new Date(item["date_prihod"]))
            .filter((d) => !isNaN(d));

        if (allDates.length === 0) return null;

        const minDate = new Date(Math.min(...allDates));
        const maxDate = new Date(Math.max(...allDates));

        return [minDate, maxDate];
    }, [originalResults]);

    useEffect(() => {
        if (filters.dateRange === null) {
            setRange(dateRangeFromResults || null);
        } else {
            setRange(filters.dateRange);
        }
    }, [filters.dateRange, dateRangeFromResults]);

    const handleChange = (e) => {
        const [start, end] = e.value || [];
        setRange(e.value);

        const newFilters = {
            ...filters,
            dateRange: start && end ? [start, end] : null,
        };

        setFilters(newFilters);
        applyFilters(newFilters);

        if (!hasInteracted.current) {
            hasInteracted.current = true;
            handleSendMessage()
        }
    };

    return (
        <Box sx={sx.distance}>
            <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: 14, fontWeight: "bold" }}
            >
                Дата приходу
            </Typography>
            <Calendar
                key={filters.dateRange === null ? "reset" : "active"}
                id="daterange"
                value={range}
                onChange={handleChange}
                selectionMode="range"
                readOnlyInput
                dateFormat="yy-mm-dd"
                showIcon
                placeholder="р-м-д - р-м-д"
            />
        </Box>
    );
}


const handleSendMessage = () => {
    mixpanel.track("useFilterByData", {
        useFilterByData: true,
      timestamp: new Date().toISOString(),
    });
  };