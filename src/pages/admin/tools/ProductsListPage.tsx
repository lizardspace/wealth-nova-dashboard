// src/pages/admin/tools/ProductsListPage.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simuler des données pour le tableau
const products = [
  {
    id: "1",
    name: "Assurance vie",
    category: "Épargne",
    provider: "AXA",
    status: "active",
  },
  {
    id: "2",
    name: "PEA",
    category: "Bourse",
    provider: "BNP Paribas",
    status: "active",
  },
  {
    id: "3",
    name: "SCPI",
    category: "Immobilier",
    provider: "Primonial",
    status: "inactive",
  },
];

export default function ProductsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Catalogue des produits</h1>
        <Button asChild>
          <Link to="/admin/outils/produits/new">Nouveau produit</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link 
                    to={`/admin/outils/produits/${product.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.provider}</TableCell>
                <TableCell>
                  {product.status === "active" ? "Actif" : "Inactif"}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/outils/produits/${product.id}`}>
                      Détails
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}