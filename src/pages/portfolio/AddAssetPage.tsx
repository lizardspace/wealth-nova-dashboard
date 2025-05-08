import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const AddAssetPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Actif ajouté avec succès',
      description: 'Votre nouvel actif a été ajouté à votre portefeuille.',
    });
    navigate('/portfolio');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Ajouter un actif</h1>
        <p className="text-muted-foreground mt-1">
          Enrichissez votre portefeuille avec un nouvel investissement
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Nouveau actif</CardTitle>
          <CardDescription>Renseignez les informations de votre actif</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial">
            <TabsList className="mb-6">
              <TabsTrigger value="financial">Financier</TabsTrigger>
              <TabsTrigger value="property">Immobilier</TabsTrigger>
              <TabsTrigger value="other">Autre</TabsTrigger>
            </TabsList>
            <TabsContent value="financial">
              <form onSubmit={handleAddAsset} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset-name">Nom de l'actif</Label>
                    <Input id="asset-name" placeholder="ex: Actions Apple" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asset-type">Type d'actif</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock">Actions</SelectItem>
                        <SelectItem value="bond">Obligations</SelectItem>
                        <SelectItem value="fund">Fonds</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                        <SelectItem value="crypto">Cryptomonnaie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset-value">Valeur actuelle (€)</Label>
                    <Input id="asset-value" placeholder="5000" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-date">Date d'acquisition</Label>
                    <Input id="purchase-date" type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-price">Prix d'achat (€)</Label>
                    <Input id="purchase-price" placeholder="4800" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asset-quantity">Quantité</Label>
                    <Input id="asset-quantity" placeholder="1" type="number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset-description">Description</Label>
                  <Input
                    id="asset-description"
                    placeholder="Description de votre actif (optionnel)"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => navigate('/portfolio')}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter l'actif</Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="property">
              <div className="p-8 text-center text-muted-foreground">
                <p>Formulaire d'ajout d'actif immobilier</p>
              </div>
            </TabsContent>

            <TabsContent value="other">
              <div className="p-8 text-center text-muted-foreground">
                <p>Formulaire d'ajout d'actif alternatif</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAssetPage;
