
// src/pages/admin/settings/PlatformPage.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export default function PlatformPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres de la plateforme</h1>
        <Button>
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Configurez les informations de base de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input id="company-name" placeholder="EPARNOVA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">URL du site</Label>
                  <Input id="site-url" placeholder="https://www.eparnova.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email de support</Label>
                  <Input id="support-email" type="email" placeholder="support@eparnova.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+33 1 23 45 67 89" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="123 rue de la Finance" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Personnalisez le comportement général de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-logout" />
                  <Label htmlFor="auto-logout">Déconnexion automatique après inactivité</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="welcome-email" defaultChecked />
                  <Label htmlFor="welcome-email">Envoyer un email de bienvenue aux nouveaux clients</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-stats" defaultChecked />
                  <Label htmlFor="show-stats">Afficher les statistiques sur la page d'accueil</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Logo de l'entreprise</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Logo</div>
                  <Button variant="outline">Télécharger</Button>
                  <Button variant="outline">Supprimer</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon-upload">Favicon</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Fav</div>
                  <Button variant="outline">Télécharger</Button>
                  <Button variant="outline">Supprimer</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Couleur principale</Label>
                  <div className="flex space-x-2">
                    <Input id="primary-color" type="color" className="w-12 h-10" />
                    <Input id="primary-color-hex" placeholder="#000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Couleur secondaire</Label>
                  <div className="flex space-x-2">
                    <Input id="secondary-color" type="color" className="w-12 h-10" />
                    <Input id="secondary-color-hex" placeholder="#FFFFFF" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurez les notifications envoyées aux utilisateurs et clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications clients</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-recommendations" defaultChecked />
                      <Label htmlFor="notify-recommendations">Nouvelles recommandations</Label>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox id="rec-email" defaultChecked />
                        <Label htmlFor="rec-email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox id="rec-sms" />
                        <Label htmlFor="rec-sms">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox id="rec-app" defaultChecked />
                        <Label htmlFor="rec-app">App</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-appointments" defaultChecked />
                      <Label htmlFor="notify-appointments">Rendez-vous</Label>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox id="app-email" defaultChecked />
                        <Label htmlFor="app-email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox id="app-sms" defaultChecked />
                        <Label htmlFor="app-sms">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox id="app-app" defaultChecked />
                        <Label htmlFor="app-app">App</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-documents" defaultChecked />
                      <Label htmlFor="notify-documents">Documents à signer</Label>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox id="doc-email" defaultChecked />
                        <Label htmlFor="doc-email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox id="doc-sms" />
                        <Label htmlFor="doc-sms">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox id="doc-app" defaultChecked />
                        <Label htmlFor="doc-app">App</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium pt-4">Notifications administrateurs</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-new-client" defaultChecked />
                    <Label htmlFor="notify-new-client">Nouveau client inscrit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-product" defaultChecked />
                    <Label htmlFor="notify-product">Nouvelle souscription produit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-support" defaultChecked />
                    <Label htmlFor="notify-support">Demande de support</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Connectez votre plateforme à des services externes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">API de paiement</h3>
                    <p className="text-sm text-muted-foreground">Intégrez une solution de paiement</p>
                  </div>
                  <Button variant="outline">Configurer</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Google Analytics</h3>
                    <p className="text-sm text-muted-foreground">Suivez les statistiques d'utilisation</p>
                  </div>
                  <Button variant="outline">Configurer</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">CRM</h3>
                    <p className="text-sm text-muted-foreground">Connectez votre CRM existant</p>
                  </div>
                  <Button variant="outline">Configurer</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Service d'emailing</h3>
                    <p className="text-sm text-muted-foreground">Intégrez un service d'envoi d'emails</p>
                  </div>
                  <Button variant="outline">Configurer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
