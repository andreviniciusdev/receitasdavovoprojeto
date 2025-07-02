
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe } from '@/types/Recipe';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  updateRecipe: (id: string, recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  deleteRecipe: (id: string) => void;
  loading: boolean;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      setRecipes([]); // Start with empty array - users create their own recipes
      setLoading(false);
    }, 1000);
  }, []);

  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const updateRecipe = (id: string, recipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id 
        ? { ...recipeData, id, createdAt: recipe.createdAt }
        : recipe
    ));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe, loading }}>
      {children}
    </RecipeContext.Provider>
  );
}
