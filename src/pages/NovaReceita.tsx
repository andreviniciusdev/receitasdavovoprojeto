
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RecipeFormData } from '@/types/Recipe';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Upload, X } from 'lucide-react';

export default function NovaReceita() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    ingredients: '',
    instructions: '',
    imageUrl: '',
    prepTime: 30,
    difficulty: 'Médio',
    category: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (field: keyof RecipeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.ingredients || !formData.instructions || !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const recipe = {
        ...formData,
        ingredients: formData.ingredients.split('\n').filter(ingredient => ingredient.trim()),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop'
      };
      
      addRecipe(recipe);
      
      toast({
        title: "Sucesso!",
        description: "Receita criada com sucesso!",
      });
      
      navigate('/receitas');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-culinary-cream-50 to-culinary-brown-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-poppins mb-4 text-culinary-red-600">
            Criar Nova Receita
          </h1>
          <p className="text-xl text-muted-foreground">
            Compartilhe sua criação culinária com o mundo
          </p>
        </div>

        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-culinary-red-500" />
              Informações da Receita
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Receita *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Bolo de Chocolate Cremoso"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                  <Select value={formData.difficulty} onValueChange={(value: any) => handleInputChange('difficulty', value)}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Tempo de Preparo (minutos)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="1"
                    value={formData.prepTime}
                    onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value) || 30)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredientes *</Label>
                <Textarea
                  id="ingredients"
                  placeholder="Digite cada ingrediente em uma linha:&#10;2 xícaras de farinha de trigo&#10;1 xícara de açúcar&#10;3 ovos"
                  rows={6}
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange('ingredients', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Modo de Preparo *</Label>
                <Textarea
                  id="instructions"
                  placeholder="Descreva detalhadamente o modo de preparo da receita..."
                  rows={6}
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/receitas')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 culinary-gradient text-white hover:opacity-90"
                >
                  {isSubmitting ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Receita
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
