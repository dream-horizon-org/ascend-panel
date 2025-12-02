import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import AscendSearchbar from "../../components/AscendSearchbar/AscendSearchbar";
import AscendButton from "../../components/AscendButton/AscendButton";
import AscendDropdown from "../../components/AscendDropdown/AscendDropdown";
import AscendMenu from "../../components/AscendMenu/AscendMenu";
import AscendMenuItem from "../../components/AscendMenuItem/AscendMenuItem";
import {
  useTags,
  useExperiments,
  Experiment,
  ExperimentFilters,
} from "../../network";

interface ColumnData {
  dataKey: keyof Experiment | "actions";
  label: string;
  width: string;
}

const COLUMNS: ColumnData[] = [
  { width: "15%", label: "#ID", dataKey: "experimentId" },
  { width: "35%", label: "Name", dataKey: "name" },
  { width: "10%", label: "Status", dataKey: "status" },
  { width: "25%", label: "Tags", dataKey: "tags" },
  { width: "10%", label: "Last Modified", dataKey: "updatedAt" },
  { width: "5%", label: "", dataKey: "actions" },
];

const STATUS_OPTIONS = ["LIVE", "PAUSED", "DRAFT", "CONCLUDED", "TERMINATED"];
const DEFAULT_PAGE_SIZE = 20;

const createTableComponents = (
  theme: any,
  onRowClick: (experiment: Experiment) => void,
): TableComponents<Experiment> => ({
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer
      component={Paper}
      {...props}
      ref={ref}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        border: `1px solid ${theme.palette.border.main}`,
      }}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        borderCollapse: "separate",
        tableLayout: "fixed",
        "& .MuiTableCell-root": {
          height: theme.customComponents.table.rowHeight,
          padding: theme.customComponents.table.cellPadding,
          borderBottom: `1px solid ${theme.customComponents.table.borderColor}`,
          fontSize: theme.customComponents.table.fontSize,
        },
      }}
    />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow: ({ item, ...props }) => (
    <TableRow
      {...props}
      onClick={() => onRowClick(item)}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    />
  ),
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
});

const RowActionsMenu: React.FC<{ row: Experiment }> = ({ row }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleAction = (action: string) => () => {
    console.log(`${action} experiment: ${row.experimentId}`);
    handleClose();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click navigation
    setAnchorEl(e.currentTarget as HTMLElement);
  };

  return (
    <>
      <IconButton size="small" onClick={handleMenuClick}>
        <MoreHorizIcon />
      </IconButton>
      <AscendMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            boxShadow: theme.customComponents.actions.shadow,
          },
        }}
      >
        <AscendMenuItem
          onClick={handleAction("Clone")}
          sx={{ fontSize: "12px", fontWeight: 600 }}
        >
          Clone
        </AscendMenuItem>
        <AscendMenuItem
          onClick={handleAction("Terminate")}
          sx={{ fontSize: "12px", fontWeight: 600 }}
        >
          Terminate
        </AscendMenuItem>
        <AscendMenuItem
          onClick={handleAction("Delete")}
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: theme.customComponents.actions.delete,
          }}
        >
          Delete
        </AscendMenuItem>
      </AscendMenu>
    </>
  );
};

const CellWithTooltip: React.FC<{ text: string; width: string }> = ({
  text,
  width,
}) => {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  return (
    <TableCell sx={{ width }}>
      <Tooltip
        title={text}
        placement="top"
        arrow
        disableHoverListener={!isOverflowing}
      >
        <Typography
          ref={textRef}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: isOverflowing ? "pointer" : "default",
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};

const StatusChip: React.FC<{ status: string; theme: any }> = ({
  status,
  theme,
}) => {
  const statusKey =
    status.toLowerCase() as keyof typeof theme.customComponents.status;
  const config =
    theme.customComponents.status[statusKey] ||
    theme.customComponents.status.draft;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: "28px",
        borderRadius: "4px",
        backgroundColor: config.background,
        fontWeight: 400,
        fontSize: "14px",
        "& .MuiChip-label": { padding: "4px 8px", lineHeight: 1 },
      }}
    />
  );
};

