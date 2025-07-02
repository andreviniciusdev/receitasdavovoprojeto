
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  prepTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  createdAt: Date;
}

export interface RecipeFormData {
  title: string;
  ingredients: string;
  instructions: string;
  imageUrl: string;
  prepTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
}
