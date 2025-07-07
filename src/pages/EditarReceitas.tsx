
import React, { useState } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X, Trash2, Clock, ChefHat, Upload } from 'lucide-react';
import { Recipe } from '@/types/Recipe';

interface EditingData {
  title?: string;
  ingredients?: string;
  instructions?: string;
  imageUrl?: string;
  prepTime?: number;
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
  category?: string;
}

export default function EditarReceitas() {
  const { recipes, updateRecipe, deleteRecipe, loading } = useRecipes();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingData>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setEditingData({
      ...recipe,
      ingredients: recipe.ingredients.join('\n')
    });
    setImagePreview(recipe.imageUrl);
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setEditingData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setEditingData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSave = () => {
    if (!editingId || !editingData.title || !editingData.instructions || !editingData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const ingredientsArray = editingData.ingredients 
      ? editingData.ingredients.split('\n').filter(ingredient => ingredient.trim())
      : [];

    updateRecipe(editingId, {
      title: editingData.title,
      ingredients: ingredientsArray,
      instructions: editingData.instructions,
      imageUrl: editingData.imageUrl || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop',
      prepTime: editingData.prepTime || 30,
      difficulty: editingData.difficulty || 'Médio',
      category: editingData.category
    });

    toast({
      title: "Sucesso!",
      description: "Receita atualizada com sucesso!",
    });

    setEditingId(null);
    setEditingData({});
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a receita "${title}"?`)) {
      deleteRecipe(id);
      toast({
        title: "Receita excluída",
        description: "A receita foi removida com sucesso.",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-culinary-salmon-500 animate-pulse" />
          <p className="text-xl">Carregando receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-culinary-cream-50 to-culinary-brown-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-poppins mb-4 text-culinary-red-600">
            Editar Receitas
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerencie suas receitas favoritas
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              Nenhuma receita encontrada
            </p>
            <p className="text-muted-foreground">
              Crie sua primeira receita na aba "Nova Receita"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="glass-card border-0 shadow-lg">
                {editingId === recipe.id ? (
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={editingData.title || ''}
                          onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Select 
                            value={editingData.category || ''} 
                            onValueChange={(value) => setEditingData(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sobremesas">Sobremesas</SelectItem>
                              <SelectItem value="Pratos Principais">Pratos Principais</SelectItem>
                              <SelectItem value="Saladas">Saladas</SelectItem>
                              <SelectItem value="Aperitivos">Aperitivos</SelectItem>
                              <SelectItem value="Bebidas">Bebidas</SelectItem>
                              <SelectItem value="Café da Manhã">Café da Manhã</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="difficulty">Dificuldade</Label>
                          <Select 
                            value={editingData.difficulty || ''} 
                            onValueChange={(value: any) => setEditingData(prev => ({ ...prev, difficulty: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fácil">Fácil</SelectItem>
                              <SelectItem value="Médio">Médio</SelectItem>
                              <SelectItem value="Difícil">Difícil</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="prepTime">Tempo (min)</Label>
                          <Input
                            id="prepTime"
                            type="number"
                            value={editingData.prepTime || ''}
                            onChange={(e) => setEditingData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 30 }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="image">Imagem da Receita (opcional)</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('image')?.click()}
                                className="flex-1"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {selectedImage ? 'Trocar Imagem' : 'Selecionar Imagem'}
                              </Button>
                              {(selectedImage || imagePreview) && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={removeImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {imagePreview && (
                              <div className="mt-2">
                                <img
                                  src={imagePreview}
                                  alt="Preview da receita"
                                  className="w-full h-32 object-cover rounded-md border"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="ingredients">Ingredientes</Label>
                        <Textarea
                          id="ingredients"
                          rows={4}
                          value={editingData.ingredients || ''}
                          onChange={(e) => setEditingData(prev => ({ ...prev, ingredients: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="instructions">Modo de Preparo</Label>
                        <Textarea
                          id="instructions"
                          rows={4}
                          value={editingData.instructions || ''}
                          onChange={(e) => setEditingData(prev => ({ ...prev, instructions: e.target.value }))}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSave} className="flex-1 bg-culinary-salmon-500 hover:bg-culinary-salmon-600 text-white">
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="flex-1">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
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
                    
                    <CardHeader>
                      <CardTitle className="text-xl font-poppins">
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
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(recipe)} 
                          variant="outline" 
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          onClick={() => handleDelete(recipe.id, recipe.title)} 
                          variant="destructive" 
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
