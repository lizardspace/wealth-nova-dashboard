
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Phone, MapPin, User, CalendarPlus, FileText, PiggyBank, Home } from 'lucide-react';

const AppointmentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Rendez-vous</h1>
        <p className="text-muted-foreground mt-1">Planifiez une consultation avec votre conseiller financier</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-eparnova-blue" />
                Prochains rendez-vous
              </CardTitle>
              <CardDescription>Consultations à venir avec votre conseiller</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md hover:bg-muted/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-base">Bilan patrimonial</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>15 mai 2025</span>
                        <Clock className="h-4 w-4 ml-4 mr-1" />
                        <span>14:30</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <User className="h-4 w-4 mr-1 text-eparnova-blue-light" />
                        <span className="text-sm">Marc Dupont, Conseiller senior</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Video className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Visioconférence</span>
                    </div>
                  </div>
                  <div className="flex mt-4 justify-end gap-2">
                    <Button size="sm" variant="outline">Reprogrammer</Button>
                    <Button size="sm" variant="default">Rejoindre</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md hover:bg-muted/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-base">Consultation investissement</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>28 mai 2025</span>
                        <Clock className="h-4 w-4 ml-4 mr-1" />
                        <span>10:00</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <User className="h-4 w-4 mr-1 text-eparnova-blue-light" />
                        <span className="text-sm">Julie Martin, Experte investissements</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">Téléphone</span>
                    </div>
                  </div>
                  <div className="flex mt-4 justify-end gap-2">
                    <Button size="sm" variant="outline">Reprogrammer</Button>
                    <Button size="sm" variant="default">Confirmer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarPlus className="h-5 w-5 text-eparnova-blue" />
                Nouveau rendez-vous
              </CardTitle>
              <CardDescription>Sélectionnez le type de consultation dont vous avez besoin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-3 text-center cursor-pointer hover:border-eparnova-blue transition-colors">
                  <div className="w-12 h-12 bg-eparnova-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-eparnova-blue" />
                  </div>
                  <h3 className="font-medium">Bilan patrimonial</h3>
                  <p className="text-xs text-muted-foreground mt-1">Analyse complète de votre situation</p>
                </div>
                
                <div className="border rounded-md p-3 text-center cursor-pointer hover:border-eparnova-blue transition-colors">
                  <div className="w-12 h-12 bg-eparnova-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PiggyBank className="h-6 w-6 text-eparnova-green" />
                  </div>
                  <h3 className="font-medium">Conseil en investissement</h3>
                  <p className="text-xs text-muted-foreground mt-1">Stratégies de placement adaptées</p>
                </div>
                
                <div className="border rounded-md p-3 text-center cursor-pointer hover:border-eparnova-blue transition-colors">
                  <div className="w-12 h-12 bg-eparnova-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Home className="h-6 w-6 text-eparnova-gold" />
                  </div>
                  <h3 className="font-medium">Projet immobilier</h3>
                  <p className="text-xs text-muted-foreground mt-1">Financement et optimisation fiscale</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vos conseillers</CardTitle>
              <CardDescription>L'équipe à votre service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">MD</span>
                  </div>
                  <div>
                    <div className="font-medium">Marc Dupont</div>
                    <div className="text-xs text-muted-foreground">Conseiller senior</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">JM</span>
                  </div>
                  <div>
                    <div className="font-medium">Julie Martin</div>
                    <div className="text-xs text-muted-foreground">Experte investissements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agences physiques</CardTitle>
              <CardDescription>Pour une consultation en personne</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">EPARNOVA Paris</div>
                  <div className="text-sm flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-eparnova-blue" />
                    <span>25 rue de la Paix, 75002 Paris</span>
                  </div>
                  <Button variant="outline" size="sm">Prendre RDV</Button>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">EPARNOVA Lyon</div>
                  <div className="text-sm flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-eparnova-blue" />
                    <span>15 rue de la République, 69002 Lyon</span>
                  </div>
                  <Button variant="outline" size="sm">Prendre RDV</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
