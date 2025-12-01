import React, { useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import AscendSearchbar from "../../components/AscendSearchbar/AscendSearchbar";
import AscendButton from "../../components/AscendButton/AscendButton";
import AscendDropdown from "../../components/AscendDropdown/AscendDropdown";
import AscendMenu from "../../components/AscendMenu/AscendMenu";
import AscendMenuItem from "../../components/AscendMenuItem/AscendMenuItem";
import experimentsDataJson from "../../data/experiments.json";

interface ExperimentData {
  experimentId: string;
  name: string;
  status: string;
  tags: string[];
  updatedAt: string;
}

interface ColumnData {
  dataKey: keyof ExperimentData | "actions";
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

const STATUS_OPTIONS = [ "LIVE", "PAUSED", "DRAFT", "CONCLUDED", "TERMINATED" ];
const TAG_OPTIONS = ["ML", "A/B Test", "Mobile", "High Priority", "Marketing", "UX", "Backend", "Frontend", "Analytics"];

const experiments = (experimentsDataJson as any).data.experiments as ExperimentData[];

const createTableComponents = (theme: any): TableComponents<ExperimentData> => ({
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer 
      component={Paper} 
      {...props} 
      ref={ref} 
      sx={{
        borderRadius: "8px", 
        overflow: "hidden",
        border: `1px solid ${theme.palette.border.main}`
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
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
});

const RowActionsMenu: React.FC<{ row: ExperimentData }> = ({ row }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);
  
  const handleAction = (action: string) => () => {
    console.log(`${action} experiment: ${row.experimentId}`);
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreHorizIcon />
      </IconButton>
      <AscendMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { boxShadow: theme.customComponents.actions.shadow } }}
      >
        <AscendMenuItem onClick={handleAction("Clone")} sx={{ fontSize: "12px", fontWeight: 600 }}>
          Clone
        </AscendMenuItem>
        <AscendMenuItem onClick={handleAction("Terminate")} sx={{ fontSize: "12px", fontWeight: 600 }}>
          Terminate
        </AscendMenuItem>
        <AscendMenuItem
          onClick={handleAction("Delete")}
          sx={{ fontSize: "12px", fontWeight: 600, color: theme.customComponents.actions.delete }}
        >
          Delete
        </AscendMenuItem>
      </AscendMenu>
    </>
  );
};

const CellWithTooltip: React.FC<{ text: string; width: string }> = ({ text, width }) => {
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
      <Tooltip title={text} placement="top" arrow disableHoverListener={!isOverflowing}>
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

const StatusChip: React.FC<{ status: string; theme: any }> = ({ status, theme }) => {
  const statusKey = status.toLowerCase() as keyof typeof theme.customComponents.status;
  const config = theme.customComponents.status[statusKey] || theme.customComponents.status.draft;

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

const TagsCell: React.FC<{ tags: string[]; theme: any }> = ({ tags, theme }) => {
  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <Box sx={{ 
      display: "flex", 
      gap: 0.5, 
      alignItems: "center",
      overflow: "hidden",
      maxWidth: "100%",
      flexWrap: "nowrap"
    }}>
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
              textOverflow: "ellipsis"
            },
          }}
        />
      ))}
      {remainingCount > 0 && (
        <Typography sx={{ 
          fontSize: "18px", 
          fontWeight: 500, 
          color: theme.palette.primary.main,
          flexShrink: 0,
          whiteSpace: "nowrap"
        }}>
          +{remainingCount}
        </Typography>
      )}
    </Box>
  );
};

const TableHeader = () => (
  <TableRow>
    {COLUMNS.map((column) => (
      <TableCell key={column.dataKey} variant="head" sx={{ width: column.width, backgroundColor: "background.default", fontWeight: 600 }}>
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

const createRowContent = (theme: any) => (_index: number, row: ExperimentData) => (
  <React.Fragment>
    {COLUMNS.map((column) => {
      if (column.dataKey === "experimentId") return <CellWithTooltip key={column.dataKey} text={row.experimentId} width={column.width} />;
      if (column.dataKey === "name") return <CellWithTooltip key={column.dataKey} text={row.name} width={column.width} />;
      if (column.dataKey === "status") {
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width }}>
            <StatusChip status={row.status} theme={theme} />
          </TableCell>
        );
      }
      if (column.dataKey === "tags") {
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width, overflow: "hidden" }}>
            <TagsCell tags={row.tags} theme={theme} />
          </TableCell>
        );
      }
      if (column.dataKey === "actions") {
        return (
          <TableCell key={column.dataKey} align="center" sx={{ width: column.width }}>
            <RowActionsMenu row={row} />
          </TableCell>
        );
      }
      if (column.dataKey === "updatedAt") {
        const formattedDate = new Date(row.updatedAt).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width }}>
            {formattedDate}
          </TableCell>
        );
      }
      return (
        <TableCell key={column.dataKey} sx={{ width: column.width }}>
          {row[column.dataKey as keyof ExperimentData]}
        </TableCell>
      );
    })}
  </React.Fragment>
);

const Home: React.FC = () => {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);

  const hasFilters = statusFilter.length > 0 || tagsFilter.length > 0;
  const clearFilters = () => {
    setStatusFilter([]);
    setTagsFilter([]);
  };

  return (
    <Box sx={{ padding: "24px", gap: "24px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ height: "35px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left: Title and Search */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>Experiments</Typography>
          <AscendSearchbar size="small" variant="standard"
          placeholder="Search experiments..." />
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
            onChange={(value) => setStatusFilter(value as string[])}
            showCount
          />
          <AscendDropdown
            variant="multi-checkbox"
            size="md"
            borderRadius="lg"
            label="Tags"
            placeholder="Select tags"
            options={TAG_OPTIONS}
            value={tagsFilter}
            onChange={(value) => setTagsFilter(value as string[])}
            showCount
          />
          <AscendButton startIcon={<AddIcon />} size="small">
            Experiment
          </AscendButton>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ flexGrow: 1, height: "calc(100vh - 200px)" }}>
        <TableVirtuoso
          data={experiments}
          components={createTableComponents(theme)}
          fixedHeaderContent={TableHeader}
          itemContent={createRowContent(theme)}
        />
      </Box>
    </Box>
  );
};

export default Home;
