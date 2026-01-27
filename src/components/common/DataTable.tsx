import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon
} from '@mui/icons-material';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: keyof T;
  title?: string;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onRowClick?: (row: T) => void;
  onDelete?: (selected: T[]) => void;
  onExport?: () => void;
  searchable?: boolean;
  defaultRowsPerPage?: number;
}

type Order = 'asc' | 'desc';

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  title,
  selectable = false,
  onSelectionChange,
  onRowClick,
  onDelete,
  onExport,
  searchable = false,
  defaultRowsPerPage = 10
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState<T[]>([]);
  const [orderBy, setOrderBy] = useState<keyof T | string>('');
  const [order, setOrder] = useState<Order>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(rows);
      onSelectionChange?.(rows);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T) => {
    const selectedIndex = selected.findIndex(
      (item) => item[rowKey] === row[rowKey]
    );
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, row];
    } else {
      newSelected = selected.filter((item) => item[rowKey] !== row[rowKey]);
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (row: T) =>
    selected.findIndex((item) => item[rowKey] === row[rowKey]) !== -1;

  const handleRequestSort = (property: keyof T | string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    
    return rows.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!orderBy) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aValue = a[orderBy as keyof T];
      const bValue = b[orderBy as keyof T];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, order, orderBy]);

  const paginatedRows = useMemo(() => {
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedRows, page, rowsPerPage]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {(title || selected.length > 0 || searchable) && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'primary.lighter'
                  : 'primary.dark',
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <>
              {title && (
                <Typography
                  sx={{ flex: '1 1 100%' }}
                  variant="h6"
                  component="div"
                >
                  {title}
                </Typography>
              )}
              {searchable && (
                <TextField
                  placeholder="Search..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ml: 'auto', mr: 2 }}
                />
              )}
            </>
          )}

          {selected.length > 0 ? (
            <>
              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(selected)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : (
            <>
              {onExport && (
                <Tooltip title="Export">
                  <IconButton onClick={onExport}>
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Filter list">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      )}

      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => {
              const isItemSelected = isSelected(row);
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={String(row[rowKey])}
                  selected={isItemSelected}
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row);
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.id as keyof T];
                    return (
                      <TableCell key={String(column.id)} align={column.align}>
                        {column.format ? column.format(value, row) : String(value ?? '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
