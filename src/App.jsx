import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import About from "./pages/About";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
