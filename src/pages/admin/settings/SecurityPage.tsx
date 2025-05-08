// src/pages/admin/settings/SecurityPage.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { accessLogColumns, AccessLog } from './accessLogColumns';

const dummyAccessLogs: AccessLog[] = [
  {
    id: '1',
    userName: 'Jean Dupont',
    ipAddress: '192.168.1.1',
    timestamp: '2023-11-15 14:32:45',
    action: 'Connexion',
    status: 'Réussi',
    device: 'Chrome / Windows',
  },
  {
    id: '2',
    userName: 'Marie Martin',
    ipAddress: '192.168.1.2',
    timestamp: '2023-11-15 13:21:15',
    action: 'Connexion',
    status: 'Réussi',
    device: 'Safari / MacOS',
  },
  {
    id: '3',
    userName: 'Jean Dupont',
    ipAddress: '192.168.1.3',
    timestamp: '2023-11-15 10:45:30',
    action: 'Connexion',
    status: 'Échec',
    device: 'Firefox / Windows',
  },
  {
    id: '4',
    userName: 'Sophie Bernard',
    ipAddress: '192.168.1.4',
    timestamp: '2023-11-14 17:38:22',
    action: 'Déconnexion',
    status: 'Réussi',
    device: 'Chrome / Android',
  },
  {
    id: '5',
    userName: 'Thomas Petit',
    ipAddress: '192.168.1.5',
    timestamp: '2023-11-14 16:12:05',
    action: 'Connexion',
    status: 'Réussi',
    device: 'Edge / Windows',
  },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres de sécurité</h1>
        <Button>Enregistrer les modifications</Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="authentication">Authentification</TabsTrigger>
          <TabsTrigger value="data-protection">Protection des données</TabsTrigger>
          <TabsTrigger value="access-logs">Journal de connexion</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Politique de sécurité globale</CardTitle>
              </div>
              <CardDescription>Configuration des paramètres généraux de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="session-timeout" defaultChecked />
                  <Label htmlFor="session-timeout">Expiration de session après inactivité</Label>
                </div>
                <div className="flex items-center space-x-2 pl-6">
                  <Label htmlFor="timeout-minutes">Durée (minutes):</Label>
                  <Input id="timeout-minutes" className="w-20" type="number" defaultValue="30" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ip-restriction" />
                  <Label htmlFor="ip-restriction">Restriction par adresse IP</Label>
                </div>
                <div className="flex items-center space-x-2 pl-6">
                  <Label htmlFor="allowed-ips">Adresses IP autorisées:</Label>
                  <Input id="allowed-ips" placeholder="Ex: 192.168.1.1, 10.0.0.1" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="login-notification" defaultChecked />
                  <Label htmlFor="login-notification">Notification de connexion (email)</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="suspicious-activity" defaultChecked />
                  <Label htmlFor="suspicious-activity">Alertes d'activités suspectes</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <CardTitle>Surveillance et alerte</CardTitle>
              </div>
              <CardDescription>Configuration des alertes de sécurité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Alerter les administrateurs en cas de:</Label>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alert-login-failures" defaultChecked />
                      <Label htmlFor="alert-login-failures">Échecs de connexion multiples</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alert-api-abuse" defaultChecked />
                      <Label htmlFor="alert-api-abuse">Utilisation abusive de l'API</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alert-data-export" defaultChecked />
                      <Label htmlFor="alert-data-export">Export massif de données</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alert-unusual-login" defaultChecked />
                      <Label htmlFor="alert-unusual-login">
                        Connexion depuis un nouvel appareil
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-email">Email pour les alertes:</Label>
                  <Input id="alert-email" type="email" placeholder="securite@eparnova.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Politique de mot de passe</CardTitle>
              </div>
              <CardDescription>
                Configurez les exigences pour les mots de passe utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pwd-complexity" defaultChecked />
                  <Label htmlFor="pwd-complexity">Exiger des mots de passe complexes</Label>
                </div>

                <div className="space-y-2 pl-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pwd-uppercase" defaultChecked />
                    <Label htmlFor="pwd-uppercase">Au moins une majuscule</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pwd-number" defaultChecked />
                    <Label htmlFor="pwd-number">Au moins un chiffre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pwd-special" defaultChecked />
                    <Label htmlFor="pwd-special">Au moins un caractère spécial</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="pwd-length">Longueur minimale:</Label>
                    <Input id="pwd-length" className="w-20" type="number" defaultValue="8" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pwd-expiration" />
                  <Label htmlFor="pwd-expiration">Expiration des mots de passe</Label>
                </div>
                <div className="flex items-center space-x-4 pl-6">
                  <Label htmlFor="pwd-days">Tous les</Label>
                  <Input id="pwd-days" className="w-20" type="number" defaultValue="90" />
                  <Label htmlFor="pwd-days">jours</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pwd-history" defaultChecked />
                  <Label htmlFor="pwd-history">Historique des mots de passe</Label>
                </div>
                <div className="flex items-center space-x-4 pl-6">
                  <Label htmlFor="pwd-previous">Ne pas réutiliser les</Label>
                  <Input id="pwd-previous" className="w-20" type="number" defaultValue="5" />
                  <Label htmlFor="pwd-previous">derniers mots de passe</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Authentification à deux facteurs (2FA)</CardTitle>
              </div>
              <CardDescription>Configurez la vérification en deux étapes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="2fa-enabled" defaultChecked />
                  <Label htmlFor="2fa-enabled">Activer l'authentification à deux facteurs</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Méthodes disponibles:</Label>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="2fa-app" defaultChecked />
                    <Label htmlFor="2fa-app">Application d'authentification (TOTP)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="2fa-sms" defaultChecked />
                    <Label htmlFor="2fa-sms">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="2fa-email" />
                    <Label htmlFor="2fa-email">Email</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="2fa-required" />
                  <Label htmlFor="2fa-required">
                    Rendre obligatoire pour tous les utilisateurs
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-protection" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Protection des données</CardTitle>
              </div>
              <CardDescription>Paramètres de chiffrement et de confidentialité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="data-encryption" defaultChecked />
                  <Label htmlFor="data-encryption">Chiffrement des données sensibles</Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  Les données personnelles et financières sont stockées avec chiffrement AES-256.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="data-backup" defaultChecked />
                  <Label htmlFor="data-backup">Sauvegarde automatique des données</Label>
                </div>
                <div className="flex items-center space-x-2 pl-6">
                  <Label htmlFor="backup-frequency">Fréquence:</Label>
                  <Input id="backup-frequency" className="w-32" defaultValue="Quotidienne" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="data-retention" defaultChecked />
                  <Label htmlFor="data-retention">Politique de rétention des données</Label>
                </div>
                <div className="flex items-center space-x-2 pl-6">
                  <Label htmlFor="retention-period">Période de conservation:</Label>
                  <Input id="retention-period" className="w-20" type="number" defaultValue="60" />
                  <Label htmlFor="retention-period">mois</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="anonymization" />
                  <Label htmlFor="anonymization">Anonymisation des données inactives</Label>
                </div>
                <div className="flex items-center space-x-2 pl-6">
                  <Label htmlFor="anonymization-period">Après</Label>
                  <Input
                    id="anonymization-period"
                    className="w-20"
                    type="number"
                    defaultValue="24"
                  />
                  <Label htmlFor="anonymization-period">mois d'inactivité</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conformité RGPD</CardTitle>
              <CardDescription>Paramètres liés à la conformité réglementaire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="privacy-policy" defaultChecked />
                  <Label htmlFor="privacy-policy">Afficher la politique de confidentialité</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="cookie-consent" defaultChecked />
                  <Label htmlFor="cookie-consent">Demander le consentement pour les cookies</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="data-portability" defaultChecked />
                  <Label htmlFor="data-portability">
                    Activer l'exportation des données utilisateurs
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="right-to-forget" defaultChecked />
                  <Label htmlFor="right-to-forget">
                    Permettre la suppression de compte (droit à l'oubli)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal des connexions</CardTitle>
              <CardDescription>Historique des accès à la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={accessLogColumns} data={dummyAccessLogs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
