// src/pages/admin/ai/ClientScorePage.tsx
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ClientScorePage() {
  const { clientId } = useParams();

  // Simuler des données en fonction de l'ID client
  const clientScore = {
    id: clientId,
    name: `Client ${clientId}`,
    score: 78,
    details: {
      diversification: 'Bonne',
      fiscalite: 'Optimisable',
      frais: 'Faibles',
      liquidite: 'Correcte',
    },
    recommendations: [
      'Optimiser la fiscalité avec un PER',
      'Diversifier avec des SCPI',
      'Réduire les liquidités excédentaires',
    ],
    history: [
      { date: '2023-06', score: 65 },
      { date: '2023-07', score: 68 },
      { date: '2023-08', score: 72 },
      { date: '2023-09', score: 76 },
      { date: '2023-10', score: 75 },
      { date: '2023-11', score: 78 },
    ],
    alerts: [
      {
        id: 1,
        date: '2023-07-15',
        message: 'Gain de 3 points suite à la diversification du portefeuille',
        type: 'positive',
      },
      {
        id: 2,
        date: '2023-10-05',
        message: "Perte d'1 point due à la concentration excessive sur un produit",
        type: 'negative',
      },
    ],
  };

  // Calculer la variation par rapport au mois précédent
  const currentScore = clientScore.history[clientScore.history.length - 1].score;
  const previousScore = clientScore.history[clientScore.history.length - 2].score;
  const variation = currentScore - previousScore;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Score client {clientScore.name}</h1>
        <Button asChild variant="outline">
          <Link to="/admin/ia/scores">Retour à la liste</Link>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Score actuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="text-5xl font-bold">{clientScore.score}/100</div>
              <div className="ml-4">
                {variation > 0 ? (
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="mr-1 h-5 w-5" />
                    <span>+{variation} pts</span>
                  </div>
                ) : variation < 0 ? (
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="mr-1 h-5 w-5" />
                    <span>{variation} pts</span>
                  </div>
                ) : (
                  <div className="text-gray-600">Stable</div>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Dernière mise à jour: {new Date().toLocaleDateString()}
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Profil de risque</h3>
              <div className="bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${clientScore.score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Défensif</span>
                <span>Prudent</span>
                <span>Équilibré</span>
                <span>Dynamique</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={clientScore.history}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[40, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
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

      {clientScore.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertes et changements significatifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {clientScore.alerts.map(alert => (
                <li
                  key={alert.id}
                  className={`p-3 rounded-md ${
                    alert.type === 'positive'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>{alert.message}</div>
                    <div className="text-sm">{alert.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recommandations IA</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {clientScore.recommendations.map((rec, index) => (
              <li key={index} className="mb-2">
                <div className="flex justify-between items-center">
                  <span>{rec}</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">
                      Ignorer
                    </Button>
                    <Button size="sm">Appliquer</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
