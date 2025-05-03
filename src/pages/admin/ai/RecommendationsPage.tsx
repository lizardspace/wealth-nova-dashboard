
// src/pages/admin/ai/RecommendationsPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./recommendationColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recommendation } from "./recommendationColumns";

const recommendations: Recommendation[] = [
  {
    id: "1",
    client: "Dupont Jean",
    recommendation: "Diversification du portefeuille immobilier",
    date: "2023-11-15",
    status: "En attente",
  },
  {
    id: "2",
    client: "Martin Sophie",
    recommendation: "Ouverture d'un PER individuel",
    date: "2023-11-12",
    status: "Acceptée",
  },
  {
    id: "3",
    client: "Bernard Pierre",
    recommendation: "Réduction des liquidités - opportunités d'investissement",
    date: "2023-11-10",
    status: "Rejetée",
  },
  {
    id: "4",
    client: "Petit Marie",
    recommendation: "Ajustement assurance-vie - répartition unités de compte",
    date: "2023-11-08",
    status: "Acceptée",
  },
  {
    id: "5",
    client: "Robert Antoine",
    recommendation: "Optimisation fiscale - donation temporaire d'usufruit",
    date: "2023-11-05",
    status: "En attente",
  },
];

export default function RecommendationsPage() {
  const pendingRecommendations = recommendations.filter(r => r.status === "En attente");
  const acceptedRecommendations = recommendations.filter(r => r.status === "Acceptée");
  const rejectedRecommendations = recommendations.filter(r => r.status === "Rejetée");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recommandations IA</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Filtrer</Button>
          <Button>Exporter les données</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({pendingRecommendations.length})</TabsTrigger>
          <TabsTrigger value="accepted">Acceptées ({acceptedRecommendations.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées ({rejectedRecommendations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={recommendations} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={pendingRecommendations} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accepted" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations acceptées</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={acceptedRecommendations} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations rejetées</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={rejectedRecommendations} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
