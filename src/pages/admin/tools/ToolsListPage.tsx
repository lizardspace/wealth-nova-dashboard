// src/pages/admin/tools/ToolsListPage.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ToolsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Outils Administratifs</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Simulateurs</CardTitle>
            <CardDescription>Gestion des outils de simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/outils/simulateurs">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
            <CardDescription>Catalogue des produits financiers</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/outils/produits">Gérer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Règles d'affichage</CardTitle>
            <CardDescription>Configuration des règles conditionnelles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/outils/regles-affichage">Gérer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}