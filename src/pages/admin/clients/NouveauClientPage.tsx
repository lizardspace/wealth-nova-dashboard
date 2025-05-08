import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Schéma de validation
const formSchema = z.object({
  // Informations Personnelles
  civilite: z.string().min(1, { message: 'Veuillez sélectionner une civilité' }),
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  dateNaissance: z.string().min(1, { message: 'Veuillez saisir une date de naissance' }),
  email: z.string().email({ message: 'Veuillez saisir une adresse email valide' }),
  telephone: z.string().min(10, { message: 'Veuillez saisir un numéro de téléphone valide' }),

  // Adresse
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  codePostal: z.string().min(5, { message: 'Veuillez saisir un code postal valide' }),
  ville: z.string().min(2, { message: 'Veuillez saisir une ville' }),

  // Situation
  situationFamiliale: z
    .string()
    .min(1, { message: 'Veuillez sélectionner une situation familiale' }),
  nombreEnfants: z.string().min(1, { message: "Veuillez indiquer le nombre d'enfants" }),
  profession: z.string().min(2, { message: 'Veuillez indiquer votre profession' }),

  // Informations financières
  revenuAnnuel: z.string().min(1, { message: 'Veuillez saisir un revenu annuel' }),
  patrimoineEstime: z.string().min(1, { message: 'Veuillez saisir un patrimoine estimé' }),
});

const NouveauClientPage = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      civilite: '',
      nom: '',
      prenom: '',
      dateNaissance: '',
      email: '',
      telephone: '',
      adresse: '',
      codePostal: '',
      ville: '',
      situationFamiliale: '',
      nombreEnfants: '0',
      profession: '',
      revenuAnnuel: '',
      patrimoineEstime: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Client créé avec succès',
      description: `${values.prenom} ${values.nom} a été ajouté à la base de données.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ajouter un nouveau client</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="personnel" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personnel">Informations personnelles</TabsTrigger>
              <TabsTrigger value="adresse">Adresse</TabsTrigger>
              <TabsTrigger value="situation">Situation</TabsTrigger>
              <TabsTrigger value="finances">Informations financières</TabsTrigger>
            </TabsList>

            {/* Onglet 1 : Informations personnelles */}
            <TabsContent value="personnel">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Saisissez les informations de base du client.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="civilite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Civilité</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une civilité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monsieur">Monsieur</SelectItem>
                              <SelectItem value="madame">Madame</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prenom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemple.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="06 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet 2 : Adresse */}
            <TabsContent value="adresse">
              <Card>
                <CardHeader>
                  <CardTitle>Adresse</CardTitle>
                  <CardDescription>Saisissez l'adresse complète du client.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="codePostal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder="Code postal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ville"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet 3 : Situation */}
            <TabsContent value="situation">
              <Card>
                <CardHeader>
                  <CardTitle>Situation personnelle</CardTitle>
                  <CardDescription>
                    Informations sur la situation personnelle et professionnelle du client.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="situationFamiliale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situation familiale</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une situation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="celibataire">Célibataire</SelectItem>
                              <SelectItem value="marie">Marié(e)</SelectItem>
                              <SelectItem value="pacse">Pacsé(e)</SelectItem>
                              <SelectItem value="divorce">Divorcé(e)</SelectItem>
                              <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nombreEnfants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre d'enfants</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un nombre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5+">5 ou plus</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Profession" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet 4 : Informations financières */}
            <TabsContent value="finances">
              <Card>
                <CardHeader>
                  <CardTitle>Informations financières</CardTitle>
                  <CardDescription>
                    Saisissez les informations financières de base du client.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="revenuAnnuel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenu annuel (€)</FormLabel>
                          <FormControl>
                            <Input placeholder="Revenu annuel" type="number" {...field} />
                          </FormControl>
                          <FormDescription>Revenu annuel net avant impôts</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="patrimoineEstime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patrimoine estimé (€)</FormLabel>
                          <FormControl>
                            <Input placeholder="Patrimoine estimé" type="number" {...field} />
                          </FormControl>
                          <FormDescription>Estimation globale du patrimoine</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Créer le client</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default NouveauClientPage;
