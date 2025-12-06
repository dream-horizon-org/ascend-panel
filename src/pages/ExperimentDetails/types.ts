// Header Types
export type StatusBadgeProps = {
  label: string;
  color?: "active" | "inactive" | "draft";
};

export type ExperimentDetailsHeaderProps = {
  title: string;
  status?: StatusBadgeProps;
  experimentId?: string;
  experimentStatus?: string; // Raw status string (e.g., "TERMINATED", "CONCLUDED", "LIVE", "PAUSED")
  variants?: Record<string, { display_name: string; variables: any[] }>; // Variants from experiment
  onBack?: () => void;
  onCopyId?: () => void;
  onMenuClick?: () => void;
  onConcludeClick?: () => void;
  onCloneExperiment?: () => void;
  onTerminateExperiment?: () => void;
  onDeclareWinner?: (variantKey: string) => void;
  onPauseExperiment?: () => void;
  onRestartExperiment?: () => void;
  className?: string;
};

// Chart Types
export type ChartDataPoint = {
  date: string;
  control: number;
  variant1: number;
};

// Variant Types
export type Variant = {
  name: string;
  color: string;
  percentage: number;
  userCount: number | "NA";
};
