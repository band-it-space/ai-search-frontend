import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { useResult } from "../../context/result_context";
import Loader from "../loader";
import RangePrice from "../range_price";
import DateRangeFilter from "../date_filter";
import ProducerFilter from "../producer_filter";
import ResetFiltersButton from "../reset_filters_button";
import { sx } from "./styles";
import { formatDate } from "../../utils/format-date";
import mixpanel from "mixpanel-browser";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: "tovar_name", numeric: false, disablePadding: true, label: "Товар" },
  {
    id: "name_tovar_1C",
    numeric: false,
    disablePadding: false,
    label: "Товар 1С",
  },
  { id: "name", numeric: false, disablePadding: false, label: "Постачальник" },
  { id: "costs", numeric: true, disablePadding: false, label: "Вартість (₴)" },
  {
    id: "costs_NDS",
    numeric: true,
    disablePadding: false,
    label: "Вартість з ПДВ (₴)",
  },
  {
    id: "date_prihod",
    numeric: false,
    disablePadding: false,
    label: "Дата приходу",
  },
];

const formatPrice = (value) => {
  return (
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + "₴"
  );
};

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}) {
  const createSortHandler = (property) => (event) =>
    onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sx={{
              padding: "12px 10px",
              borderTop: "1px solid #d1d5db",
              fontWeight: "bold",
              fontSize: "16px",
              ...(headCell.id === "tovar_name" && { width: "22%" }),
              ...(headCell.id === "name_tovar_1C" && { width: "22%" }),
              ...(headCell.id === "name" && { width: "22.5%" }),
              ...(headCell.id === "costs" && { width: "13%" }),
              ...(headCell.id === "costs_NDS" && { width: "10.5%" }),
              ...(headCell.id === "date_prihod" && { width: "10%" }),
            }}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ numSelected }) {
  return (
    <Toolbar
      sx={[
        {
          p: "14px 8px  !important",
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        ""
      )}

      <Typography
        sx={sx.controlFilter}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <ProducerFilter />
        <RangePrice />
        <DateRangeFilter />
        <ResetFiltersButton />
      </Typography>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ResultGrid() {
  const { filteredResults, originalResults, filters, loading, isSearched } =
    useResult();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("date_prihod");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    setPage(0);
  }, [filteredResults]);

  const hasActiveFilters =
    filters.priceRange !== null ||
    filters.dateRange !== null ||
    filters.manufacturers !== null ||
    filters.useNDS !== true;

  const displayData = hasActiveFilters ? filteredResults : originalResults;

  const sortedColumnsRef = React.useRef(new Set());

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    if (!sortedColumnsRef.current.has(property)) {
      console.log(`User sorted by column: ${property}`);
      sortedColumnsRef.current.add(property);
      mixpanel.track("useSort", {
        sortName: property,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = displayData.map((n, index) => index);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      [...displayData]
        .map((item, index) => ({ ...item, __index: index }))
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, displayData]
  );

  if (loading) {
    return <Loader />;
  }

  if (!isSearched) {
    return null;
  }

  if (isSearched && !originalResults.length) {
    return <Typography sx={{ mt: 3 }}>Результати не знайдено</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, border: "1px solid #d1d5db" }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={displayData.length}
            />
            <TableBody>
              {displayData.length > 0 ? (
                visibleRows.map((row, index) => (
                  <TableRow
                    key={row.__index}
                    sx={
                      index % 2 === 0
                        ? { background: "#eee" }
                        : { background: "#fff" }
                    }
                    hover
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ paddingLeft: "10px" }}
                    >
                      {row.tovar_name}
                    </TableCell>
                    <TableCell align="left">{row.name_tovar_1C}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right">
                      {formatPrice(row.costs)}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(row.costs_NDS)}
                    </TableCell>
                    <TableCell align="left">
                      {formatDate(row.date_prihod)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Немає результатів за поточними фільтрами
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={displayData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Кількість рядків на сторінці"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} із ${count}`
          }
        />
      </Paper>
    </Box>
  );
}
