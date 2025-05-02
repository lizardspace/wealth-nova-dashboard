// src/pages/admin/ai/RecommendationsPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./recommendationColumns";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    id: "1",
    client: "Dupont Jean",
    recommendation: "Ouverture d'un PER pour optimiser la fiscalité",
    date: "2023-11-15",
    status: "En attente",
  },
  {
    id: "2",
    client: "Martin Sophie",
    recommendation: "Diversification avec des SCPI",
    date: "2023-11-10",
    status: "Acceptée",
  },
];

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recommandations IA</h1>
        <div className="space-x-2">
          <Button variant="outline">Filtrer</Button>
          <Button>Exporter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={recommendations} />
        </CardContent>
      </Card>
    </div>
  );
}