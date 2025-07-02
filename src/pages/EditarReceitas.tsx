import React, { useState, useEffect } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Recipe } from '@/types/Recipe';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, Trash2, Upload, X } from 'lucide-react';

export default function EditarReceitas() {
  const { recipes, loading, editRecipe, deleteRecipe } = useRecipes();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  const handleOpenModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
    setEditedRecipe({ ...recipe });
    setIsEditing(false);
    setImagePreview(recipe.imageUrl || '');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    setIsEditing(false);
    setEditedRecipe(null);
    setImagePreview('');
    setSelectedImage(null);
  };

  const handleEditRecipe = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field: keyof Recipe, value: string | number | string[]) => {
    if (editedRecipe) {
      setEditedRecipe(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editedRecipe) {
      const ingredients = e.target.value.split('\n');
      setEditedRecipe(prev => ({ ...prev, ingredients: ingredients }));
    }
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
        if (editedRecipe) {
          setEditedRecipe(prev => ({ ...prev, imageUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (editedRecipe) {
      setEditedRecipe(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSaveRecipe = () => {
    if (editedRecipe) {
      editRecipe(editedRecipe);
      toast({
        title: "Sucesso!",
        description: "Receita atualizada com sucesso!",
      });
      handleCloseModal();
    }
  };

  const handleDeleteRecipe = () => {
    if (selectedRecipe) {
      deleteRecipe(selectedRecipe.id);
      toast({
        title: "Sucesso!",
        description: "Receita deletada com sucesso!",
      });
      handleCloseModal();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando receitas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-culinary-cream-50 to-culinary-brown-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-poppins mb-4 text-culinary-red-600">
            Editar Receitas
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerencie e atualize suas receitas favoritas
          </p>

          <div className="relative max-w-md mx-auto mt-6">
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
            <p className="text-xl text-muted-foreground">
              Nenhuma receita encontrada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="glass-card hover-lift border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>{recipe.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleOpenModal(recipe)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && (
          <div className={`fixed inset-0 z-50 overflow-auto bg-black/50 ${isModalOpen ? 'block' : 'hidden'}`}>
            <div className="container mx-auto mt-10 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {isEditing ? 'Editando Receita' : selectedRecipe.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing && editedRecipe ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título da Receita</Label>
                        <Input
                          id="title"
                          value={editedRecipe.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={editedRecipe.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
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

                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Dificuldade</Label>
                        <Select value={editedRecipe.difficulty} onValueChange={(value: any) => handleInputChange('difficulty', value)}>
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

                      <div className="space-y-2">
                        <Label htmlFor="prepTime">Tempo de Preparo (minutos)</Label>
                        <Input
                          id="prepTime"
                          type="number"
                          value={editedRecipe.prepTime}
                          onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
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
                            {selectedImage && (
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

                      <div className="space-y-2">
                        <Label htmlFor="ingredients">Ingredientes</Label>
                        <Textarea
                          id="ingredients"
                          value={editedRecipe.ingredients.join('\n')}
                          onChange={handleIngredientChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Instruções</Label>
                        <Textarea
                          id="instructions"
                          value={editedRecipe.instructions}
                          onChange={(e) => handleInputChange('instructions', e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleCloseModal}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveRecipe}>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">Ingredientes:</p>
                        <ul className="list-disc pl-5">
                          {selectedRecipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">Instruções:</p>
                        <p>{selectedRecipe.instructions}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleEditRecipe}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteRecipe}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </Button>
                        <Button variant="ghost" onClick={handleCloseModal}>
                          Fechar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
