// src/pages/admin/tools/SimulatorDetailPage.tsx
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SimulatorDetailPage() {
  const { id } = useParams();

  // Simuler des données en fonction de l'ID
  const simulator = {
    id: id,
    name: `Simulateur ${id}`,
    description: 'Description détaillée du simulateur',
    configuration: {
      param1: 'Valeur 1',
      param2: 'Valeur 2',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{simulator.name}</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to="/admin/outils/simulateurs">Retour à la liste</Link>
          </Button>
          <Button asChild>
            <Link to={`/admin/outils/simulateurs/${id}/edit`}>Modifier</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du simulateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{simulator.description}</p>
          </div>

          <div>
            <h3 className="font-medium">Configuration</h3>
            <pre className="bg-muted p-4 rounded-md text-sm">
              {JSON.stringify(simulator.configuration, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
