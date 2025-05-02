// src/pages/admin/tools/ConditionalRulesPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simuler des données pour les règles
const rules = [
  {
    id: "1",
    name: "Affichage produits premium",
    condition: "patrimoine > 500000",
    target: "produits.premium",
  },
  {
    id: "2",
    name: "Affichage options risque",
    condition: "profil_risque == 'dynamique'",
    target: "options.risque",
  },
];

export default function ConditionalRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Règles conditionnelles d'affichage</h1>
        <Button>Nouvelle règle</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des règles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la règle</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Cible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded-md text-sm">
                        {rule.condition}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded-md text-sm">
                        {rule.target}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button variant="destructive" size="sm">
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}