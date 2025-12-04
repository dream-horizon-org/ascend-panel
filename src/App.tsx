import { Routes, Route } from "react-router";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import CreateExperiment from "./pages/CreateExperiment";
import EditExperiment from "./pages/EditExperiment";
import Settings from "./pages/Settings";
import ExperimentOverview from "./pages/ExperimentOverview";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-experiment" element={<CreateExperiment />} />
        <Route path="/edit-experiment/:id" element={<EditExperiment />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/experiment/:id" element={<ExperimentOverview />} />
      </Routes>
    </Layout>
  );
}

export default App;
