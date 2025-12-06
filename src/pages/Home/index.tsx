import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  useTerminateExperiment,
  usePauseExperiment,
  useRestartExperiment,
  Experiment,
  ExperimentFilters,
} from "../../network";
import CsvUploadModal from "../../components/CsvUploadModal/CsvUploadModal";
import CreateAudienceModal from "../../components/CreateAudienceModal/CreateAudienceModal";
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";
import AscendModal from "../../components/AscendModal/AscendModal";
import { useDebounce } from "../../utils/useDebounce";

interface ColumnData {
  dataKey: keyof Experiment | "actions";
  label: string;
  width: string;
}

const COLUMNS: ColumnData[] = [
  { width: "15%", label: "Experiment ID", dataKey: "experimentId" },
  { width: "35%", label: "Name", dataKey: "name" },
  { width: "10%", label: "Status", dataKey: "status" },
  { width: "25%", label: "Tags", dataKey: "tags" },
  { width: "10%", label: "Last Modified", dataKey: "updatedAt" },
  { width: "5%", label: "", dataKey: "actions" },
];

const STATUS_OPTIONS = ["LIVE", "PAUSED", "CONCLUDED", "TERMINATED"];
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
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  // Terminate mutation
  const terminateMutation = useTerminateExperiment();
  const {
    isPending: isTerminating,
    isError: isTerminateError,
    error: terminateError,
    isSuccess: isTerminateSuccess,
  } = terminateMutation;

  // Pause mutation
  const pauseMutation = usePauseExperiment();
  const {
    isPending: isPausing,
    isError: isPauseError,
    error: pauseError,
    isSuccess: isPauseSuccess,
  } = pauseMutation;

  // Restart mutation
  const restartMutation = useRestartExperiment();
  const {
    isPending: isRestarting,
    isError: isRestartError,
    error: restartError,
    isSuccess: isRestartSuccess,
  } = restartMutation;

  // Check if experiment can be terminated (not already terminated or concluded)
  const isTerminated = row.status === "TERMINATED";
  const isConcluded = row.status === "CONCLUDED";
  const canTerminate = !["TERMINATED",].includes(row.status);
  const canPause =
    row.status === "LIVE" && !["TERMINATED", "CONCLUDED"].includes(row.status);
  const canRestart =
    row.status === "PAUSED" &&
    !["TERMINATED", "CONCLUDED"].includes(row.status);

  const handleClose = (e?: React.MouseEvent | {}) => {
    if (e && "stopPropagation" in e) {
      (e as React.MouseEvent).stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleTerminateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    if (!isTerminating && canTerminate) {
      setShowTerminateConfirm(true);
    }
  };

  const handleConfirmTerminate = () => {
    terminateMutation.mutate({
      id: row.experimentId,
      data: { status: "TERMINATED" },
    });
    setShowTerminateConfirm(false);
  };

  const handleCancelTerminate = () => {
    setShowTerminateConfirm(false);
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPausing && canPause) {
      pauseMutation.mutate({
        id: row.experimentId,
        data: { status: "PAUSED" },
      });
    }
    handleClose();
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRestarting && canRestart) {
      restartMutation.mutate({
        id: row.experimentId,
        data: { status: "LIVE" },
      });
    }
    handleClose();
  };

  // Don't render menu button for terminated or concluded experiments
  if (isTerminated) {
    return null;
  }

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
        {canPause && (
          <AscendMenuItem
            onClick={handlePause}
            disabled={isPausing}
            sx={{ fontSize: "12px", fontWeight: 600 }}
          >
            {isPausing ? "Pausing..." : "Pause Experiment"}
          </AscendMenuItem>
        )}
        {canRestart && (
          <AscendMenuItem
            onClick={handleRestart}
            disabled={isRestarting}
            sx={{ fontSize: "12px", fontWeight: 600 }}
          >
            {isRestarting ? "Restarting..." : "Restart Experiment"}
          </AscendMenuItem>
        )}
        {canTerminate && (
          <AscendMenuItem
            onClick={handleTerminateClick}
            disabled={isTerminating}
            sx={{ fontSize: "12px", fontWeight: 600 }}
          >
            {isTerminating ? "Terminating..." : "Terminate"}
          </AscendMenuItem>
        )}
      </AscendMenu>

      {/* Terminate Confirmation Modal */}
      <AscendModal
        open={showTerminateConfirm}
        onClose={handleCancelTerminate}
        config={{
          title: "Terminate Experiment",
          description: `Are you sure you want to terminate experiment "${row.name}"? This action cannot be undone.`,
          showCloseButton: false,
          width: 450,
          actions: (
            <>
              <AscendButton
                variant="outlined"
                onClick={handleCancelTerminate}
                sx={{ mr: 1 }}
              >
                Cancel
              </AscendButton>
              <AscendButton
                variant="contained"
                color="error"
                onClick={handleConfirmTerminate}
                disabled={isTerminating}
              >
                {isTerminating ? "Terminating..." : "Terminate"}
              </AscendButton>
            </>
          ),
        }}
      />

      {/* Snackbars for terminate action */}
      <AscendSnackbar
        open={isTerminateSuccess}
        message="Experiment terminated successfully"
        severity="success"
        onClose={() => terminateMutation.reset()}
      />
      <AscendSnackbar
        open={isTerminateError}
        message={terminateError?.message || "Failed to terminate experiment"}
        severity="error"
        onClose={() => terminateMutation.reset()}
      />

      {/* Snackbars for pause action */}
      <AscendSnackbar
        open={isPauseSuccess}
        message="Experiment paused successfully"
        severity="success"
        onClose={() => pauseMutation.reset()}
      />
      <AscendSnackbar
        open={isPauseError}
        message={pauseError?.message || "Failed to pause experiment"}
        severity="error"
        onClose={() => pauseMutation.reset()}
      />

      {/* Snackbars for restart action */}
      <AscendSnackbar
        open={isRestartSuccess}
        message="Experiment restarted successfully"
        severity="success"
        onClose={() => restartMutation.reset()}
      />
      <AscendSnackbar
        open={isRestartError}
        message={restartError?.message || "Failed to restart experiment"}
        severity="error"
        onClose={() => restartMutation.reset()}
      />
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
        color: config.color,
        fontWeight: 500,
        fontSize: "12px",
        "& .MuiChip-label": { padding: "0 12px", lineHeight: 1 },
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
            onClick={(e) => e.stopPropagation()}
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

  // Debounce filter values (300ms delay)
  const debouncedSearchText = useDebounce(searchText, 300);
  const debouncedStatusFilter = useDebounce(statusFilter, 300);
  const debouncedTagsFilter = useDebounce(tagsFilter, 300);

  // Audience creation flow states
  const [isCreateAudienceModalOpen, setIsCreateAudienceModalOpen] =
    useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [createdAudienceId, setCreatedAudienceId] = useState<number | null>(
    null,
  );
  const [showAudienceSuccessSnackbar, setShowAudienceSuccessSnackbar] =
    useState<boolean>(false);
  const [showCsvUploadSuccessSnackbar, setShowCsvUploadSuccessSnackbar] =
    useState<boolean>(false);

  // Accumulated experiments for infinite scroll
  const [allExperiments, setAllExperiments] = useState<Experiment[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch tags from API
  const { data: tagsData, isLoading: isTagsLoading } = useTags();
  const tagOptions = tagsData ?? [];

  // Build filter params for API - uses debounced values
  const filterParams = useMemo<ExperimentFilters>(() => {
    const params: ExperimentFilters = {
      limit: DEFAULT_PAGE_SIZE,
      page: currentPage,
    };

    if (debouncedSearchText.trim()) {
      params.name = debouncedSearchText.trim();
    }

    // Comma-separated status values
    if (debouncedStatusFilter.length > 0) {
      params.status = debouncedStatusFilter.join(",");
    }

    // Comma-separated tag values
    if (debouncedTagsFilter.length > 0) {
      params.tag = debouncedTagsFilter.join(",");
    }

    return params;
  }, [
    debouncedSearchText,
    debouncedStatusFilter,
    debouncedTagsFilter,
    currentPage,
  ]);

  // Fetch experiments from API (uses queryClient retry configuration)
  const {
    data: experimentsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useExperiments(filterParams);

  // Reset accumulated experiments when debounced filters change
  useEffect(() => {
    setAllExperiments([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [debouncedSearchText, debouncedStatusFilter, debouncedTagsFilter]);

  // Append new experiments when data arrives
  useEffect(() => {
    if (experimentsData?.experiments) {
      if (currentPage === 1) {
        // First page - replace all experiments
        setAllExperiments(experimentsData.experiments);
      } else {
        // Subsequent pages - append experiments
        setAllExperiments((prev) => {
          const existingIds = new Set(prev.map((e) => e.experimentId));
          const newExperiments = experimentsData.experiments.filter(
            (e) => !existingIds.has(e.experimentId),
          );
          return [...prev, ...newExperiments];
        });
      }
      // Update hasMore based on pagination
      setHasMore(experimentsData.pagination?.hasNext ?? false);
    }
  }, [experimentsData, currentPage]);

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
    setAllExperiments([]);
    setHasMore(true);
  };

  const handleRefresh = () => {
    setAllExperiments([]);
    setCurrentPage(1);
    setHasMore(true);
    refetch();
  };

  const handleCreateExperiment = () => {
    navigate("/create-experiment");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleStatusChange = (value: string | string[]) => {
    setStatusFilter(value as string[]);
  };

  const handleTagsChange = (value: string | string[]) => {
    setTagsFilter(value as string[]);
  };

  const handleRowClick = (experiment: Experiment) => {
    navigate(`/experiment/${experiment.experimentId}`, {
      state: {
        experimentId: experiment.experimentId,
        projectKey: experiment.projectKey,
        defaultTab: "results",
      },
    });
  };

  // IntersectionObserver ref for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);

  // Load more experiments when scrolling to the end
  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    setCurrentPage((prev) => prev + 1);
  }, [isFetching, hasMore]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [loadMore, isFetching, hasMore]);

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
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "35px",
          minHeight: "35px",
          flexShrink: 0,
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
          <AscendButton
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setIsCreateAudienceModalOpen(true)}
          >
            Audience
          </AscendButton>
        </Box>
      </Box>

      {/* Create Audience Modal - Step 1 */}
      <CreateAudienceModal
        open={isCreateAudienceModalOpen}
        onClose={() => setIsCreateAudienceModalOpen(false)}
        onSuccess={(audienceId) => {
          setCreatedAudienceId(audienceId);
          setShowAudienceSuccessSnackbar(true);
          setIsCsvModalOpen(true);
        }}
      />

      {/* Audience Created Success Snackbar */}
      <AscendSnackbar
        open={showAudienceSuccessSnackbar}
        message="Audience created successfully"
        severity="success"
        onClose={() => setShowAudienceSuccessSnackbar(false)}
      />

      {/* CSV Upload Modal - Step 2 */}
      <CsvUploadModal
        open={isCsvModalOpen}
        onClose={() => {
          setIsCsvModalOpen(false);
          setCreatedAudienceId(null);
        }}
        onUploadSuccess={() => {
          setShowCsvUploadSuccessSnackbar(true);
        }}
        audienceId={createdAudienceId ?? undefined}
      />

      {/* CSV Upload Success Snackbar */}
      <AscendSnackbar
        open={showCsvUploadSuccessSnackbar}
        message="CSV uploaded successfully"
        severity="success"
        onClose={() => setShowCsvUploadSuccessSnackbar(false)}
      />

      {/* Table */}
      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
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
        ) : isError || (allExperiments.length === 0 && !isFetching) ? (
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
              {isError
                ? "No experiments present"
                : hasFilters
                  ? "No experiments match your filters"
                  : "No experiments present"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {hasFilters && (
                <AscendButton variant="text" onClick={clearFilters}>
                  Clear Filters
                </AscendButton>
              )}
              <AscendButton variant="outlined" onClick={handleRefresh}>
                Refresh
              </AscendButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}>
              <TableVirtuoso
                style={{ height: "100%" }}
                data={allExperiments}
                components={tableComponents}
                fixedHeaderContent={TableHeader}
                itemContent={createRowContent(theme)}
                overscan={200}
              />
              {/* Sentinel element for IntersectionObserver */}
              <Box ref={observerRef} sx={{ height: 20, width: "100%" }} />
            </Box>
            {/* Loading indicator for infinite scroll */}
            {isFetching && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 1,
                  flexShrink: 0,
                }}
              >
                <CircularProgress size={20} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  Loading...
                </Typography>
              </Box>
            )}
            {/* No more data message */}
            {!hasMore && allExperiments.length > 0 && (
              <Box sx={{ py: 1, px: 1, flexShrink: 0, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No more experiments
                </Typography>
              </Box>
            )}
            {/* Show total count */}
            {pagination && (
              <Box sx={{ py: 1, px: 1, flexShrink: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {allExperiments.length} of {pagination.totalCount}{" "}
                  experiments
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
