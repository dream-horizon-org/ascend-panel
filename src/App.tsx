import { Routes, Route } from "react-router";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import CreateExperiment from "./pages/CreateExperiment";
import EditExperiment from "./pages/EditExperiment";
import Settings from "./pages/Settings";
import ExperimentOverview from "./pages/ExperimentOverview";
import IframePage from "./pages/IframePage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-experiment" element={<CreateExperiment />} />
        <Route path="/edit-experiment/:id" element={<EditExperiment />} />
        <Route path="/experiment/:id" element={<ExperimentOverview />} />
        <Route path="/audience" element={<IframePage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
