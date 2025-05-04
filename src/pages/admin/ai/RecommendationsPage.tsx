
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Recommendation = {
  id: number;
  client: string;
  date: string;
  description: string;
  status: "En attente" | "Acceptée" | "Rejetée";
  product?: string;
  productAdopted?: boolean;
};

const recommendations: Recommendation[] = [
  {
    id: 1,
    client: "Jean Dupont",
    date: "15/04/2025",
    description: "Augmenter l'allocation en actions",
    status: "Acceptée",
    product: "Fonds dynamique",
    productAdopted: true
  },
  {
    id: 2,
    client: "Marie Lefevre",
    date: "12/04/2025",
    description: "Souscrire à une assurance-vie",
    status: "En attente",
    product: "Assurance-vie Premium",
    productAdopted: false
  },
  {
    id: 3,
    client: "Philippe Martin",
    date: "10/04/2025",
    description: "Rééquilibrer le portefeuille",
    status: "Rejetée",
    product: "Service d'analyse",
    productAdopted: false
  },
  {
    id: 4,
    client: "Sophie Dubois",
    date: "05/04/2025",
    description: "Investir dans l'immobilier locatif",
    status: "Acceptée",
    product: "SCPI Rendement",
    productAdopted: true
  },
  {
    id: 5,
    client: "Michel Bernard",
    date: "01/04/2025",
    description: "Ouvrir un PER",
    status: "Rejetée",
    product: "PER Flexible",
    productAdopted: false
  }
];

const RecommendationsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Recommandations IA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recommandations acceptées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recommendations.filter(r => r.status === "Acceptée").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recommandations rejetées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recommendations.filter(r => r.status === "Rejetée").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Produits adoptés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recommendations.filter(r => r.productAdopted).length}</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Recommandation</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((recommendation) => (
            <TableRow key={recommendation.id}>
              <TableCell className="font-medium">{recommendation.client}</TableCell>
              <TableCell>{recommendation.date}</TableCell>
              <TableCell>{recommendation.description}</TableCell>
              <TableCell>{recommendation.product}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    recommendation.status === "Acceptée"
                      ? "outline"
                      : recommendation.status === "En attente"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {recommendation.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecommendationsPage;
