// src/pages/admin/ai/InteractionTrackingPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { columns, Interaction } from './interactionColumns';

const interactions: Interaction[] = [
  {
    id: '1',
    client: 'Dupont Jean',
    type: 'Chat',
    date: '2023-11-15 14:30',
    topic: 'Retraite',
    duration: '12 min',
    status: 'Terminée',
    topics: ['Retraite', 'Placement'],
    satisfaction: '4/5',
  },
  {
    id: '2',
    client: 'Martin Sophie',
    type: 'Recommandation',
    date: '2023-11-10 09:15',
    topic: 'Assurance vie',
    duration: '-',
    status: 'Interrompue',
    topics: ['Assurance vie', 'Fiscalité'],
    satisfaction: '3/5',
  },
  {
    id: '3',
    client: 'Bernard Pierre',
    type: 'Simulation',
    date: '2023-11-08 11:45',
    topic: 'Investissement',
    duration: '8 min',
    status: 'Terminée',
    topics: ['Investissement', 'SCPI'],
    satisfaction: '5/5',
  },
  {
    id: '4',
    client: 'Petit Marie',
    type: 'Chat',
    date: '2023-11-12 16:20',
    topic: 'Crédit',
    duration: '5 min',
    status: 'Terminée',
    topics: ['Crédit', 'Immobilier'],
    satisfaction: '4/5',
  },
];

export default function InteractionTrackingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suivi des interactions IA</h1>
        <div className="space-x-2">
          <Button variant="outline">Filtrer</Button>
          <Button>Exporter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={interactions} />
        </CardContent>
      </Card>
    </div>
  );
}
