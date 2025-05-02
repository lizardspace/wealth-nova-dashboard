// src/pages/admin/ai/InteractionTrackingPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./interactionColumns";

const interactions = [
  {
    id: "1",
    client: "Dupont Jean",
    type: "Chat",
    date: "2023-11-15 14:30",
    duration: "12 min",
    satisfaction: "4/5",
  },
  {
    id: "2",
    client: "Martin Sophie",
    type: "Recommandation",
    date: "2023-11-10 09:15",
    duration: "-",
    satisfaction: "3/5",
  },
];

export default function InteractionTrackingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suivi des interactions IA</h1>
        <div className="space-x-2">
          <Button variant="outline">Filtrer</Button>
          <Button>Exporter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={interactions} />
        </CardContent>
      </Card>
    </div>
  );
}