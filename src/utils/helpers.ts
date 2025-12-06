import { Variant } from "../pages/ExperimentDetails/types";

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return "N/A";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toString();
};

export const calculateDays = (startTime?: number, endTime?: number): number => {
  if (!startTime) return 0;
  try {
    const start = startTime; // Convert to milliseconds
    const end = endTime ? endTime : Date.now();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export const mapStatus = (
  status: string,
): { label: string; color: "active" | "inactive" | "draft" } => {
  const statusMap: Record<
    string,
    { label: string; color: "active" | "inactive" | "draft" }
  > = {
    LIVE: { label: "Active", color: "active" },
    DRAFT: { label: "Draft", color: "draft" },
    PAUSED: { label: "Paused", color: "inactive" },
    CONCLUDED: { label: "Concluded", color: "inactive" },
    TERMINATED: { label: "Terminated", color: "inactive" },
  };
  return statusMap[status] || { label: status, color: "draft" };
};

export const convertVariantsToDisplay = (
  variants: Record<string, any>,
  variantWeights: any,
  variantCounts?: Record<string, number>,
): Variant[] => {
  const variantArray: Variant[] = [];
  const colors = ["#1976d2", "#d32f2f", "#388e3c", "#f57c00", "#7b1fa2"];
  let colorIndex = 0;

  Object.entries(variants).forEach(([key, variant]) => {
    const weight = variantWeights?.weights?.[key] || 0;
    const percentage = Math.round(weight);
    // Use variant_counts if available and key exists, otherwise show NA
    let userCount: number | "NA";
    if (variantCounts && key in variantCounts) {
      userCount = variantCounts[key];
    } else {
      // variantCounts doesn't exist or key is not present
      userCount = "NA";
    }

    variantArray.push({
      name: variant.display_name || key,
      color: colors[colorIndex % colors.length],
      percentage,
      userCount,
    });
    colorIndex++;
  });

  return variantArray;
};
