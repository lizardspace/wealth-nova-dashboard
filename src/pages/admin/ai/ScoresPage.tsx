
// src/pages/admin/ai/ScoresPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns, ClientScore } from "./scoreColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";

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
  {
    id: "3",
    client: "Bernard Pierre",
    score: 82,
    lastUpdate: "2023-11-05",
    evolution: "+8",
    riskProfile: "Dynamique",
    variation: "positive",
    status: "improving",
  },
  {
    id: "4",
    client: "Petit Marie",
    score: 45,
    lastUpdate: "2023-11-18",
    evolution: "-15",
    riskProfile: "Défensif",
    variation: "negative",
    status: "declining",
  },
];

export default function ScoresPage() {
  // Filtrer les clients avec une baisse significative de score
  const alertClients = scores.filter(client => 
    parseInt(client.evolution) <= -10
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scores Patrimoniaux IA</h1>
        <Button>Exporter les données</Button>
      </div>
      
      {alertClients.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="mr-2 h-5 w-5" /> 
              Alertes score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-amber-800">
              {alertClients.map(client => (
                <div key={client.id} className="mb-1">
                  Le client <span className="font-medium">{client.client}</span> a perdu <span className="font-medium">{client.evolution.replace('-', '')}</span> points de score ce mois-ci.
                  <Button variant="outline" size="sm" className="ml-2 text-xs h-7">
                    Contacter
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous ({scores.length})</TabsTrigger>
          <TabsTrigger value="declining">En baisse ({scores.filter(s => s.status === "declining").length})</TabsTrigger>
          <TabsTrigger value="stable">Stables ({scores.filter(s => s.status === "stable").length})</TabsTrigger>
          <TabsTrigger value="improving">En hausse ({scores.filter(s => s.status === "improving").length})</TabsTrigger>
        </TabsList>
      
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des scores clients</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={scores} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="declining" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients avec scores en baisse</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={scores.filter(s => s.status === "declining")} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stable" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients avec scores stables</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={scores.filter(s => s.status === "stable")} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="improving" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients avec scores en hausse</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={scores.filter(s => s.status === "improving")} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
