import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecipes } from '@/context/RecipeContext';
import { User, Mail, Clock, BookOpen, Award, Calendar } from 'lucide-react';

export default function Perfil() {
  const { recipes } = useRecipes();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    joinDate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      const userName = localStorage.getItem('userName');
      if (userName) {
        setUserInfo({
          name: userName,
          email: `${userName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          joinDate: new Date().toLocaleDateString('pt-BR')
        });
      }
      setLoading(false);
    }, 800);
  }, []);

  const userRecipes = recipes.length;
  const totalCookingTime = recipes.reduce((total, recipe) => total + recipe.prepTime, 0);
  const favoriteCategory = recipes.length > 0 
    ? recipes.reduce((acc, recipe) => {
        acc[recipe.category] = (acc[recipe.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  
  const mostUsedCategory = Object.keys(favoriteCategory).length > 0 
    ? Object.keys(favoriteCategory).reduce((a, b) => favoriteCategory[a] > favoriteCategory[b] ? a : b)
    : 'Nenhuma';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-culinary-salmon-500 animate-pulse" />
          <p className="text-xl">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            Faça login para visualizar seu perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-culinary-salmon-500 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-black dark:text-white" />
          </div>
          <h1 className="text-4xl font-bold font-poppins mb-2 text-culinary-red-600">
            Meu Perfil
          </h1>
          <p className="text-xl text-muted-foreground">
            Suas informações e estatísticas culinárias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <Card className="lg:col-span-2 glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-culinary-red-500" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <User className="h-5 w-5 text-culinary-red-500" />
                <div>
                  <p className="font-medium">Nome</p>
                  <p className="text-muted-foreground">{userInfo.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <Mail className="h-5 w-5 text-culinary-cream-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{userInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <Calendar className="h-5 w-5 text-culinary-brown-600" />
                <div>
                  <p className="font-medium">Membro desde</p>
                  <p className="text-muted-foreground">{userInfo.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Card */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-culinary-red-500" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userRecipes >= 1 && (
                <Badge className="w-full justify-center py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  🏆 Primeira Receita
                </Badge>
              )}
              {userRecipes >= 5 && (
                <Badge className="w-full justify-center py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  👨‍🍳 Chef Iniciante
                </Badge>
              )}
              {userRecipes >= 10 && (
                <Badge className="w-full justify-center py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  🌟 Cozinheiro Expert
                </Badge>
              )}
              {userRecipes === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Crie sua primeira receita para desbloquear conquistas!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-culinary-red-500" />
              <div className="text-3xl font-bold text-culinary-red-600 mb-1">
                {userRecipes}
              </div>
              <p className="text-sm text-muted-foreground">Receitas Criadas</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 mx-auto mb-3 text-culinary-cream-600" />
              <div className="text-3xl font-bold text-culinary-cream-600 mb-1">
                {totalCookingTime}
              </div>
              <p className="text-sm text-muted-foreground">Minutos Cozinhando</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 mx-auto mb-3 text-culinary-brown-600" />
              <div className="text-lg font-bold text-culinary-brown-600 mb-1">
                {mostUsedCategory}
              </div>
              <p className="text-sm text-muted-foreground">Categoria Favorita</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <User className="h-8 w-8 mx-auto mb-3 text-culinary-red-500" />
              <div className="text-3xl font-bold text-culinary-red-600 mb-1">
                1
              </div>
              <p className="text-sm text-muted-foreground">Chef Level</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Recipes */}
        {userRecipes > 0 && (
          <Card className="mt-8 glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Minhas Receitas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipes.slice(0, 3).map((recipe) => (
                  <div key={recipe.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    {recipe.imageUrl && (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{recipe.title}</p>
                      <p className="text-sm text-muted-foreground">{recipe.category}</p>
                    </div>
                    <Badge variant="outline">{recipe.difficulty}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
