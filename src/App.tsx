import { Routes, Route } from "react-router";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import CreateExperiment from "./pages/CreateExperiment";
import ExperimentDetails from "./pages/ExperimentDetails/ExperimentDetails";
import EditExperiment from "./pages/EditExperiment";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-experiment" element={<CreateExperiment />} />
        <Route path="/edit-experiment/:id" element={<EditExperiment />} />
        <Route path="/experiment/:id" element={<ExperimentDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;
