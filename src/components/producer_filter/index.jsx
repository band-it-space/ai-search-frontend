import React, { useState, useEffect, useMemo, useRef } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useResult } from "../../context/result_context";
import { sx } from "./style";
import mixpanel from "mixpanel-browser";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      padding: 0,
    },
  },
};

export default function ManufacturerFilter() {
  const { filters, setFilters, applyFilters, originalResults } = useResult();
  const [selectedManufacturers, setSelectedManufacturers] = useState(
    filters.manufacturers || []
  );

  const hasInteracted = useRef(false);

  const availableManufacturers = useMemo(() => {
    let data = [...originalResults];

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      data = data.filter((item) => {
        const price = parseFloat(filters.useNDS ? item.costs_NDS : item.costs);
        return price >= min && price <= max;
      });
    }

    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      data = data.filter((item) => {
        const itemDate = new Date(item.date_prihod);
        return itemDate >= start && itemDate <= end;
      });
    }

    const uniqueNames = new Set(data.map((item) => item.name).filter(Boolean));
    return Array.from(uniqueNames).sort();
  }, [filters.priceRange, filters.dateRange, filters.useNDS, originalResults]);

  useEffect(() => {
    setSelectedManufacturers(filters.manufacturers || []);
  }, [filters.manufacturers]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;

    setSelectedManufacturers(newValue);

    const newFilters = {
      ...filters,
      manufacturers: newValue.length > 0 ? newValue : null,
    };

    setFilters(newFilters);
    applyFilters(newFilters);

    if (!hasInteracted.current) {
      hasInteracted.current = true;
      handleSendMessage();
    }
  };

  return (
    <Box sx={sx.distance}>
      <Typography
        variant="body2"
        sx={{ mb: 1, fontSize: 14, fontWeight: "bold" }}
      >
        Виробник
      </Typography>
      <FormControl fullWidth>
        <Select
          labelId="manufacturer-filter-label"
          id="manufacturer-filter"
          multiple
          value={selectedManufacturers}
          onChange={handleChange}
          displayEmpty
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <span style={{ color: "#9e9e9e" }}>Оберіть виробників</span>
              );
            }
            return selected.join(", ");
          }}
          MenuProps={MenuProps}
          sx={{
            fontSize: 15,
            height: "44px",
            "& .MuiOutlinedInput-input": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
        >
          {availableManufacturers.map((name) => (
            <MenuItem
              key={name}
              value={name}
              sx={{
                fontSize: 13,
                minHeight: 36,
                py: 0.5,
                px: "6px",
              }}
            >
              <Checkbox
                checked={selectedManufacturers.includes(name)}
                sx={{
                  padding: "4px",
                  marginRight: "4px",
                }}
              />
              <ListItemText
                primary={name}
                primaryTypographyProps={{
                  fontSize: 13,
                  sx: {
                    whiteSpace: "normal",
                    overflow: "visible",
                    textOverflow: "unset",
                    maxWidth: "270px",
                  },
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

const handleSendMessage = () => {
  mixpanel.track("useFilterBySuppliers", {
    useFilterBySuppliers: true,
    timestamp: new Date().toISOString(),
  });
};
