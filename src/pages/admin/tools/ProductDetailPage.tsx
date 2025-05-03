
// src/pages/admin/tools/ProductDetailPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save,
  Upload,
  Eye,
  Image as ImageIcon,
  AlertTriangle,
  Check
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const isNewProduct = id === "new";
  const [activeTab, setActiveTab] = useState("general");
  const [previewMode, setPreviewMode] = useState(false);
  const [notification, setNotification] = useState<{type: string; message: string} | null>(null);

  // Données simulées d'un produit
  const product = {
    id: id || "1",
    name: "Assurance Vie Premium",
    description: "Solution d'épargne premium avec options d'investissement diversifiées et avantages fiscaux.",
    category: "Épargne",
    provider: "AXA",
    status: "active",
    features: [
      "Frais d'entrée réduits à 0,5%",
      "Accès à plus de 500 unités de compte",
      "Fonds en euros garanti à 1,2%",
      "Disponibilité des fonds à tout moment",
    ],
    performance: {
      year1: "3.2%",
      year3: "8.5%",
      year5: "12.1%",
    },
    riskLevel: "Moyen",
    minimalInvestment: "1000",
    recommendedDuration: "8 ans",
    imageUrl: "https://images.unsplash.com/photo-1460794418188-1bb7dba2720d?auto=format&fit=crop&w=800&q=80",
    simulatorId: "sim-av-1",
    salesPoints: "Produit particulièrement adapté aux clients cherchant une solution d'épargne à moyen/long terme avec une fiscalité avantageuse. Performance du fonds euros parmi les meilleures du marché."
  };

  const handleSave = () => {
    // Simuler l'enregistrement
    setNotification({
      type: "success",
      message: "Le produit a bien été enregistré"
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/outils/produits">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{product.name}</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Éditer" : "Aperçu"}
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-md ${
          notification.type === "success" ? "bg-green-50 text-green-700 border border-green-200" :
          "bg-red-50 text-red-700 border border-red-200"
        } flex items-center`}>
          {notification.type === "success" ? 
            <Check className="mr-2 h-5 w-5" /> : 
            <AlertTriangle className="mr-2 h-5 w-5" />
          }
          {notification.message}
        </div>
      )}

      {!previewMode ? (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="simulator">Simulateur</TabsTrigger>
            <TabsTrigger value="display">Règles d'affichage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Informations de base sur le produit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input id="name" defaultValue={product.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select defaultValue={product.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Épargne">Épargne</SelectItem>
                        <SelectItem value="Investissement">Investissement</SelectItem>
                        <SelectItem value="Retraite">Retraite</SelectItem>
                        <SelectItem value="Immobilier">Immobilier</SelectItem>
                        <SelectItem value="Fiscalité">Fiscalité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider">Fournisseur</Label>
                    <Input id="provider" defaultValue={product.provider} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select defaultValue={product.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="draft">Brouillon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Investissement minimum (€)</Label>
                    <Input id="minAmount" type="number" defaultValue={product.minimalInvestment} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée recommandée (années)</Label>
                    <Input id="duration" type="number" defaultValue={product.recommendedDuration} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk">Niveau de risque</Label>
                    <Select defaultValue={product.riskLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très faible">Très faible</SelectItem>
                        <SelectItem value="Faible">Faible</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Élevé">Élevé</SelectItem>
                        <SelectItem value="Très élevé">Très élevé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contenu du produit</CardTitle>
                <CardDescription>
                  Description et caractéristiques du produit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    defaultValue={product.description} 
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sales-points">Arguments commerciaux</Label>
                  <Textarea 
                    id="sales-points" 
                    defaultValue={product.salesPoints}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image du produit</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    {product.imageUrl ? (
                      <div className="space-y-4 w-full">
                        <div className="relative w-full h-40">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex justify-center">
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Changer l'image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                        <div className="text-sm text-muted-foreground">
                          Glissez une image ou cliquez pour télécharger
                        </div>
                        <Button variant="outline" size="sm">
                          Télécharger
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Caractéristiques</Label>
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input 
                          defaultValue={feature} 
                          className="flex-grow"
                        />
                        <Button variant="ghost" size="sm">×</Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2">
                      + Ajouter une caractéristique
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de performance</CardTitle>
                <CardDescription>
                  Performances historiques et indicateurs clés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Performances historiques</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="perf1">Performance 1 an</Label>
                      <Input id="perf1" defaultValue={product.performance.year1} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perf3">Performance 3 ans</Label>
                      <Input id="perf3" defaultValue={product.performance.year3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perf5">Performance 5 ans</Label>
                      <Input id="perf5" defaultValue={product.performance.year5} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Frais</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entryFee">Frais d'entrée (%)</Label>
                      <Input id="entryFee" type="number" step="0.01" defaultValue="0.5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="managementFee">Frais de gestion (%)</Label>
                      <Input id="managementFee" type="number" step="0.01" defaultValue="0.8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exitFee">Frais de sortie (%)</Label>
                      <Input id="exitFee" type="number" step="0.01" defaultValue="0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="simulator" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du simulateur</CardTitle>
                <CardDescription>
                  Associez un simulateur à ce produit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="simulator">Simulateur associé</Label>
                  <Select defaultValue={product.simulatorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un simulateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim-av-1">Simulateur Assurance Vie</SelectItem>
                      <SelectItem value="sim-scpi-1">Simulateur SCPI</SelectItem>
                      <SelectItem value="sim-per-1">Simulateur PER</SelectItem>
                      <SelectItem value="none">Aucun simulateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/20 rounded-md space-y-2">
                  <h3 className="font-medium">Position du simulateur</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="position-top" name="simulator-position" defaultChecked />
                      <Label htmlFor="position-top">En haut de la page</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="position-middle" name="simulator-position" />
                      <Label htmlFor="position-middle">Au milieu de la page</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="position-bottom" name="simulator-position" />
                      <Label htmlFor="position-bottom">En bas de la page</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="position-sidebar" name="simulator-position" />
                      <Label htmlFor="position-sidebar">Dans la barre latérale</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="display" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Règles d'affichage</CardTitle>
                <CardDescription>
                  Définissez quand et à qui ce produit sera affiché
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Visibilité du produit</Label>
                  <div className="space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="visibility-public" name="visibility" defaultChecked />
                      <Label htmlFor="visibility-public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="visibility-restricted" name="visibility" />
                      <Label htmlFor="visibility-restricted">Restreint (selon règles)</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Règles conditionnelles associées</Label>
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                      <div className="flex items-center">
                        <input type="checkbox" id="rule-1" className="mr-2" defaultChecked />
                        <Label htmlFor="rule-1">Afficher pour clients +50 ans</Label>
                      </div>
                      <Button variant="ghost" size="sm">Éditer</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                      <div className="flex items-center">
                        <input type="checkbox" id="rule-2" className="mr-2" defaultChecked />
                        <Label htmlFor="rule-2">Afficher pour patrimoine >100k</Label>
                      </div>
                      <Button variant="ghost" size="sm">Éditer</Button>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      + Ajouter une règle
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to="/admin/outils/regles-affichage">
                    Gérer toutes les règles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription className="mt-1">{product.category} · {product.provider}</CardDescription>
              </div>
              <div className="text-right">
                <div className={`inline-block px-2 py-1 text-xs rounded-full ${
                  product.riskLevel === "Moyen" ? "bg-yellow-100 text-yellow-700" :
                  product.riskLevel === "Faible" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  Risque {product.riskLevel}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full h-48">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Description</h3>
                <p>{product.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Caractéristiques</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Performances</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md text-center">
                    <div className="text-sm text-gray-600">1 an</div>
                    <div className="text-xl font-bold text-green-600">+{product.performance.year1}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md text-center">
                    <div className="text-sm text-gray-600">3 ans</div>
                    <div className="text-xl font-bold text-green-600">+{product.performance.year3}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md text-center">
                    <div className="text-sm text-gray-600">5 ans</div>
                    <div className="text-xl font-bold text-green-600">+{product.performance.year5}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2 text-blue-700">Simulateur Assurance Vie</h3>
                <div className="text-sm text-blue-600 mb-3">
                  Estimez votre capital futur selon vos versements
                </div>
                <div className="border border-blue-200 bg-white rounded-md p-4">
                  <div className="text-center text-sm text-gray-500">
                    [Interface du simulateur ici]
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">L'essentiel à retenir</h3>
                <p>{product.salesPoints}</p>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button size="lg">
                  Souscrire maintenant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
