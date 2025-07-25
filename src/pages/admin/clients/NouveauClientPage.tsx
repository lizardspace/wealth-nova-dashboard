
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

// Schéma de validation
const formSchema = z.object({
  // Informations Personnelles
  civilite: z.string().min(1, { message: "Veuillez sélectionner une civilité" }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  dateNaissance: z.string().min(1, { message: "Veuillez saisir une date de naissance" }),
  email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
  telephone: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1000000000, { message: "Veuillez saisir un numéro de téléphone valide" })
  ),
  
  // Adresse
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  codePostal: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(10000, { message: "Veuillez saisir un code postal valide" })
  ),
  ville: z.string().min(2, { message: "Veuillez saisir une ville" }),
  
  // Situation
  situationFamiliale: z.string().min(1, { message: "Veuillez sélectionner une situation familiale" }),
  nombreEnfants: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0, { message: "Veuillez indiquer le nombre d'enfants" })
  ),
  profession: z.string().min(2, { message: "Veuillez indiquer votre profession" }),
  
  // Informations financières
  revenuAnnuel: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, { message: "Le revenu annuel doit être un nombre positif" })
  ),
  estimation_patrimoine_foyer_precise: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, { message: "Le patrimoine estimé doit être un nombre positif" })
  )
});

const NouveauClientPage = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      civilite: "",
      nom: "",
      prenom: "",
      dateNaissance: "",
      email: "",
      telephone: "",
      adresse: "",
      codePostal: "",
      ville: "",
      situationFamiliale: "",
      nombreEnfants: 0,
      profession: "",
      revenuAnnuel: 0,
      estimation_patrimoine_foyer_precise: 0
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    try {
      // Étape 1: Insérer dans la table 'users'
      console.log("Étape 1: Insertion dans la table 'users'");
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            first_name: values.prenom,
            last_name: values.nom,
            email: values.email,
            civilite: values.civilite,
            date_naissance: values.dateNaissance,
          },
        ])
        .select();

      if (userError) {
        console.error("Erreur lors de l'insertion dans 'users':", userError);
        throw userError;
      }
      if (!userData) throw new Error("La création de l'utilisateur a échoué.");
      console.log("User data:", userData);
      const userId = userData[0].id;

      // Étape 2: Insérer dans la table 'souscription_formulaire_souscripteur'
      console.log("Étape 2: Insertion dans la table 'souscription_formulaire_souscripteur'");
      const { data: souscripteurData, error: souscripteurError } = await supabase
        .from('souscription_formulaire_souscripteur')
        .insert([
          {
            user_id: userId,
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            telephone: values.telephone,
            adresse_postale: values.adresse,
            code_postal: values.codePostal,
            ville: values.ville,
            date_naissance: values.dateNaissance,
            situation_familiale: values.situationFamiliale,
            profession: values.profession,
          },
        ])
        .select();

      if (souscripteurError) {
        console.error("Erreur lors de l'insertion dans 'souscription_formulaire_souscripteur':", souscripteurError);
        throw souscripteurError;
      }
      if (!souscripteurData) throw new Error("La création du souscripteur a échoué.");
      console.log("Souscripteur data:", souscripteurData);
      const souscripteurId = souscripteurData[0].id;

      // Étape 3: Insérer dans la table 'souscription_formulaire_subscription'
      console.log("Étape 3: Insertion dans la table 'souscription_formulaire_subscription'");
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('souscription_formulaire_subscription')
        .insert([
          {
            user_id: userId,
            souscripteur_id: souscripteurId,
          },
        ])
        .select();

      if (subscriptionError) {
        console.error("Erreur lors de l'insertion dans 'souscription_formulaire_subscription':", subscriptionError);
        throw subscriptionError;
      }
      if (!subscriptionData) throw new Error("La création de la souscription a échoué.");
      console.log("Subscription data:", subscriptionData);
      const subscriptionId = subscriptionData[0].id;

      // Étape 4: Insérer dans la table 'souscription_formulaire_financialdata'
      console.log("Étape 4: Insertion dans la table 'souscription_formulaire_financialdata'");
      const { error: financialDataError } = await supabase
        .from('souscription_formulaire_financialdata')
        .insert([
          {
            user_id: userId,
            subscription_id: subscriptionId,
            revenus_annuels_foyer_precise: values.revenuAnnuel,
            estimation_patrimoine_foyer_precise: values.estimation_patrimoine_foyer_precise,
          },
        ]);

      if (financialDataError) {
        console.error("Erreur lors de l'insertion dans 'souscription_formulaire_financialdata':", financialDataError);
        throw financialDataError;
      }
      console.log("Financial data inserted successfully.");

      // Étape 5: Insérer dans la table 'personalinfo'
      console.log("Étape 5: Insertion dans la table 'personalinfo'");
      const { error: personalInfoError } = await supabase
        .from('personalinfo')
        .insert([
          {
            user_id: userId,
            phone: values.telephone,
            address: values.adresse,
            postal_code: values.codePostal,
            city: values.ville,
            situation_matrimoniale: values.situationFamiliale,
            nb_enfants_charge: values.nombreEnfants,
            profession: values.profession,
            revenu_annuel: values.revenuAnnuel,
            capacite_epargne: 0, // Valeur par défaut
            epargne_precaution: 0, // Valeur par défaut
          },
        ]);

      if (personalInfoError) {
        console.error("Erreur lors de l'insertion dans 'personalinfo':", personalInfoError);
        throw personalInfoError;
      }
      console.log("Personal info inserted successfully.");

      toast({
        title: "Client créé avec succès",
        description: `${values.prenom} ${values.nom} a été ajouté à la base de données.`,
      });
      form.reset(); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast({
        title: "Erreur lors de la création",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
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
                  <CardDescription>
                    Saisissez les informations de base du client.
                  </CardDescription>
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
                              <SelectItem value="M.">Monsieur</SelectItem>
                              <SelectItem value="Mme">Madame</SelectItem>
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
                  <CardDescription>
                    Saisissez l'adresse complète du client.
                  </CardDescription>
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
                          <FormDescription>
                            Revenu annuel net avant impôts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimation_patrimoine_foyer_precise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patrimoine estimé (€)</FormLabel>
                          <FormControl>
                            <Input placeholder="Patrimoine estimé" type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Estimation globale du patrimoine
                          </FormDescription>
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
