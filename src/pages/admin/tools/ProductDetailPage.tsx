
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Upload, Save } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving product data");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détail du produit</h1>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="conditions">Conditions d'affichage</TabsTrigger>
          <TabsTrigger value="simulator">Simulateur associé</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du produit</CardTitle>
              <CardDescription>
                Détails et paramètres principaux du produit financier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input id="name" placeholder="Assurance-vie Premium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input id="category" placeholder="Assurance-vie" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return">Rendement estimé (%)</Label>
                  <Input id="return" type="number" placeholder="3.2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">Niveau de risque (1-5)</Label>
                  <Input id="risk" type="number" min="1" max="5" placeholder="2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Description détaillée du produit..." 
                  rows={5}
                />
              </div>
              
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <div className="text-sm text-gray-600">
                    Glissez-déposez une image ou
                    <Button variant="link" className="px-1">
                      parcourir vos fichiers
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400">
                    PNG, JPG (max. 2MB)
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="published" />
                <Label htmlFor="published">Publié</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conditions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Conditions d'affichage</CardTitle>
              <CardDescription>
                Définissez quand ce produit doit être proposé aux clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Collapsible
                open={expanded}
                onOpenChange={setExpanded}
                className="border rounded-md p-2"
              >
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">Règles d'affichage</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Afficher les règles</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <Checkbox id="rule-1" />
                    <Label htmlFor="rule-1">Afficher aux clients avec un score supérieur à 75</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <Checkbox id="rule-2" />
                    <Label htmlFor="rule-2">Afficher pour patrimoine &gt;100k</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <Checkbox id="rule-3" />
                    <Label htmlFor="rule-3">Afficher si objectif retraite</Label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="simulator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulateur associé</CardTitle>
              <CardDescription>
                Associez un simulateur à ce produit financier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simulator">Choisir un simulateur</Label>
                <Input id="simulator" placeholder="Simulateur de rendement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="params">Paramètres par défaut (JSON)</Label>
                <Textarea 
                  id="params" 
                  placeholder='{"duree": 10, "capital_initial": 10000}' 
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;
