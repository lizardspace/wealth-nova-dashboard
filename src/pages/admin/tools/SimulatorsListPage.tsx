// src/pages/admin/tools/SimulatorsListPage.tsx
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
const simulators = [
  {
    id: "1",
    name: "Simulateur de retraite",
    category: "Retraite",
    lastUpdated: "2023-10-15",
    active: true,
  },
  {
    id: "2",
    name: "Simulateur d'investissement",
    category: "Investissement",
    lastUpdated: "2023-09-20",
    active: true,
  },
  {
    id: "3",
    name: "Simulateur de prêt",
    category: "Crédit",
    lastUpdated: "2023-08-05",
    active: false,
  },
];

export default function SimulatorsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des simulateurs</h1>
        <Button asChild>
          <Link to="/admin/outils/simulateurs/new">Nouveau simulateur</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {simulators.map((simulator) => (
              <TableRow key={simulator.id}>
                <TableCell>
                  <Link 
                    to={`/admin/outils/simulateurs/${simulator.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {simulator.name}
                  </Link>
                </TableCell>
                <TableCell>{simulator.category}</TableCell>
                <TableCell>{simulator.lastUpdated}</TableCell>
                <TableCell>
                  {simulator.active ? "Actif" : "Inactif"}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/outils/simulateurs/${simulator.id}`}>
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