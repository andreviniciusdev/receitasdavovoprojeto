
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, User, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu nome.",
        variant: "destructive",
      });
      return;
    }

    setIsLogging(true);
    
    // Simulate login process
    setTimeout(() => {
      localStorage.setItem('userName', userName.trim());
      
      toast({
        title: "Bem-vindo!",
        description: `Olá, ${userName}! Login realizado com sucesso.`,
      });
      
      navigate('/');
      setIsLogging(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-culinary-cream-50 to-culinary-brown-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="animate-float mb-6">
            <ChefHat className="h-16 w-16 mx-auto text-culinary-salmon-500" />
          </div>
          <h1 className="text-4xl font-bold font-poppins mb-2 text-culinary-salmon-600">
            Receitas da Vovó
          </h1>
          <p className="text-muted-foreground">
            Entre para descobrir receitas incríveis
          </p>
        </div>

        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <LogIn className="h-6 w-6 text-culinary-salmon-500" />
              Fazer Login
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-culinary-salmon-500" />
                  Nome de Usuário
                </Label>
                <Input
                  id="userName"
                  placeholder="Digite seu nome..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Seu email será gerado automaticamente como: {userName.toLowerCase().replace(/\s+/g, '')}@gmail.com
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLogging}
                className="w-full h-12 bg-culinary-salmon-500 hover:bg-culinary-salmon-600 text-white"
              >
                {isLogging ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-culinary-cream-50">
              <h3 className="font-semibold mb-2 text-culinary-brown-800">
                💡 Dica:
              </h3>
              <p className="text-sm text-culinary-brown-700">
                Digite qualquer nome para acessar o aplicativo. Suas informações serão salvas localmente para uma experiência personalizada.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Ao entrar, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
    </div>
  );
}
