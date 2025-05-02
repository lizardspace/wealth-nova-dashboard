// src/pages/admin/tools/ProductDetailPage.tsx
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProductDetailPage() {
  const { id } = useParams();

  // Simuler des données en fonction de l'ID
  const product = {
    id: id,
    name: `Produit ${id}`,
    description: "Description détaillée du produit",
    characteristics: {
      rendement: "2.5%",
      fiscalité: "PFU 30%",
      durée: "8 ans",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to="/admin/outils/produits">Retour à la liste</Link>
          </Button>
          <Button asChild>
            <Link to={`/admin/outils/produits/${id}/edit`}>Modifier</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h3 className="font-medium">Caractéristiques</h3>
            <pre className="bg-muted p-4 rounded-md text-sm">
              {JSON.stringify(product.characteristics, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}