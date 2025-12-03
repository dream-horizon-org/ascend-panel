import EditExperimentForm from "../../EditExperiment/components/EditExperimentForm";

interface SetupTabProps {
  experimentId: string;
}

const SetupTab = ({ experimentId }: SetupTabProps) => {
  return <EditExperimentForm experimentId={experimentId} />;
};

export default SetupTab;
