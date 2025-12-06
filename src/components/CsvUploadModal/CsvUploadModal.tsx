import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import AscendSnackbar from "../AscendSnackbar/AscendSnackbar";
import { useImportCohort } from "../../network";

interface CsvUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
  audienceId?: string | number;
}

export default function CsvUploadModal({
  open,
  onClose,
  onUploadSuccess,
  audienceId,
}: CsvUploadModalProps) {
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportCohort();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a CSV file");
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!audienceId) {
      setError("No audience ID provided. Please create an audience first.");
      return;
    }

    importMutation.mutate(
      {
        audienceId,
        data: {
          file,
          fileName: file.name,
        },
      },
      {
        onSuccess: () => {
          console.log("Upload successful");
          handleClose();
          onUploadSuccess?.();
        },
        onError: (err) => {
          console.error("Upload error:", err);
          setError(err.message || "Failed to upload file");
        },
      },
    );
  };

  const handleClose = () => {
    setFile(null);
    setIsDragOver(false);
    setError(null);
    importMutation.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Upload CSV
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Audience ID Display */}
        {audienceId && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              p: 1.5,
              backgroundColor: theme.palette.action.hover,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Audience ID:
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {audienceId}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Drop Zone */}
          <Box
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              width: "100%",
              minHeight: 200,
              border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: isDragOver
                ? theme.palette.primary.light + "20"
                : theme.palette.background.default,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light + "10",
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileSelect}
            />

            {!file ? (
              <>
                <CloudUploadIcon
                  sx={{
                    fontSize: 64,
                    color: isDragOver
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.primary, mb: 1 }}
                >
                  Drag & drop your CSV file here
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, mb: 2 }}
                >
                  or click to browse
                </Typography>
                <Button variant="outlined" size="small">
                  Browse Files
                </Button>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <InsertDriveFileIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  Remove
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={importMutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!file || importMutation.isPending}
          onClick={handleUpload}
        >
          {importMutation.isPending ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>

      {/* Error Snackbar */}
      <AscendSnackbar
        open={!!error}
        message={error || ""}
        severity="error"
        onClose={() => setError(null)}
      />
    </Dialog>
  );
}
