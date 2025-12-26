import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ProjectSummary } from "../network/tenantManagement/mockApi";
import { STORAGE_KEYS } from "../utils/contants";

interface ProjectContextType {
  selectedProject: ProjectSummary | null; // Can be null initially, but will always have a value once projects load
  setSelectedProject: (project: ProjectSummary) => void; // Never accepts null - project must always be selected
  projects: ProjectSummary[];
  setProjects: (projects: ProjectSummary[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProjectState] =
    useState<ProjectSummary | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  // Restore selected project from localStorage when projects are loaded
  // localStorage is the source of truth - only stores project_key
  useEffect(() => {
    if (projects.length > 0) {
      const storedProjectKey = localStorage.getItem(STORAGE_KEYS.PROJECT_KEY);
      
      let projectToSelect: ProjectSummary | undefined;
      
      // Restore from localStorage using project_key (source of truth)
      if (storedProjectKey) {
        projectToSelect = projects.find(
          (p) => p.project_key === storedProjectKey
        );
      }
      
      // If stored project doesn't exist in current projects list, use first available
      if (!projectToSelect) {
        projectToSelect = projects[0];
        // Update localStorage to reflect the actual selected project
        if (projectToSelect) {
          localStorage.setItem(STORAGE_KEYS.PROJECT_KEY, projectToSelect.project_key);
        }
      }
      
      // Always ensure a project is selected (never null once projects are loaded)
      if (projectToSelect) {
        // Only update if it's different from current selection
        if (!selectedProject || selectedProject.project_key !== projectToSelect.project_key) {
          setSelectedProjectState(projectToSelect);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // Save selected project key to localStorage
  // localStorage is always kept in sync - it's the source of truth
  // Only stores project_key (not project_id)
  const setSelectedProject = (project: ProjectSummary) => {
    // Update state
    setSelectedProjectState(project);

    // Always update localStorage immediately (source of truth)
    // Only store project_key - it's the only identifier we need
    localStorage.setItem(STORAGE_KEYS.PROJECT_KEY, project.project_key);
  };

  return (
    <ProjectContext.Provider
      value={{ selectedProject, setSelectedProject, projects, setProjects }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
