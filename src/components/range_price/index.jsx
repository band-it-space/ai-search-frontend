import React, { useState, useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useResult } from "../../context/result_context";
import { sx } from "./styles";
import mixpanel from "mixpanel-browser";

function valuetext(value) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₴`;
}

const arraysEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export default function RangePrice() {
  const { filters, setFilters, applyFilters, originalResults } = useResult();
  const useNDS = filters.useNDS;

  const prices = useMemo(() => {
    const values = originalResults.map((item) =>
      useNDS ? item.costs_NDS : item.costs
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min, max];
  }, [originalResults, useNDS]);

  const [value, setValue] = useState(prices);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (filters.priceRange === null) {
      setValue(prices);
    }
  }, [filters.priceRange, prices]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = (event, newValue) => {
    if (arraysEqual(filters.priceRange || [], newValue)) {
      console.log("⚠️ No price change detected, skipping filter.");
      return;
    }

    const newFilters = { ...filters, priceRange: newValue };
    setFilters(newFilters);
    applyFilters(newFilters);

    if (!hasInteracted.current) {
      hasInteracted.current = true;
      handleSendMessage()
    }
  };

  return (
    <Box sx={sx.distance}>
      {/* <FormControlLabel control={<Switch checked={useNDS} onChange={handleToggleNDS} />} label="Вартість з ПДВ (₴)" /> */}
      <Typography
        variant="body2"
        sx={{ mb: 1, fontSize: 14, fontWeight: "bold" }}
      >
        Вартість з ПДВ
      </Typography>
      <Slider
        getAriaLabel={() => "Price range"}
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="on"
        valueLabelFormat={(value) =>
          `${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} ₴`
        }
        getAriaValueText={valuetext}
        min={prices[0]}
        max={prices[1]}
        step={1}
        disabled={prices[0] === prices[1]}
        sx={{
          "& .MuiSlider-thumb": {
            width: "14px",
            height: "14px",
            "&:hover, &$active": {
              boxShadow: "none",
            },
          },
          "& .MuiSlider-valueLabel": {
            background: "transparent",
            color: "black",
            border: "none",
            margin: "10px",
          },
        }}
      />
    </Box>
  );
}

const handleSendMessage = () => {
  mixpanel.track("useFilterByPrice", {
    useFilterByPrice: true,
    timestamp: new Date().toISOString(),
  });
};
