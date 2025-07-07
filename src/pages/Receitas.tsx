
import React, { useState, useEffect } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeModal } from '@/components/RecipeModal';
import { Search, Clock, ChefHat, Eye } from 'lucide-react';
import { Recipe } from '@/types/Recipe';

export default function Receitas() {
  const { recipes, loading } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-culinary-red-500 animate-pulse" />
          <p className="text-xl">Carregando receitas deliciosas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-culinary-cream-50 to-culinary-brown-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-poppins mb-4 text-culinary-red-600">
            Nossas Receitas
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Explore nossa coleção de receitas cuidadosamente selecionadas
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar receitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            {recipes.length === 0 ? (
              <div>
                <p className="text-xl text-muted-foreground mb-4">
                  Nenhuma receita encontrada
                </p>
                <p className="text-muted-foreground">
                  Crie sua primeira receita na aba "Nova Receita"
                </p>
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">
                Nenhuma receita encontrada para "{searchTerm}"
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="glass-card hover-lift border-0 shadow-lg overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-poppins group-hover:text-culinary-red-600 transition-colors">
                    {recipe.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.prepTime} min
                    </div>
                    <Badge variant="outline">{recipe.category}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredientes:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe.ingredients.slice(0, 3).join(', ')}
                      {recipe.ingredients.length > 3 && '...'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Preparo:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {recipe.instructions}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => handleViewRecipe(recipe)}
                    className="w-full culinary-gradient text-white hover:opacity-90"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Receita Completa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <RecipeModal 
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
