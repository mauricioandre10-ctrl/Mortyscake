
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Por favor, introduce un email válido.'),
  phone: z.string().optional(),
  deliveryDate: z.string().min(1, 'La fecha es obligatoria.'),
  servings: z.string().min(1, 'Debes seleccionar el número de raciones.'),
  eventType: z.string().min(1, 'Debes seleccionar el tipo de evento.'),
  cakeFlavor: z.string().min(1, 'Debes seleccionar un sabor de bizcocho.'),
  fillingFlavor: z.string().min(1, 'Debes seleccionar un sabor de relleno.'),
  cakeDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  cakeText: z.string().optional(),
  referenceImage: z.instanceof(File).optional(),
  allergies: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export function CustomCakeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      deliveryDate: '',
      servings: '',
      eventType: '',
      cakeFlavor: '',
      fillingFlavor: '',
      cakeDescription: '',
      cakeText: '',
      allergies: '',
      privacyPolicy: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'referenceImage' && value instanceof File) {
            formData.append('reference-image', value);
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
        description: 'Hemos recibido tu solicitud de tarta a medida. Nos pondremos en contacto contigo pronto.',
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al enviar',
        description: error instanceof Error ? error.message : 'No se pudo enviar el formulario.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <h2 className="text-2xl font-card-title border-b pb-2">Información de Contacto</h2>
            <div className="grid md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre y apellidos *</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Emilia Costela" {...field} />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                            <Input placeholder="tu.email@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Teléfono / WhatsApp (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="612 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-card-title border-b pb-2">Detalles del Evento</h2>
             <div className="grid md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fecha de entrega *</FormLabel>
                        <FormControl>
                             <Input type="date" min={today} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Número de raciones *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="4-6 raciones">4-6 raciones</SelectItem>
                                <SelectItem value="6-8 raciones">6-8 raciones</SelectItem>
                                <SelectItem value="10-12 raciones">10-12 raciones</SelectItem>
                                <SelectItem value="15-20 raciones">15-20 raciones</SelectItem>
                                <SelectItem value="25-30 raciones">25-30 raciones</SelectItem>
                                <SelectItem value="Más de 30">Más de 30</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de evento *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Cumpleaños">Cumpleaños</SelectItem>
                                <SelectItem value="Boda">Boda</SelectItem>
                                <SelectItem value="Aniversario">Aniversario</SelectItem>
                                <SelectItem value="Bautizo">Bautizo</SelectItem>
                                <SelectItem value="Comunión">Comunión</SelectItem>
                                <SelectItem value="Evento Corporativo">Evento Corporativo</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-card-title border-b pb-2">El Sabor de tus Sueños</h2>
             <div className="grid md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="cakeFlavor"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sabor del bizcocho *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un sabor" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Vainilla">Vainilla</SelectItem>
                                <SelectItem value="Chocolate Intenso">Chocolate Intenso</SelectItem>
                                <SelectItem value="Red Velvet">Red Velvet</SelectItem>
                                <SelectItem value="Limón y Amapolas">Limón y Amapolas</SelectItem>
                                <SelectItem value="Zanahoria y Especias">Zanahoria y Especias</SelectItem>
                                <SelectItem value="Naranja y Almendra">Naranja y Almendra</SelectItem>
                                <SelectItem value="Otro (especificar en descripción)">Otro (especificar en descripción)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="fillingFlavor"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sabor del relleno *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un sabor" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Crema de queso">Crema de queso</SelectItem>
                                <SelectItem value="Ganache de chocolate negro">Ganache de chocolate negro</SelectItem>
                                <SelectItem value="Ganache de chocolate blanco">Ganache de chocolate blanco</SelectItem>
                                <SelectItem value="Crema de vainilla">Crema de vainilla</SelectItem>
                                <SelectItem value="Dulce de leche">Dulce de leche</SelectItem>
                                <SelectItem value="Crema de pistacho">Crema de pistacho</SelectItem>
                                <SelectItem value="Mermelada de frutos rojos">Mermelada de frutos rojos</SelectItem>
                                <SelectItem value="Otro (especificar en descripción)">Otro (especificar en descripción)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
        </div>

        <div className="space-y-4">
             <h2 className="text-2xl font-card-title border-b pb-2">Tu Visión Creativa</h2>
             <FormField
                control={form.control}
                name="cakeDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Describe tu tarta ideal *</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Danos todos los detalles sobre el diseño, colores, temática, etc. ¡No te cortes!"
                        className="resize-y min-h-[100px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="cakeText"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Texto en la tarta (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Felicidades, María" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="referenceImage"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                    <FormLabel>Imagen de referencia (Opcional, Max 5MB)</FormLabel>
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                onChange(file);
                            }}
                            {...rest}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="space-y-4">
             <h2 className="text-2xl font-card-title border-b pb-2">Información Adicional</h2>
            <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Alergias o intolerancias (Opcional)</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Indícanos aquí si debemos tener en cuenta alguna alergia o intolerancia (gluten, lactosa, frutos secos, etc.)."
                        className="resize-y"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                     He leído y acepto la <Link href="/legal/privacy" target="_blank" className="text-primary underline">Política de Privacidad</Link>. *
                    </FormLabel>
                    <FormMessage />
                </div>
                </FormItem>
            )}
            />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </form>
    </Form>
  );
}
