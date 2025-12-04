import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AscendTextField from "../AscendTextField/AscendTextField";
import AscendButton from "../AscendButton/AscendButton";
import AscendSnackbar from "../AscendSnackbar/AscendSnackbar";
import { useCreateAudience } from "../../network";

interface CreateAudienceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (audienceId: number) => void;
}

export default function CreateAudienceModal({
  open,
  onClose,
  onSuccess,
}: CreateAudienceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [expiryDateError, setExpiryDateError] = useState<string | null>(null);

  const createMutation = useCreateAudience();

  const handleClose = () => {
    setName("");
    setDescription("");
    setExpiryDate("");
    setError(null);
    setNameError(null);
    setExpiryDateError(null);
    createMutation.reset();
    onClose();
  };

  const handleCreate = () => {
    // Reset field errors
    setNameError(null);
    setExpiryDateError(null);
    setError(null);

    // Validate fields
    let hasError = false;

    if (!name.trim()) {
      setNameError("This field is required");
      hasError = true;
    }

    if (!expiryDate) {
      setExpiryDateError("This field is required");
      hasError = true;
    }

    if (hasError) return;

    // Convert date to Unix timestamp (seconds)
    const expireTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

    createMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        type: "STATIC", // Hardcoded as per requirement
        expireDate: expireTimestamp,
        sinkIds: [1], // Hardcoded as per requirement
      },
      {
        onSuccess: (response) => {
          console.log("Audience created successfully:", response);
          const audienceId = response.data; // Response is just the ID number
          handleClose();
          onSuccess(audienceId);
        },
        onError: (err) => {
          console.error("Failed to create audience:", err);
          setError(err.message || "Failed to create audience");
        },
      },
    );
  };

  // Get minimum date (today) for the date picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
        }}
      >
        Create Audience
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 2,
          }}
        >
          <AscendTextField
            label="Name"
            required
            placeholder="Enter audience name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            error={!!nameError}
            helperText={nameError}
          />

          <AscendTextField
            label="Description"
            placeholder="Enter audience description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            height="80px"
          />

          <AscendTextField
            label="Expiry Date"
            required
            type="date"
            value={expiryDate}
            onChange={(e) => {
              setExpiryDate(e.target.value);
              setExpiryDateError(null);
            }}
            error={!!expiryDateError}
            helperText={expiryDateError}
            InputProps={{
              inputProps: { min: today },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AscendButton
          variant="text"
          onClick={handleClose}
          disabled={createMutation.isPending}
        >
          Cancel
        </AscendButton>
        <AscendButton
          variant="contained"
          onClick={handleCreate}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create & Upload CSV"}
        </AscendButton>
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
