
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, FileText, Users, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#3B82F6', '#10B981'];

const AlertesPage = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsByTypeData, setAlertsByTypeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase.from('alerts').select('*');
      if (error) {
        console.error('Error fetching alerts:', error);
      } else {
        setAlerts(data);
        const alertsByType = data.reduce((acc, alert) => {
          const existing = acc.find((item: any) => item.name === alert.type);
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: alert.type, value: 1 });
          }
          return acc;
        }, []);
        setAlertsByTypeData(alertsByType);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alertes & Opportunités</h1>
          <p className="text-muted-foreground">
            Suivi des opportunités commerciales prioritaires
          </p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" className="hover:border-blue-300 transition-colors">
            Gérer les relances
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
            <Bell className="mr-2 h-4 w-4" />
            Créer une alerte
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardDescription>Total alertes</CardDescription>
            <CardTitle className="text-2xl">{alerts.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-red-600 font-medium text-sm">
              <TrendingUp className="mr-1 h-4 w-4" />
              +12 depuis la semaine dernière
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardDescription>Alertes prioritaires</CardDescription>
            <CardTitle className="text-2xl">{alerts.filter(a => a.level === 'critique' || a.level === 'important').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Nécessitent une action immédiate
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardDescription>Relances effectuées</CardDescription>
            <CardTitle className="text-2xl">28</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-600 font-medium text-sm">
              <TrendingUp className="mr-1 h-4 w-4" />
              +8 cette semaine
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader className="pb-2">
            <CardDescription>Taux de conversion</CardDescription>
            <CardTitle className="text-2xl">32%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Des alertes vers des actions client
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
            <CardDescription>
              Types d'alertes actives
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {/* Augmenté la hauteur de 300px à 350px */}
            <ChartContainer config={{}}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                {/* Ajout des marges explicites */}
                <Pie
                  data={alertsByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  /* Augmenté le rayon du graphique */
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {alertsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
          <CardHeader>
            <CardTitle>Alertes critiques</CardTitle>
            <CardDescription>
              Opportunités à traiter en priorité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-50 border-red-200 hover:bg-red-100 transition-colors">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-700">Attention</AlertTitle>
              <AlertDescription className="text-red-600">
                {alerts.filter(a => a.type === 'Inactivité').length} clients sont inactifs depuis plus de 30 jours et nécessitent une relance urgente.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-amber-50 border-amber-200 hover:bg-amber-100 transition-colors">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Opportunités</AlertTitle>
              <AlertDescription className="text-amber-600">
                {alerts.filter(a => a.type === 'Profil incomplet').length} clients ont un profil incomplet, ce qui limite les recommandations IA et les opportunités commerciales.
              </AlertDescription>
            </Alert>

            <Alert className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
              <FileText className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Simulations</AlertTitle>
              <AlertDescription className="text-blue-600">
                18 simulations ont été réalisées sans action consécutive. Une relance pourrait convertir ces intérêts en souscriptions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-all border-slate-200 hover:border-blue-200">
        <CardHeader>
          <CardTitle>Liste des alertes prioritaires</CardTitle>
          <CardDescription>
            Opportunités commerciales à traiter rapidement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Niveau</th>
                  <th className="py-2 font-medium">Détail</th>
                  <th className="py-2 font-medium">Action recommandée</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-3">{alert.type}</td>
                    <td className="py-3 font-medium group-hover:text-blue-600 transition-colors">{alert.user_id}</td>
                    <td className="py-3">
                      <Badge className={
                        alert.level === "critique" ? "bg-red-500 hover:bg-red-600" :
                        alert.level === "important" ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"
                      }>
                        {alert.level}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {alert.message}
                    </td>
                    <td className="py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          alert.level === "critique" ? "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" :
                          "text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        }
                      >
                        {alert.level === 'critique' ? 'Relance' : 'Email'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertesPage;
