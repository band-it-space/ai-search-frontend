import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useResult } from "../../context/result_context";

export default function ResetFiltersButton() {
  const { setFilters, filters } = useResult();

  const isActive =
    filters.priceRange !== null ||
    filters.dateRange !== null ||
    filters.useNDS !== true ||
    filters.manufacturers !== null;

  const handleReset = () => {
    if (!isActive) return;

    setFilters({
      priceRange: null,
      dateRange: null,
      manufacturers: null,
      useNDS: true,
    });
  };

  return (
    <Button
      variant="outlined"
      startIcon={isActive ? <DeleteIcon /> : <DeleteOutlineIcon />}
      onClick={handleReset}
      disabled={!isActive}
      sx={{
        lineHeight: "1.15",
        fontSize: "small",
        textTransform: "none",
        mt: 2,
        height: "44px",
        width: "100px",
        marginTop: "auto",
        marginLeft: "-32px",
        marginBottom: "6px",
      }}
    >
      {" "}
      Скинути фільтри
    </Button>
  );
}
