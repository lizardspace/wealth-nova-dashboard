
// src/pages/admin/tools/ConditionalRulesPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Code, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { columns, Rule } from "./ruleColumns";

const rules: Rule[] = [
  {
    id: "1",
    name: "Afficher PER pour clients +50 ans",
    condition: "client.age > 50",
    target: "product:id=per",
  },
  {
    id: "2",
    name: "Afficher SCPI pour patrimoine >100k",
    condition: "client.patrimoine > 100000",
    target: "product:id=scpi",
  },
  {
    id: "3",
    name: "Afficher produits structurés pour profil risque élevé",
    condition: "client.profilRisque === 'Dynamique'",
    target: "product:category=structuré",
  },
];

export default function ConditionalRulesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Règles d'affichage conditionnelles</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle règle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle règle conditionnelle</DialogTitle>
              <DialogDescription>
                Les règles conditionnelles déterminent l'affichage des produits selon des critères client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  placeholder="Nom de la règle"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target-type" className="text-right">
                  Type de cible
                </Label>
                <Select defaultValue="product">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Produit</SelectItem>
                    <SelectItem value="category">Catégorie de produits</SelectItem>
                    <SelectItem value="simulator">Simulateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target-id" className="text-right">
                  ID Cible
                </Label>
                <Input
                  id="target-id"
                  placeholder="ID du produit ou de la catégorie"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="condition" className="text-right pt-2">
                  Condition
                </Label>
                <div className="col-span-3 space-y-2">
                  <Textarea
                    id="condition"
                    placeholder="client.age > 50 && client.patrimoine > 100000"
                    className="min-h-[100px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    Utilisez la syntaxe JavaScript pour définir les conditions. Variables disponibles: client.age, client.patrimoine, client.profilRisque, client.score, etc.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="action" className="text-right">
                  Action
                </Label>
                <Select defaultValue="show">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Afficher</SelectItem>
                    <SelectItem value="hide">Masquer</SelectItem>
                    <SelectItem value="highlight">Mettre en évidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des règles conditionnelles</CardTitle>
          <CardDescription>
            Gérez les règles qui déterminent quels produits sont affichés à quels clients selon leurs caractéristiques.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center p-4 bg-muted/20 rounded-md">
              <Code className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-lg font-medium">Comment fonctionnent les règles?</h3>
                <p className="text-sm text-muted-foreground">
                  Les règles conditionnelles permettent d'afficher ou masquer des produits, simulateurs ou sections selon le profil du client.
                  Utilisez des expressions comme <code>client.age > 50</code> ou <code>client.patrimoine > 100000</code>.
                </p>
              </div>
            </div>
          </div>

          <DataTable columns={columns} data={rules} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test des règles</CardTitle>
          <CardDescription>
            Vérifiez quels produits seront affichés pour un profil client spécifique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Profil client test</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-age" className="text-right">
                    Âge
                  </Label>
                  <Input
                    id="client-age"
                    type="number"
                    defaultValue="45"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-patrimoine" className="text-right">
                    Patrimoine (€)
                  </Label>
                  <Input
                    id="client-patrimoine"
                    type="number"
                    defaultValue="120000"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-profil" className="text-right">
                    Profil de risque
                  </Label>
                  <Select defaultValue="equilibre">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un profil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prudent">Prudent</SelectItem>
                      <SelectItem value="equilibre">Équilibré</SelectItem>
                      <SelectItem value="dynamique">Dynamique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-score" className="text-right">
                    Score IA
                  </Label>
                  <Input
                    id="client-score"
                    type="number"
                    defaultValue="65"
                    className="col-span-3"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Filter className="mr-2 h-4 w-4" />
                    Tester les règles
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-muted/20 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Résultats</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-white rounded border">
                  <span>Produit: PER</span>
                  <span className="text-amber-600">Masqué (Age &lt; 50)</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded border">
                  <span>Produit: SCPI</span>
                  <span className="text-green-600">Affiché (Patrimoine &gt; 100k)</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded border">
                  <span>Catégorie: Produits structurés</span>
                  <span className="text-amber-600">Masqué (Profil non dynamique)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
