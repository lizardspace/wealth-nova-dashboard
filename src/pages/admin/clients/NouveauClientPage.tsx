
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
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
import { 
  User, 
  MapPin, 
  Heart, 
  DollarSign, 
  UserPlus, 
  ArrowLeft, 
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Home,
  Briefcase
} from 'lucide-react';

// Schéma de validation
const formSchema = z.object({
  // Informations Personnelles
  civilite: z.string().min(1, { message: "Veuillez sélectionner une civilité" }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  dateNaissance: z.string().min(1, { message: "Veuillez saisir une date de naissance" }),
  email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
  telephone: z.string().min(10, { message: "Veuillez saisir un numéro de téléphone valide" }),
  
  // Adresse
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  codePostal: z.string().min(5, { message: "Veuillez saisir un code postal valide" }),
  ville: z.string().min(2, { message: "Veuillez saisir une ville" }),
  
  // Situation
  situationFamiliale: z.string().min(1, { message: "Veuillez sélectionner une situation familiale" }),
  nombreEnfants: z.string().min(1, { message: "Veuillez indiquer le nombre d'enfants" }),
  profession: z.string().min(2, { message: "Veuillez indiquer votre profession" }),
  
  // Informations financières
  revenuAnnuel: z.string().min(1, { message: "Veuillez saisir un revenu annuel" }),
  estimation_patrimoine_foyer_precise: z.string().min(1, { message: "Veuillez saisir un patrimoine estimé" })
});

const NouveauClientPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("personnel");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

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
      nombreEnfants: "0",
      profession: "",
      revenuAnnuel: "",
      estimation_patrimoine_foyer_precise: ""
    }
  });

  // Helper function to mark step as completed
  const markStepCompleted = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  // Validate current step
  const validateCurrentStep = async () => {
    const fieldsToValidate = {
      personnel: ['civilite', 'nom', 'prenom', 'dateNaissance', 'email', 'telephone'],
      adresse: ['adresse', 'codePostal', 'ville'],
      situation: ['situationFamiliale', 'nombreEnfants', 'profession'],
      finances: ['revenuAnnuel', 'estimation_patrimoine_foyer_precise']
    };

    const fields = fieldsToValidate[currentStep as keyof typeof fieldsToValidate];
    const isValid = await form.trigger(fields as any);
    
    if (isValid) {
      markStepCompleted(currentStep);
    }
    
    return isValid;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Enhanced transaction-like approach with better error handling
      console.log("Starting client creation process...");

      // Étape 1: Insérer dans la table 'users'
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            first_name: values.prenom,
            last_name: values.nom,
            email: values.email,
            civilite: values.civilite,
            date_naissance: values.dateNaissance,
            power: 0, // Default user level
            part_fiscale: 1 // Default value
          },
        ])
        .select();

      if (userError) throw new Error(`Erreur utilisateur: ${userError.message}`);
      if (!userData || userData.length === 0) throw new Error("Échec de création de l'utilisateur");
      
      const userId = userData[0].id;
      console.log("User created with ID:", userId);

      // Étape 2: Insérer dans personalinfo (table principale pour les infos client)
      const { error: personalInfoError } = await supabase
        .from('personalinfo')
        .insert([
          {
            user_id: userId,
            phone: values.telephone,
            address: values.adresse,
            postal_code: parseInt(values.codePostal) || 0,
            city: values.ville,
            situation_matrimoniale: values.situationFamiliale,
            nb_enfants_charge: parseInt(values.nombreEnfants) || 0,
            profession: values.profession,
            revenu_annuel: parseFloat(values.revenuAnnuel) || 0,
            capacite_epargne: 0,
            epargne_precaution: 0,
          },
        ]);

      if (personalInfoError) throw new Error(`Erreur informations personnelles: ${personalInfoError.message}`);

      // Étape 3: Insérer dans souscription_formulaire_souscripteur
      const { data: souscripteurData, error: souscripteurError } = await supabase
        .from('souscription_formulaire_souscripteur')
        .insert([
          {
            user_id: userId,
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            telephone: parseInt(values.telephone) || 0,
            adresse_postale: values.adresse,
            code_postal: parseInt(values.codePostal) || 0,
            ville: values.ville,
            date_naissance: values.dateNaissance,
            situation_familiale: values.situationFamiliale,
            profession: values.profession,
          },
        ])
        .select();

      if (souscripteurError) throw new Error(`Erreur souscripteur: ${souscripteurError.message}`);
      if (!souscripteurData || souscripteurData.length === 0) throw new Error("Échec de création du souscripteur");

      const souscripteurId = souscripteurData[0].id;

      // Étape 4: Créer la subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('souscription_formulaire_subscription')
        .insert([
          {
            user_id: userId,
            souscripteur_id: souscripteurId,
          },
        ])
        .select();

      if (subscriptionError) throw new Error(`Erreur souscription: ${subscriptionError.message}`);
      if (!subscriptionData || subscriptionData.length === 0) throw new Error("Échec de création de la souscription");

      const subscriptionId = subscriptionData[0].id;

      // Étape 5: Ajouter les données financières
      const { error: financialDataError } = await supabase
        .from('souscription_formulaire_financialdata')
        .insert([
          {
            user_id: userId,
            subscription_id: subscriptionId,
            revenus_annuels_foyer_precise: parseFloat(values.revenuAnnuel) || 0,
            estimation_patrimoine_foyer_precise: parseFloat(values.estimation_patrimoine_foyer_precise) || 0,
          },
        ]);

      if (financialDataError) throw new Error(`Erreur données financières: ${financialDataError.message}`);

      // Success notification with enhanced UX
      toast({
        title: "✅ Client créé avec succès!",
        description: `${values.prenom} ${values.nom} a été ajouté à la base de données avec toutes ses informations.`,
      });

      // Reset form and redirect after short delay
      setTimeout(() => {
        form.reset();
        setCompletedSteps([]);
        setCurrentStep("personnel");
        navigate('/admin/clients');
      }, 2000);

    } catch (error: any) {
      console.error("Client creation error:", error);
      toast({
        title: "❌ Erreur lors de la création",
        description: error.message || "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Modern Header with glassmorphism */}
      <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin/clients')}
              className="glass hover:glass-card transition-all duration-300 hover-lift"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
                Ajouter un nouveau client
              </h1>
              <p className="text-muted-foreground mt-1">Créez un profil client complet avec toutes les informations nécessaires</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <UserPlus className="h-8 w-8 text-eparnova-blue animate-float" />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 gradient-primary rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 gradient-success rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
            {/* Enhanced Tab Navigation */}
            <div className="glass-card p-2 rounded-2xl mb-8">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2">
                <TabsTrigger 
                  value="personnel" 
                  className={`glass hover:glass-card transition-all duration-300 data-[state=active]:gradient-primary data-[state=active]:text-white relative ${
                    completedSteps.includes('personnel') ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Personnel</span>
                    {completedSteps.includes('personnel') && (
                      <CheckCircle className="h-4 w-4 text-green-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="adresse"
                  className={`glass hover:glass-card transition-all duration-300 data-[state=active]:gradient-primary data-[state=active]:text-white relative ${
                    completedSteps.includes('adresse') ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Adresse</span>
                    {completedSteps.includes('adresse') && (
                      <CheckCircle className="h-4 w-4 text-green-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="situation"
                  className={`glass hover:glass-card transition-all duration-300 data-[state=active]:gradient-primary data-[state=active]:text-white relative ${
                    completedSteps.includes('situation') ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">Situation</span>
                    {completedSteps.includes('situation') && (
                      <CheckCircle className="h-4 w-4 text-green-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="finances"
                  className={`glass hover:glass-card transition-all duration-300 data-[state=active]:gradient-primary data-[state=active]:text-white relative ${
                    completedSteps.includes('finances') ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Finances</span>
                    {completedSteps.includes('finances') && (
                      <CheckCircle className="h-4 w-4 text-green-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Onglet 1 : Informations personnelles */}
            <TabsContent value="personnel" className="animate-slide-in-right">
              <Card className="border-none relative overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 gradient-primary rounded-xl">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Informations personnelles</CardTitle>
                      <CardDescription className="text-base">
                        Saisissez les informations de base du client
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="civilite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Civilité</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass border-white/30 hover:border-white/50 transition-all duration-300">
                                <SelectValue placeholder="Sélectionnez une civilité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-card border-white/20">
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
                          <FormLabel className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Nom</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nom de famille" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
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
                          <FormLabel className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Prénom</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Prénom" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Date de naissance</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
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
                          <FormLabel className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="email@exemple.com" 
                              type="email" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
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
                          <FormLabel className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Téléphone</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="06 12 34 56 78" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Next Step Button */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="button"
                      onClick={async () => {
                        const isValid = await validateCurrentStep();
                        if (isValid) setCurrentStep("adresse");
                      }}
                      className="gradient-primary text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Suivant: Adresse
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet 2 : Adresse */}
            <TabsContent value="adresse" className="animate-slide-in-right">
              <Card className="border-none relative overflow-hidden">
                <div className="absolute inset-0 gradient-success opacity-5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 gradient-success rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Adresse du client</CardTitle>
                      <CardDescription className="text-base">
                        Informations de localisation et de contact
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <FormField
                    control={form.control}
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Home className="h-4 w-4" />
                          <span>Adresse complète</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Numéro et nom de rue" 
                            className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="codePostal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Code postal</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="75001" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
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
                          <FormLabel className="flex items-center space-x-2">
                            <Home className="h-4 w-4" />
                            <span>Ville</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Paris" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("personnel")}
                      className="glass border-white/30 hover:glass-card"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                    <Button 
                      type="button"
                      onClick={async () => {
                        const isValid = await validateCurrentStep();
                        if (isValid) setCurrentStep("situation");
                      }}
                      className="gradient-success text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Suivant: Situation
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet 3 : Situation */}
            <TabsContent value="situation" className="animate-slide-in-right">
              <Card className="border-none relative overflow-hidden">
                <div className="absolute inset-0 gradient-warning opacity-5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 gradient-warning rounded-xl">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Situation personnelle</CardTitle>
                      <CardDescription className="text-base">
                        Informations familiales et professionnelles
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="situationFamiliale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>Situation familiale</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass border-white/30 hover:border-white/50 transition-all duration-300">
                                <SelectValue placeholder="Sélectionnez une situation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-card border-white/20">
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
                          <FormLabel className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Nombre d'enfants</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass border-white/30 hover:border-white/50 transition-all duration-300">
                                <SelectValue placeholder="Sélectionnez un nombre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-card border-white/20">
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 ou plus</SelectItem>
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
                        <FormLabel className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>Profession</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingénieur, Médecin, Enseignant..." 
                            className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("adresse")}
                      className="glass border-white/30 hover:glass-card"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                    <Button 
                      type="button"
                      onClick={async () => {
                        const isValid = await validateCurrentStep();
                        if (isValid) setCurrentStep("finances");
                      }}
                      className="gradient-warning text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Suivant: Finances
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet 4 : Informations financières */}
            <TabsContent value="finances" className="animate-slide-in-right">
              <Card className="border-none relative overflow-hidden">
                <div className="absolute inset-0 gradient-gold opacity-5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 gradient-gold rounded-xl">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Informations financières</CardTitle>
                      <CardDescription className="text-base">
                        Situation financière et patrimoine du client
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="revenuAnnuel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Revenu annuel (€)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="45000" 
                              type="number" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-muted-foreground">
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
                          <FormLabel className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4" />
                            <span>Patrimoine estimé (€)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="150000" 
                              type="number" 
                              className="glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-muted-foreground">
                            Estimation globale du patrimoine
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Navigation and Submit */}
                  <div className="flex justify-between pt-6">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("situation")}
                      className="glass border-white/30 hover:glass-card"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="gradient-gold text-black hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Créer le client
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default NouveauClientPage;
