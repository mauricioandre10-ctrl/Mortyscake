
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z, ZodError } from 'zod';

// Define the schema for form validation
const formSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El email no es válido'),
  phone: z.string().optional(),
  deliveryDate: z.string().min(1, 'La fecha es obligatoria'),
  servings: z.string().min(1, 'El número de raciones es obligatorio'),
  eventType: z.string().min(1, 'El tipo de evento es obligatorio'),
  cakeFlavor: z.string().min(1, 'El sabor del bizcocho es obligatorio'),
  fillingFlavor: z.string().min(1, 'El sabor del relleno es obligatorio'),
  cakeDescription: z.string().min(1, 'La descripción es obligatoria'),
  cakeText: z.string().optional(),
  allergies: z.string().optional(),
  privacyPolicy: z.union([z.literal('on'), z.boolean()]).refine(val => val === 'on' || val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const referenceImage = formData.get('reference-image') as File | null;
    const body = Object.fromEntries(formData.entries());
    
    // Convert checkbox value
    if (body.privacyPolicy === 'on') {
        body.privacyPolicy = true;
    }

    // Validate form data
    const validatedData = formSchema.parse(body);
    
    // Check for SMTP credentials in environment variables
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
        console.error("Error: Faltan variables de entorno para la configuración SMTP.");
        return NextResponse.json({ message: 'Error de configuración en el servidor. Por favor, contacta con el administrador.' }, { status: 500 });
    }

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Prepare attachments
    const attachments = [];
    if (referenceImage) {
        const buffer = Buffer.from(await referenceImage.arrayBuffer());
        attachments.push({
            filename: referenceImage.name,
            content: buffer,
        });
    }
    
    const emailHtml = `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h1 style="color: #D87093;">Nueva Solicitud de Tarta a Medida</h1>
        <p>Has recibido una nueva solicitud a través del formulario de la web.</p>
        <hr>
        
        <h2>Información de Contacto</h2>
        <p><strong>Nombre:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Teléfono:</strong> ${validatedData.phone || 'No proporcionado'}</p>
        
        <h2>Detalles del Evento</h2>
        <p><strong>Fecha de entrega:</strong> ${validatedData.deliveryDate}</p>
        <p><strong>Raciones:</strong> ${validatedData.servings}</p>
        <p><strong>Tipo de evento:</strong> ${validatedData.eventType}</p>
        
        <h2>Sabores</h2>
        <p><strong>Bizcocho:</strong> ${validatedData.cakeFlavor}</p>
        <p><strong>Relleno:</strong> ${validatedData.fillingFlavor}</p>
        
        <h2>Visión Creativa</h2>
        <p><strong>Descripción de la tarta:</strong><br>${validatedData.cakeDescription.replace(/\n/g, '<br>')}</p>
        <p><strong>Texto en la tarta:</strong> ${validatedData.cakeText || 'No proporcionado'}</p>
        
        <h2>Información Adicional</h2>
        <p><strong>Alergias o intolerancias:</strong><br>${validatedData.allergies || 'No proporcionado'}</p>
      </div>
    `;

    // Send mail with defined transport object
    await transporter.sendMail({
      from: `"Formulario Web Morty's Cake" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: validatedData.email,
      subject: `Nueva solicitud de tarta a medida de: ${validatedData.name}`,
      html: emailHtml,
      attachments: attachments,
    });

    return NextResponse.json({ message: 'Solicitud enviada con éxito. ¡Gracias por contactarnos!' });

  } catch (error) {
    if (error instanceof ZodError) {
      // Return a 400 Bad Request with the first validation error
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    
    console.error('[API Error]', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Un error inesperado ocurrió en el servidor.';
    return NextResponse.json({ message: `Error al enviar la solicitud: ${errorMessage}` }, { status: 500 });
  }
}
