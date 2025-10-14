'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, CalendarDays, Cake, Palette, Sparkles, Heart, Upload, FileCheck, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from './ui/calendar';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Por favor, introduce un email válido.'),
  phone: z.string().optional(),
  deliveryDate: z.date({
    required_error: 'La fecha de entrega es obligatoria.',
  }),
  servings: z.string().min(1, 'Debes seleccionar el número de raciones.'),
  eventType: z.string().min(1, 'Debes seleccionar el tipo de evento.'),
  otherEventType: z.string().optional(),
  cakeFlavor: z.string().min(1, 'Debes seleccionar un sabor de bizcocho.'),
  otherCakeFlavor: z.string().optional(),
  fillingFlavor1: z.string().min(1, 'Debes seleccionar al menos un sabor de relleno.'),
  otherFillingFlavor1: z.string().optional(),
  fillingFlavor2: z.string().optional(),
  otherFillingFlavor2: z.string().optional(),
  cakeDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  cakeText: z.string().optional(),
  referenceImage: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 5MB.`)
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), "Solo se aceptan formatos .jpg, .jpeg, .png, .webp y .gif."),
  allergies: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad.',
  }),
});

type FormData = z.infer<typeof formSchema>;

const SectionWrapper = ({ icon, title, step, children }: { icon: React.ReactNode, title: string, step: number, children: React.ReactNode }) => (
    <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border">
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-primary">Paso {step}</p>
                <h2 className="text-2xl font-card-title">{title}</h2>
            </div>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);


export function CustomCakeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      servings: '',
      eventType: '',
      otherEventType: '',
      cakeFlavor: '',
      otherCakeFlavor: '',
      fillingFlavor1: '',
      otherFillingFlavor1: '',
      fillingFlavor2: '',
      otherFillingFlavor2: '',
      cakeDescription: '',
      cakeText: '',
      allergies: '',
      privacyPolicy: false,
    },
  });

  const eventTypeValue = form.watch('eventType');
  const cakeFlavorValue = form.watch('cakeFlavor');
  const fillingFlavor1Value = form.watch('fillingFlavor1');
  const fillingFlavor2Value = form.watch('fillingFlavor2');

  const onSubmit = async (data: FormData, openWhatsApp = false) => {
    setIsLoading(true);

    const formData = new FormData();
     Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'referenceImage' && value instanceof File) {
            formData.append('reference-image', value);
        } else if (key === 'deliveryDate' && value instanceof Date) {
            formData.append(key, format(value, 'yyyy-MM-dd'));
        } else if (typeof value === 'boolean') {
            formData.append(key, value ? 'on' : 'off');
        } else {
            formData.append(key, value as string);
        }
      }
    });

    try {
      const response = await fetch('/api/custom-cake-request', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Algo salió mal.');
      }

      toast({
        title: '¡Solicitud Enviada!',
        description: 'Hemos recibido tu solicitud y te hemos enviado un correo de confirmación. ¡Revisa tu bandeja de entrada!',
      });
      
      if (openWhatsApp) {
        const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
        if (!phoneNumber) {
            toast({
                variant: 'destructive',
                title: 'Error de configuración',
                description: 'El número de WhatsApp no está configurado.',
            });
            setIsLoading(false);
            return;
        }
        
        const finalEventType = data.eventType === 'Otro' && data.otherEventType ? data.otherEventType : data.eventType;
        const finalCakeFlavor = data.cakeFlavor === 'Otro (especificar)' && data.otherCakeFlavor ? data.otherCakeFlavor : data.cakeFlavor;
        const finalFillingFlavor1 = data.fillingFlavor1 === 'Otro (especificar)' && data.otherFillingFlavor1 ? data.otherFillingFlavor1 : data.fillingFlavor1;
        const finalFillingFlavor2 = data.fillingFlavor2 === 'Otro (especificar)' && data.otherFillingFlavor2 ? data.otherFillingFlavor2 : data.fillingFlavor2;

        const fillingFlavors = [finalFillingFlavor1, finalFillingFlavor2].filter(Boolean).join(' y ');

        const messageParts = [
          `Hola Morty's Cake, esta es mi idea y quiero hacerla realidad:`,
          `\n*Nombre:* ${data.name}`,
          `*Email:* ${data.email}`,
          data.phone && `*Teléfono:* ${data.phone}`,
          `*Fecha de entrega:* ${format(data.deliveryDate, 'dd/MM/yyyy')}`,
          `*Raciones:* ${data.servings}`,
          `*Evento:* ${finalEventType}`,
          `*Sabor bizcocho:* ${finalCakeFlavor}`,
          `*Sabor relleno:* ${fillingFlavors}`,
          `*Descripción:* ${data.cakeDescription}`,
          data.cakeText && `*Texto en la tarta:* ${data.cakeText}`,
          data.allergies && `*Alergias:* ${data.allergies}`,
        ];

        const message = messageParts.filter(Boolean).join('\n');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        toast({
            title: '¡Prepara tu mensaje!',
            description: "Se ha abierto WhatsApp con tu solicitud. Si subiste una imagen, no olvides adjuntarla manualmente en el chat.",
        });
      }

      form.reset();
      setImagePreview(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al enviar',
        description: error instanceof Error ? error.message : 'No se pudo enviar el formulario. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppSubmit = () => {
    form.trigger().then(isValid => {
      if (isValid) {
        onSubmit(form.getValues(), true);
      } else {
        toast({
          variant: "destructive",
          title: "Formulario incompleto",
          description: "Por favor, rellena todos los campos obligatorios antes de continuar.",
        });
      }
    });
  };

  const addBusinessDays = (startDate: Date, days: number): Date => {
    let currentDate = new Date(startDate);
    let addedDays = 0;
    while (addedDays < days) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            addedDays++;
        }
    }
    return currentDate;
  };
  
  const minDate = addBusinessDays(new Date(), 4);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-8">
        
        <SectionWrapper icon={<User size={24} />} title="Información de Contacto" step={1}>
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nombre y apellidos *</FormLabel><FormControl><Input placeholder="Ej: Emilia Costela" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email *</FormLabel><FormControl><Input placeholder="tu.email@ejemplo.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Teléfono / WhatsApp (Opcional)</FormLabel><FormControl><Input placeholder="612 345 678" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </SectionWrapper>
        
        <SectionWrapper icon={<CalendarDays size={24} />} title="Detalles del Evento" step={2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de entrega *</FormLabel>
                          <div className="h-1 invisible"></div> {/* Spacer for alignment */}
                          <Popover>
                              <PopoverTrigger asChild>
                              <FormControl>
                                  <Button
                                  variant={"outline"}
                                  className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                  )}
                                  >
                                  {field.value ? (
                                      format(field.value, "PPP", { locale: es })
                                  ) : (
                                      <span>Elige una fecha</span>
                                  )}
                                  <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                              </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < minDate}
                                  initialFocus
                                  locale={es}
                              />
                              </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="servings" render={({ field }) => (
                    <FormItem><FormLabel>Raciones *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger></FormControl><SelectContent><SelectItem value="4-6 raciones">4-6</SelectItem><SelectItem value="6-8 raciones">6-8</SelectItem><SelectItem value="10-12 raciones">10-12</SelectItem><SelectItem value="15-20 raciones">15-20</SelectItem><SelectItem value="25-30 raciones">25-30</SelectItem><SelectItem value="Más de 30">Más de 30</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="eventType" render={({ field }) => (
                    <FormItem><FormLabel>Evento *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Cumpleaños">Cumpleaños</SelectItem><SelectItem value="Boda">Boda</SelectItem><SelectItem value="Aniversario">Aniversario</SelectItem><SelectItem value="Bautizo">Bautizo</SelectItem><SelectItem value="Comunión">Comunión</SelectItem><SelectItem value="Evento Corporativo">Evento Corporativo</SelectItem><SelectItem value="Otro">Otro</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
            <FormDescription className="w-full text-center">
                Los pedidos necesitan un mínimo de 5 días hábiles de antelación.
            </FormDescription>
             {eventTypeValue === 'Otro' && (
                <FormField control={form.control} name="otherEventType" render={({ field }) => (
                    <FormItem><FormLabel>Especifica el tipo de evento</FormLabel><FormControl><Input placeholder="Ej: Baby Shower" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            )}
        </SectionWrapper>

        <SectionWrapper icon={<Cake size={24} />} title="El Sabor de tus Sueños" step={3}>
            <FormField control={form.control} name="cakeFlavor" render={({ field }) => (
                <FormItem><FormLabel>Sabor del bizcocho *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Elige un sabor" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Vainilla">Vainilla</SelectItem><SelectItem value="Chocolate Intenso">Chocolate Intenso</SelectItem><SelectItem value="Red Velvet">Red Velvet</SelectItem><SelectItem value="Limón y Amapolas">Limón y Amapolas</SelectItem><SelectItem value="Zanahoria y Especias">Zanahoria y Especias</SelectItem><SelectItem value="Naranja y Almendra">Naranja y Almendra</SelectItem><SelectItem value="Otro (especificar)">Otro (especificar)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
            {cakeFlavorValue === 'Otro (especificar)' && (
                <FormField control={form.control} name="otherCakeFlavor" render={({ field }) => (
                    <FormItem><FormLabel>Especifica el sabor del bizcocho</FormLabel><FormControl><Input placeholder="Ej: Coco y lima" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fillingFlavor1" render={({ field }) => (
                    <FormItem><FormLabel>Sabor del relleno 1 *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Elige un sabor" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Crema de queso">Crema de queso</SelectItem><SelectItem value="Ganache de chocolate negro">Ganache de chocolate negro</SelectItem><SelectItem value="Ganache de chocolate blanco">Ganache de chocolate blanco</SelectItem><SelectItem value="Crema de vainilla">Crema de vainilla</SelectItem><SelectItem value="Dulce de leche">Dulce de leche</SelectItem><SelectItem value="Crema de pistacho">Crema de pistacho</SelectItem><SelectItem value="Mermelada de frutos rojos">Mermelada de frutos rojos</SelectItem><SelectItem value="Otro (especificar)">Otro (especificar)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="fillingFlavor2" render={({ field }) => (
                    <FormItem><FormLabel>Sabor del relleno 2 (Opcional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Elige un segundo sabor" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ninguno">Ninguno</SelectItem><SelectItem value="Crema de queso">Crema de queso</SelectItem><SelectItem value="Ganache de chocolate negro">Ganache de chocolate negro</SelectItem><SelectItem value="Ganache de chocolate blanco">Ganache de chocolate blanco</SelectItem><SelectItem value="Crema de vainilla">Crema de vainilla</SelectItem><SelectItem value="Dulce de leche">Dulce de leche</SelectItem><SelectItem value="Crema de pistacho">Crema de pistacho</SelectItem><SelectItem value="Mermelada de frutos rojos">Mermelada de frutos rojos</SelectItem><SelectItem value="Otro (especificar)">Otro (especificar)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
            {fillingFlavor1Value === 'Otro (especificar)' && (
                <FormField control={form.control} name="otherFillingFlavor1" render={({ field }) => (
                    <FormItem><FormLabel>Especifica el sabor del relleno 1</FormLabel><FormControl><Input placeholder="Ej: Crema de avellanas" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            )}
            {fillingFlavor2Value === 'Otro (especificar)' && (
                <FormField control={form.control} name="otherFillingFlavor2" render={({ field }) => (
                    <FormItem><FormLabel>Especifica el sabor del relleno 2</FormLabel><FormControl><Input placeholder="Ej: Crema de maracuyá" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            )}
        </SectionWrapper>

        <SectionWrapper icon={<Palette size={24} />} title="Tu Visión Creativa" step={4}>
            <FormField control={form.control} name="cakeDescription" render={({ field }) => (
                <FormItem><FormLabel>Describe tu tarta ideal *</FormLabel><FormControl><Textarea placeholder="Danos todos los detalles sobre el diseño, colores, temática, etc. ¡No te cortes!" className="resize-y min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="cakeText" render={({ field }) => (
                <FormItem><FormLabel>Texto en la tarta (Opcional)</FormLabel><FormControl><Input placeholder="Ej: Felicidades, María" {...field} /></FormControl></FormItem>
            )}/>
             <FormField
                control={form.control}
                name="referenceImage"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Imagen de referencia (Opcional, Max 5MB)</FormLabel>
                        <FormControl>
                            <label htmlFor="reference-image-input" className="w-full flex items-center justify-center gap-3 px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                {imagePreview ? <FileCheck className="h-6 w-6 text-green-500" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                                <span className="text-muted-foreground">{imagePreview ? `Archivo seleccionado: ${value.name}` : 'Haz clic para subir una imagen'}</span>
                            </label>
                        </FormControl>
                        <Input
                            id="reference-image-input"
                            type="file"
                            className="sr-only"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                const validationResult = formSchema.shape.referenceImage.safeParse(file);
                                if (validationResult.success) {
                                    onChange(file);
                                    if(file) setImagePreview(URL.createObjectURL(file)); else setImagePreview(null);
                                } else {
                                    form.setError("referenceImage", { type: "manual", message: validationResult.error.errors[0].message });
                                    onChange(undefined);
                                    setImagePreview(null);
                                }
                            }}
                            {...rest}
                        />
                        <FormMessage />
                    </FormItem>
                )}
            />
        </SectionWrapper>

        <SectionWrapper icon={<Sparkles size={24} />} title="Información Adicional" step={5}>
             <FormField control={form.control} name="allergies" render={({ field }) => (
                <FormItem><FormLabel>Alergias o intolerancias (Opcional)</FormLabel><FormControl><Textarea placeholder="Indícanos aquí si debemos tener en cuenta alguna alergia o intolerancia (gluten, lactosa, frutos secos, etc.)." className="resize-y" {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
        </SectionWrapper>
        
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border space-y-6">
            <div className="flex items-center gap-4">
                 <div className="flex-shrink-0 bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center">
                    <Heart size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-card-title">Confirmación Final</h2>
                </div>
            </div>
            <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        He leído y acepto la <Link href="/legal/privacy" target="_blank" className="text-primary underline hover:text-primary/80">Política de Privacidad</Link>. *
                        </FormLabel>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5"/>}
                    {isLoading ? 'Enviando...' : 'Enviar por Email'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleWhatsAppSubmit} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MessageCircle className="mr-2 h-5 w-5"/>}
                    {isLoading ? 'Procesando...' : 'Enviar por WhatsApp'}
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}
