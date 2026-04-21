import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState } from "react";
import type { PortfolioStock } from "../../types/stock";

interface PortfolioTableProps {
  stocks: PortfolioStock[];
  globalFilter: string;
  onEdit: (stock: PortfolioStock) => void;
  onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<PortfolioStock>();

export default function PortfolioTable({
  stocks,
  globalFilter,
  onEdit,
  onDelete,
}: PortfolioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Define table columns.
  // Each column specifies how to access and display a field.
  const columns = useMemo(
    () => [
      columnHelper.accessor("ticker", {
        header: "Ticker",
        cell: (info) => (
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor("companyName", {
        header: "Company",
        cell: (info) => (
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("purchasePrice", {
        header: "Buy Price",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor("currentPrice", {
        header: "Current Price",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      // Computed column: total gain/loss
      columnHelper.display({
        id: "gainLoss",
        header: "Gain / Loss",
        cell: ({ row }) => {
          const { quantity, purchasePrice, currentPrice } = row.original;
          const gl = (currentPrice - purchasePrice) * quantity;
          const isPositive = gl >= 0;
          return (
            <Chip
              label={`${isPositive ? "+" : ""}$${gl.toFixed(2)}`}
              size="small"
              sx={{
                bgcolor: isPositive ? "#e6f9f0" : "#fde8e8",
                color: isPositive ? "#00b894" : "#d63031",
                fontWeight: 600,
                fontSize: 13,
              }}
            />
          );
        },
      }),
      columnHelper.accessor("dateOfPurchase", {
        header: "Purchase Date",
        cell: (info) => info.getValue(),
      }),
      // Actions column (edit / delete buttons)
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(row.original)}
                sx={{ color: "#1a1a2e" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(row.original.id)}
                sx={{ color: "#d63031" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ),
      }),
    ],
    [onEdit, onDelete],
  );

  // Initialize TanStack Table.
  const table = useReactTable({
    data: stocks,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid #e8e8e8" }}
    >
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  sx={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#555",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    bgcolor: "#fafafa",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {/* Show sort direction indicator */}
                  {header.column.getIsSorted() === "asc" && (
                    <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
                  )}
                  {header.column.getIsSorted() === "desc" && (
                    <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  No stocks in portfolio. Add one to get started.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                  transition: "background 0.15s",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ fontSize: 14 }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
