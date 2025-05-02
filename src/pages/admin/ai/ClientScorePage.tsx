// src/pages/admin/ai/ClientScorePage.tsx
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ClientScorePage() {
  const { clientId } = useParams();

  // Simuler des données en fonction de l'ID client
  const clientScore = {
    id: clientId,
    name: `Client ${clientId}`,
    score: 78,
    details: {
      diversification: "Bonne",
      fiscalite: "Optimisable",
      frais: "Faibles",
      liquidite: "Correcte",
    },
    recommendations: [
      "Optimiser la fiscalité avec un PER",
      "Diversifier avec des SCPI",
      "Réduire les liquidités excédentaires",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Score client {clientId}</h1>
        <Button asChild variant="outline">
          <Link to="/admin/ia/scores">Retour à la liste</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail du score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="text-5xl font-bold">{clientScore.score}/100</div>
            <div>
              <p className="text-muted-foreground">Score patrimonial IA</p>
              <p>Dernière mise à jour: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Diversification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientScore.details.diversification}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fiscalité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientScore.details.fiscalite}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Frais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientScore.details.frais}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Liquidité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientScore.details.liquidite}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-medium">Recommandations IA</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {clientScore.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}