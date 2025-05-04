
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sliders, Plus, Filter, List, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentGrid } from '@/components/appointments/AppointmentGrid';

export default function PlanningPage() {
  const [viewType, setViewType] = useState<"list" | "grid">("list");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Planning des rendez-vous</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Sliders className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Left Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Conseiller</label>
                <Select defaultValue="tous">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un conseiller" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les conseillers</SelectItem>
                    <SelectItem value="dupont">Marie Dupont</SelectItem>
                    <SelectItem value="martin">Jean Martin</SelectItem>
                    <SelectItem value="bernard">Sophie Bernard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Visio
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Téléphone
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Présentiel
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    À venir
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Confirmé
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Annulé
                  </Badge>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Appliquer les filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Visioconférence</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Téléphone</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm">Présentiel</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-sm">À confirmer</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Rechercher un RDV ou un client..."
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-md flex">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewType === "list" ? "bg-white shadow" : ""}
                  onClick={() => setViewType("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewType === "grid" ? "bg-white shadow" : ""}
                  onClick={() => setViewType("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b px-4">
                <TabsList className="h-14 gap-4">
                  <TabsTrigger value="all" className="data-[state=active]:text-primary">
                    Tous les RDV
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:text-primary">
                    À venir
                  </TabsTrigger>
                  <TabsTrigger value="today" className="data-[state=active]:text-primary">
                    Aujourd'hui
                  </TabsTrigger>
                  <TabsTrigger value="week" className="data-[state=active]:text-primary">
                    Cette semaine
                  </TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:text-primary">
                    Ce mois
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : <AppointmentGrid />}
              </TabsContent>
              <TabsContent value="upcoming" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : <AppointmentGrid />}
              </TabsContent>
              <TabsContent value="today" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : <AppointmentGrid />}
              </TabsContent>
              <TabsContent value="week" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : <AppointmentGrid />}
              </TabsContent>
              <TabsContent value="month" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : <AppointmentGrid />}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
