import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, FileText, Lock, Bell, Shield, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { toast } = useToast();

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations personnelles ont été mises à jour avec succès.',
    });
  };

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Mot de passe modifié',
      description: 'Votre mot de passe a été changé avec succès.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Mon Profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-0">
              <div className="flex flex-col divide-y">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-eparnova-blue flex items-center justify-center text-white text-xl font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-medium">Sophie Dubois</div>
                    <div className="text-xs text-muted-foreground">sophie.dubois@example.com</div>
                  </div>
                </div>
                <a className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Informations personnelles</span>
                </a>
                <a className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Préférences</span>
                </a>
                <a className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </a>
                <a className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <Lock className="h-4 w-4" />
                  <span>Sécurité</span>
                </a>
                <a className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </a>
                <a className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <Shield className="h-4 w-4" />
                  <span>Confidentialité</span>
                </a>
                <a className="p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Modifiez vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" defaultValue="Sophie" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" defaultValue="Dubois" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="sophie.dubois@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" type="tel" defaultValue="06 12 34 56 78" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" defaultValue="15 rue des Lilas" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input id="postalCode" defaultValue="75015" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" defaultValue="Paris" />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Enregistrer les modifications</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Gérez votre mot de passe et la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Modifier le mot de passe</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Configurez comment et quand vous souhaitez être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 text-center text-muted-foreground">
                    Préférences de notification (à implémenter)
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Mes documents</CardTitle>
                  <CardDescription>Accédez à tous vos documents EPARNOVA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 text-center text-muted-foreground">
                    Gestionnaire de documents (à implémenter)
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