const TagsCell: React.FC<{ tags: string[]; theme: any }> = ({
  tags,
  theme,
}) => {
  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        overflow: "hidden",
        maxWidth: "100%",
        flexWrap: "nowrap",
      }}
    >
      {visibleTags.map((tag, idx) => (
        <Chip
          key={idx}
          label={tag}
          size="small"
          sx={{
            height: "28px",
            borderRadius: theme.customComponents.chip.borderRadius,
            backgroundColor: theme.customComponents.chip.background,
            color: theme.customComponents.chip.text,
            fontSize: "14px",
            fontWeight: 400,
            flexShrink: 0,
            maxWidth: "100%",
            "& .MuiChip-label": {
              padding: "4px 8px",
              lineHeight: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      ))}
      {remainingCount > 0 && (
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            color: theme.palette.primary.main,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          +{remainingCount}
        </Typography>
      )}
    </Box>
  );
};

const TableHeader = () => (
  <TableRow>
    {COLUMNS.map((column) => (
      <TableCell
        key={column.dataKey}
        variant="head"
        sx={{
          width: column.width,
          backgroundColor: "background.default",
          fontWeight: 600,
        }}
      >
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

const createRowContent = (theme: any) => (_index: number, row: Experiment) => (
  <React.Fragment>
    {COLUMNS.map((column) => {
      if (column.dataKey === "experimentId")
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={row.experimentId}
            width={column.width}
          />
        );
      if (column.dataKey === "name")
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={row.name}
            width={column.width}
          />
        );
      if (column.dataKey === "status") {
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width }}>
            <StatusChip status={row.status} theme={theme} />
          </TableCell>
        );
      }
      if (column.dataKey === "tags") {
        return (
          <TableCell
            key={column.dataKey}
            sx={{ width: column.width, overflow: "hidden" }}
          >
            <TagsCell tags={row.tags} theme={theme} />
          </TableCell>
        );
      }
      if (column.dataKey === "actions") {
        return (
          <TableCell
            key={column.dataKey}
            align="center"
            sx={{ width: column.width }}
          >
            <RowActionsMenu row={row} />
          </TableCell>
        );
      }
      if (column.dataKey === "updatedAt") {
        const formattedDate = new Date(row.updatedAt).toLocaleDateString(
          "en-US",
          {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          },
        );
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width }}>
            {formattedDate}
          </TableCell>
        );
      }
      return (
        <TableCell key={column.dataKey} sx={{ width: column.width }}>
          {String(row[column.dataKey as keyof Experiment] ?? "")}
        </TableCell>
      );
    })}
  </React.Fragment>
);

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch tags from API
  const { data: tagsData, isLoading: isTagsLoading } = useTags();
  const tagOptions = tagsData ?? [];

  // Build filter params for API - comma-separated values for status and tag
  const filterParams = useMemo<ExperimentFilters>(() => {
    const params: ExperimentFilters = {
      limit: DEFAULT_PAGE_SIZE,
      page: currentPage,
    };

    if (searchText.trim()) {
      params.name = searchText.trim();
    }

    // Comma-separated status values
    if (statusFilter.length > 0) {
      params.status = statusFilter.join(",");
    }

    // Comma-separated tag values
    if (tagsFilter.length > 0) {
      params.tag = tagsFilter.join(",");
    }

    return params;
  }, [searchText, statusFilter, tagsFilter, currentPage]);

  // Fetch experiments from API
  const {
    data: experimentsData,
    isLoading,
    isError,
    error,
  } = useExperiments(filterParams);

  const experiments = experimentsData?.experiments ?? [];
  const pagination = experimentsData?.pagination;

  const hasFilters =
    searchText.trim() !== "" ||
    statusFilter.length > 0 ||
    tagsFilter.length > 0;

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter([]);
    setTagsFilter([]);
    setCurrentPage(1);
  };

  const handleCreateExperiment = () => {
    navigate("/create-experiment");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: string | string[]) => {
    setStatusFilter(value as string[]);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleTagsChange = (value: string | string[]) => {
    setTagsFilter(value as string[]);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRowClick = (experiment: Experiment) => {
    navigate(`/experiment/${experiment.experimentId}`, {
      state: {
        experimentId: experiment.experimentId,
        projectKey: experiment.projectKey,
      },
    });
  };

  // Memoize table components to prevent unnecessary re-renders
  const tableComponents = useMemo(
    () => createTableComponents(theme, handleRowClick),
    [theme],
  );

  return (
    <Box
      sx={{
        padding: "24px",
        gap: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Title and Search */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
            Experiments
          </Typography>
          <AscendSearchbar
            size="small"
            variant="standard"
            placeholder="Search experiments..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </Box>

        {/* Right: Filters and Actions */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {hasFilters && (
            <AscendButton variant="text" size="small" onClick={clearFilters}>
              Clear All
            </AscendButton>
          )}
          <AscendDropdown
            variant="multi-checkbox"
            size="md"
            borderRadius="lg"
            label="Status"
            placeholder="Select status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={handleStatusChange}
            showCount
          />
          <AscendDropdown
            variant="multi-checkbox"
            size="md"
            borderRadius="lg"
            label="Tags"
            placeholder={isTagsLoading ? "Loading..." : "Select tags"}
            options={tagOptions}
            value={tagsFilter}
            onChange={handleTagsChange}
            showCount
            disabled={isTagsLoading}
          />
          <AscendButton
            startIcon={<AddIcon />}
            size="small"
            onClick={handleCreateExperiment}
          >
            Experiment
          </AscendButton>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ flexGrow: 1, height: "calc(100vh - 200px)" }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography color="error">
              Failed to load experiments: {error?.message || "Unknown error"}
            </Typography>
            <AscendButton
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Retry
            </AscendButton>
          </Box>
        ) : experiments.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              {hasFilters
                ? "No experiments match your filters"
                : "No experiments found"}
            </Typography>
            {hasFilters && (
              <AscendButton variant="text" onClick={clearFilters}>
                Clear Filters
              </AscendButton>
            )}
          </Box>
        ) : (
          <>
            <TableVirtuoso
              data={experiments}
              components={tableComponents}
              fixedHeaderContent={TableHeader}
              itemContent={createRowContent(theme)}
            />
            {pagination && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                  px: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {experiments.length} of {pagination.totalCount}{" "}
                  experiments
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <AscendButton
                    variant="outlined"
                    size="small"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </AscendButton>
                  <AscendButton
                    variant="outlined"
                    size="small"
                    disabled={!pagination.hasNext}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </AscendButton>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;
