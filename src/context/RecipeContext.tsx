
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

// Key para armazenar no localStorage
const RECIPES_STORAGE_KEY = 'culinary_recipes';

// Função para carregar receitas do localStorage
const loadRecipesFromStorage = (): Recipe[] => {
  try {
    const stored = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (stored) {
      const recipes = JSON.parse(stored);
      // Converter strings de data de volta para objetos Date
      return recipes.map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt)
      }));
    }
  } catch (error) {
    console.error('Erro ao carregar receitas do localStorage:', error);
  }
  return [];
};

// Função para salvar receitas no localStorage
const saveRecipesToStorage = (recipes: Recipe[]) => {
  try {
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Erro ao salvar receitas no localStorage:', error);
  }
};

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar receitas do localStorage na inicialização
    const storedRecipes = loadRecipesFromStorage();
    setRecipes(storedRecipes);
    setLoading(false);
  }, []);

  // Salvar no localStorage sempre que as receitas mudarem
  useEffect(() => {
    if (!loading) {
      saveRecipesToStorage(recipes);
    }
  }, [recipes, loading]);

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
