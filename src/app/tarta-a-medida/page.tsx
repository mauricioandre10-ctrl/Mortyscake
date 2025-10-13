'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link';

// Esquema de validación del formulario
const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  phone: z.string().optional(),
  delivery_date: z.date({ required_error: "La fecha de entrega es obligatoria." }),
  servings: z.string().min(1, { message: "Selecciona una cantidad de raciones." }),
  event_type: z.string().min(1, { message: "Selecciona el tipo de evento." }),
  cake_flavor: z.string().min(1, { message: "Selecciona un sabor de bizcocho." }),
  filling_flavor: z.string().min(1, { message: "Selecciona un sabor de relleno." }),
  cake_description: z.string().min(20, { message: "Describe tu tarta con un poco más de detalle (mín. 20 caracteres)." }),
  cake_text: z.string().optional(),
  reference_image: z.any().optional(),
  allergies: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Opciones para los campos de selección
const servingsOptions = ["4-6 raciones", "6-8 raciones", "10-12 raciones", "15-20 raciones", "25-30 raciones", "Más de 30"];
const eventOptions = ["Cumpleaños", "Boda", "Aniversario", "Bautizo", "Comunión", "Evento Corporativo", "Otro"];
const cakeFlavorOptions = ["Vainilla", "Chocolate Intenso", "Red Velvet", "Limón y Amapolas", "Zanahoria y Especias", "Naranja y Almendra", "Otro (especificar en descripción)"];
const fillingOptions = ["Crema de queso", "Ganache de chocolate negro", "Ganache de chocolate blanco", "Crema de vainilla", "Dulce de leche", "Crema de pistacho", "Mermelada de frutos rojos", "Otro (especificar en descripción)"];

export default function TartaAMedidaPage() {
  const [formState, setFormState] = useState<{ status: 'idle' | 'loading' | 'success' | 'error', message: string }>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      servings: "",
      event_type: "",
      cake_flavor: "",
      filling_flavor: "",
      cake_description: "",
      cake_text: "",
      allergies: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      setFormState({ status: 'loading', message: '' });
      // La lógica de envío ahora se manejará con una Server Action que enviará un email.
      // Esta es una simulación del comportamiento esperado. La implementación real se hará en el backend.
      console.log("Simulando envío de formulario por email...", data);

      // Simulación de éxito después de 2 segundos.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFormState({ status: 'success', message: '¡Tu solicitud ha sido enviada con éxito! Nos pondremos en contacto contigo pronto.' });
      form.reset();

      // En un caso de error, el estado se actualizaría así:
      // setFormState({ status: 'error', message: 'Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.' });
    });
  };

  if (formState.status === 'success') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 max-w-2xl text-center">
         <Alert className="border-green-500 bg-green-50 text-green-900">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="font-bold">¡Solicitud Recibida!</AlertTitle>
          <AlertDescription>
            {formState.message} Revisaremos los detalles y me pondré en contacto contigo en las próximas 24 horas para darte un presupuesto y finalizar el diseño.
          </AlertDescription>
        </Alert>
         <Button asChild className="mt-8">
            <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl">Diseña tu Tarta a Medida</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Cuéntanos tu idea y la haremos realidad. Rellena este formulario para que podamos empezar a crear la tarta perfecta para tu celebración.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          
          <div className="space-y-4">
              <h2 className="text-2xl font-card-title border-b pb-2">1. Información de Contacto</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nombre *</FormLabel><FormControl><Input placeholder="Tu nombre y apellidos" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="tu.email@ejemplo.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Teléfono / WhatsApp (Opcional)</FormLabel><FormControl><Input placeholder="612 345 678" {...field} /></FormControl><FormDescription>Lo usaremos para contactarte más rápido si es necesario.</FormDescription><FormMessage /></FormItem>
              )} />
          </div>

          <div className="space-y-4">
              <h2 className="text-2xl font-card-title border-b pb-2">2. Detalles del Evento</h2>
              <div className="grid md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="delivery_date" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Fecha de entrega *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}/>
                        </PopoverContent>
                      </Popover>
                    <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="servings" render={({ field }) => (
                    <FormItem><FormLabel>Número de raciones *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona una opción" /></SelectTrigger></FormControl>
                            <SelectContent>{servingsOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                  )} />
              </div>
              <FormField control={form.control} name="event_type" render={({ field }) => (
                <FormItem><FormLabel>Tipo de evento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona el tipo de celebración" /></SelectTrigger></FormControl>
                        <SelectContent>{eventOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                <FormMessage /></FormItem>
              )} />
          </div>

          <div className="space-y-4">
              <h2 className="text-2xl font-card-title border-b pb-2">3. El Sabor de tus Sueños</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="cake_flavor" render={({ field }) => (
                    <FormItem><FormLabel>Sabor del bizcocho *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Elige un sabor" /></SelectTrigger></FormControl>
                            <SelectContent>{cakeFlavorOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                  )} />
                <FormField control={form.control} name="filling_flavor" render={({ field }) => (
                    <FormItem><FormLabel>Sabor del relleno *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Elige un sabor" /></SelectTrigger></FormControl>
                            <SelectContent>{fillingOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                  )} />
              </div>
          </div>

          <div className="space-y-4">
              <h2 className="text-2xl font-card-title border-b pb-2">4. Tu Visión Creativa</h2>
              <FormField control={form.control} name="cake_description" render={({ field }) => (
                <FormItem><FormLabel>Describe tu tarta ideal *</FormLabel><FormControl><Textarea placeholder="Cuéntanos la temática, colores, estilo, y cualquier detalle que imagines..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cake_text" render={({ field }) => (
                <FormItem><FormLabel>Texto en la tarta (Opcional)</FormLabel><FormControl><Input placeholder="Ej: ¡Felicidades, Ana!" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reference_image" render={({ field }) => (
                <FormItem><FormLabel>Imagen de referencia (Opcional)</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg, image/webp" {...form.register('reference_image')} /></FormControl><FormDescription>Sube una foto que te sirva de inspiración. (Max 2MB)</FormDescription><FormMessage /></FormItem>
              )} />
          </div>

          <div className="space-y-4">
             <h2 className="text-2xl font-card-title border-b pb-2">5. Información Adicional</h2>
              <FormField control={form.control} name="allergies" render={({ field }) => (
                <FormItem><FormLabel>Alergias o intolerancias (Opcional)</FormLabel><FormControl><Textarea placeholder="Indica aquí si necesitas que la tarta sea sin gluten, sin lactosa, etc." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </div>

          {formState.status === 'error' && (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formState.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Solicitud de Presupuesto
          </Button>

        </form>
      </Form>
    </div>
  );
}
