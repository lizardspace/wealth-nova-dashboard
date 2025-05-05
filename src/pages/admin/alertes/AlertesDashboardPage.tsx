// src/pages/admin/alertes/AlertesDashboardPage.tsx
import { Eye, Bell, AlertTriangle, Clock, UserX, FileText, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

type AlertStats = {
  total: number;
  inactiveClients: number;
  incompleteProfiles: number;
  pendingProjects: number;
  potentialGains: number;
};

const alertsStats: AlertStats = {
  total: 78,
  inactiveClients: 24,
  incompleteProfiles: 31,
  pendingProjects: 15,
  potentialGains: 8,
};

type RecentAlert = {
  id: string;
  type: "inactiveClient" | "incompleteProfile" | "pendingProject" | "potentialGain";
  client: string;
  description: string;
  date: string;
  priority: "high" | "medium" | "low";
};

const recentAlerts: RecentAlert[] = [
  {
    id: "1",
    type: "inactiveClient",
    client: "Dupont Jean",
    description: "Client inactif depuis 6 mois",
    date: "2024-04-15",
    priority: "high",
  },
  {
    id: "2",
    type: "incompleteProfile",
    client: "Martin Sophie",
    description: "Objectifs patrimoniaux non définis",
    date: "2024-04-20",
    priority: "medium",
  },
  {
    id: "3",
    type: "pendingProject",
    client: "Bernard Pierre",
    description: "Projet immobilier en attente depuis 3 mois",
    date: "2024-04-18",
    priority: "medium",
  },
  {
    id: "4",
    type: "potentialGain",
    client: "Petit Marie",
    description: "Optimisation fiscale possible: -2300€ d'impôts",
    date: "2024-04-22",
    priority: "high",
  },
];

const PriorityBadge = ({ priority }: { priority: RecentAlert["priority"] }) => {
  return (
    <div className="flex items-center">
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          priority === "high"
            ? "bg-red-500"
            : priority === "medium"
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      ></div>
      <span className="text-xs text-muted-foreground capitalize">
        {priority === "high" ? "Élevée" : priority === "medium" ? "Moyenne" : "Basse"}
      </span>
    </div>
  );
};

const AlertIcon = ({ type }: { type: RecentAlert["type"] }) => {
  switch (type) {
    case "inactiveClient":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "incompleteProfile":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "pendingProject":
      return <AlertTriangle className="h-4 w-4 text-purple-500" />;
    case "potentialGain":
      return <BarChart className="h-4 w-4 text-green-500" />;
  }
};

export default function AlertesDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Vue d'ensemble des alertes</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
          <Bell className="mr-2 h-4 w-4" />
          Configurer les alertes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Clients inactifs</CardTitle>
            <CardDescription>
              Clients sans interaction récente
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-amber-500">{alertsStats.inactiveClients}</div>
            <Progress
              value={(alertsStats.inactiveClients / alertsStats.total) * 100}
              className="h-2 mt-2 bg-amber-100"
            />
          </CardContent>
          <CardFooter>
            <Link to="/admin/alertes/inactifs">
              <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors">
                <Eye className="mr-2 h-4 w-4" />
                Voir les clients
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Profils incomplets</CardTitle>
            <CardDescription>
              Informations manquantes
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-blue-500">{alertsStats.incompleteProfiles}</div>
            <Progress
              value={(alertsStats.incompleteProfiles / alertsStats.total) * 100}
              className="h-2 mt-2 bg-blue-100"
            />
          </CardContent>
          <CardFooter>
            <Link to="/admin/alertes/profils-incomplets">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">
                <Eye className="mr-2 h-4 w-4" />
                Voir les profils
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Projets en cours</CardTitle>
            <CardDescription>
              Projets non finalisés
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-purple-500">{alertsStats.pendingProjects}</div>
            <Progress
              value={(alertsStats.pendingProjects / alertsStats.total) * 100}
              className="h-2 mt-2 bg-purple-100"
            />
          </CardContent>
          <CardFooter>
            <Link to="/admin/alertes/projets-en-cours">
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <Eye className="mr-2 h-4 w-4" />
                Voir les projets
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Gains potentiels</CardTitle>
            <CardDescription>
              Optimisations non activées
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold text-green-500">{alertsStats.potentialGains}</div>
            <Progress
              value={(alertsStats.potentialGains / alertsStats.total) * 100}
              className="h-2 mt-2 bg-green-100"
            />
          </CardContent>
          <CardFooter>
            <Link to="/admin/alertes/gains-potentiels">
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                <Eye className="mr-2 h-4 w-4" />
                Voir les opportunités
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
          <CardDescription>
            Les dernières opportunités détectées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:shadow-sm hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted group-hover:bg-blue-50 transition-colors">
                    <AlertIcon type={alert.type} />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      <Link
                        to={`/admin/clients/${alert.id}`}
                        className="hover:underline text-primary group-hover:text-blue-600 transition-colors"
                      >
                        {alert.client}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-1 flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.date).toLocaleDateString("fr-FR")}
                      </span>
                      <PriorityBadge priority={alert.priority} />
                    </div>
                  </div>
                </div>
                <div>
                  <Button size="sm" variant="outline" className="mr-2 hover:border-blue-300 transition-colors">
                    Contacter
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-colors">Traiter</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
            Voir toutes les alertes
          </Button>
        </CardFooter>
      </Card>

      <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
        <CardHeader>
          <CardTitle>Rapport de campagnes</CardTitle>
          <CardDescription>
            Effets des campagnes sur les alertes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group">
              <h3 className="font-medium group-hover:text-blue-600 transition-colors">Campagne "Retour aux inactifs"</h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Campagne d'email aux clients inactifs depuis 3+ mois
                  </p>
                  <p className="text-sm font-medium mt-1">
                    18 contacts rétablis sur 30 emails envoyés
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-500">60%</span>
                  <p className="text-xs text-muted-foreground">Taux de réussite</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group">
              <h3 className="font-medium group-hover:text-blue-600 transition-colors">Campagne "Complétion KYC"</h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Rappels pour compléter les informations de profil
                  </p>
                  <p className="text-sm font-medium mt-1">
                    12 profils complétés sur 25 rappels envoyés
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-500">48%</span>
                  <p className="text-xs text-muted-foreground">Taux de réussite</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
