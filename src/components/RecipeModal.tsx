
import React from 'react';
import { Recipe } from '@/types/Recipe';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Difícil': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins text-culinary-red-600">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className={getDifficultyColor(recipe.difficulty)}>
                {recipe.difficulty}
              </Badge>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-culinary-red-500" />
              <span>{recipe.prepTime} minutos</span>
            </div>
            <Badge variant="outline" className="text-culinary-red-600 border-culinary-red-200">
              {recipe.category}
            </Badge>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-culinary-red-600">
              Ingredientes
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-culinary-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-culinary-red-600">
              Modo de Preparo
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {recipe.instructions}
              </p>
            </div>
          </div>

          {/* Creation Date */}
          <div className="text-sm text-muted-foreground border-t pt-4">
            Criada em: {recipe.createdAt.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
