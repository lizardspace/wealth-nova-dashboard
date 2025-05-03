
// src/pages/admin/ai/ScoresPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns, ClientScore } from "./scoreColumns";

const scores: ClientScore[] = [
  {
    id: "1",
    client: "Dupont Jean",
    score: 78,
    lastUpdate: "2023-11-15",
    evolution: "+5",
    riskProfile: "Équilibré",
    variation: "positive",
    status: "stable",
  },
  {
    id: "2",
    client: "Martin Sophie",
    score: 65,
    lastUpdate: "2023-11-10",
    evolution: "-2",
    riskProfile: "Prudent",
    variation: "negative",
    status: "declining",
  },
];

export default function ScoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scores Patrimoniaux IA</h1>
        <Button>Exporter les données</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des scores clients</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={scores} />
        </CardContent>
      </Card>
    </div>
  );
}
