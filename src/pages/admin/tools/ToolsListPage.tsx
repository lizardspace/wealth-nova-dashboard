
// src/pages/admin/tools/ToolsListPage.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, TrendingUp, Briefcase, FileText, Activity, LineChart, Wrench } from "lucide-react";

export default function ToolsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Outils Administratifs</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Simulateurs</CardTitle>
            <CardDescription>Gestion des outils de simulation financière</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configurez et personnalisez les simulateurs disponibles pour vos clients.
            </p>
            <Button asChild>
              <Link to="/admin/outils/simulateurs">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Produits</CardTitle>
            <CardDescription>Catalogue des produits financiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gérez la base de produits disponibles et leurs caractéristiques.
            </p>
            <Button asChild>
              <Link to="/admin/outils/produits">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Règles d'affichage</CardTitle>
            <CardDescription>Configuration des règles conditionnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Définissez quand et à qui afficher chaque produit ou simulateur.
            </p>
            <Button asChild>
              <Link to="/admin/outils/regles-affichage">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Rapports</CardTitle>
            <CardDescription>Générateur de rapports personnalisés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Créez des rapports sur mesure pour vos clients ou votre équipe.
            </p>
            <Button asChild>
              <Link to="/admin/outils/rapports">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Templates d'emails</CardTitle>
            <CardDescription>Configuration des modèles email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Personnalisez les emails envoyés automatiquement aux clients.
            </p>
            <Button asChild>
              <Link to="/admin/outils/templates-email">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Intégrations</CardTitle>
            <CardDescription>Connecteurs et APIs externes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configurez les connexions avec des services tiers et partenaires.
            </p>
            <Button asChild>
              <Link to="/admin/outils/integrations">Gérer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
