import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Rota não encontrada:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md bg-card p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Opa! Receita não encontrada</h2>
        <p className="text-muted-foreground mb-6">Parece que essa receita ainda não está no nosso caderno de receitas!</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-full transition-colors duration-200"
        >
          Voltar para a Página Inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;
