// src/pages/admin/settings/RolesPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { columns, User } from './rolesColumns';

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'Admin',
    status: 'Actif',
    lastLogin: '2023-11-15 14:32',
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    role: 'Conseiller',
    status: 'Actif',
    lastLogin: '2023-11-14 09:45',
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    role: 'Assistant',
    status: 'Inactif',
    lastLogin: '2023-10-30 16:20',
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.com',
    role: 'Conseiller',
    status: 'Actif',
    lastLogin: '2023-11-15 11:10',
  },
  {
    id: '5',
    name: 'Thomas Petit',
    email: 'thomas.petit@example.com',
    role: 'Lecture seule',
    status: 'Actif',
    lastLogin: '2023-11-13 17:05',
  },
];

export default function RolesPage() {
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);

  const activeUsers = dummyUsers.filter(user => user.status === 'Actif');
  const inactiveUsers = dummyUsers.filter(user => user.status === 'Inactif');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(true)}>
            Nouveau rôle
          </Button>
          <Button onClick={() => setIsNewUserDialogOpen(true)}>Nouvel utilisateur</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous ({dummyUsers.length})</TabsTrigger>
          <TabsTrigger value="active">Actifs ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs ({inactiveUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={dummyUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={activeUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs inactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={inactiveUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Nouveau utilisateur dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Créez un compte utilisateur pour accéder à la plateforme
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input id="name" placeholder="Nom complet" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rôle
              </Label>
              <Input id="role" placeholder="Sélectionnez un rôle" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label>Statut</Label>
              </div>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox id="active" />
                <Label htmlFor="active">Actif</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button>Créer l'utilisateur</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nouveau rôle dialog */}
      <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau rôle</DialogTitle>
            <DialogDescription>
              Définissez un nouveau rôle avec des permissions spécifiques
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Nom du rôle
              </Label>
              <Input id="roleName" placeholder="Ex: Conseiller Senior" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="space-y-2 col-span-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="p-read" />
                  <Label htmlFor="p-read">Lecture (clients, portefeuilles)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="p-write" />
                  <Label htmlFor="p-write">Écriture (modifier, créer)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="p-admin" />
                  <Label htmlFor="p-admin">Admin (paramètres, utilisateurs)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="p-ia" />
                  <Label htmlFor="p-ia">Accès IA (recommandations, scores)</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(false)}>
              Annuler
            </Button>
            <Button>Créer le rôle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
