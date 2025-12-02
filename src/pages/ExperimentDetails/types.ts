// Header Types
export type StatusBadgeProps = {
  label: string;
  color?: "active" | "inactive" | "draft";
};

export type ExperimentDetailsHeaderProps = {
  title: string;
  status?: StatusBadgeProps;
  experimentId?: string;
  onBack?: () => void;
  onCopyId?: () => void;
  onMenuClick?: () => void;
  onConcludeClick?: () => void;
  onCloneExperiment?: () => void;
  onTerminateExperiment?: () => void;
  onDeclareWinner?: (winner: "Control Group" | "Variant 1") => void;
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
