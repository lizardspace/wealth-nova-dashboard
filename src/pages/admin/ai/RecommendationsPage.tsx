import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Recommendation = Database['public']['Tables']['ia_recommendations']['Row'];

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const { data, error } = await supabase
        .from('ia_recommendations')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setRecommendations(data);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
