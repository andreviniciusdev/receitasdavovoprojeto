
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RecipeProvider } from "@/context/RecipeContext";
import { Header } from "@/components/Header";
import Home from "./pages/Home";
import Receitas from "./pages/Receitas";
import NovaReceita from "./pages/NovaReceita";
import EditarReceitas from "./pages/EditarReceitas";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <RecipeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/receitas" element={<Receitas />} />
                <Route path="/nova" element={<NovaReceita />} />
                <Route path="/editar" element={<EditarReceitas />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </RecipeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
