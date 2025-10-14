
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z, ZodError } from 'zod';
import { htmlToText } from 'html-to-text';

// Define the schema for form validation
const formSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El email no es válido'),
  phone: z.string().optional(),
  deliveryDate: z.string().min(1, 'La fecha es obligatoria'),
  servings: z.string().min(1, 'El número de raciones es obligatorio'),
  eventType: z.string().min(1, 'El tipo de evento es obligatorio'),
  otherEventType: z.string().optional(),
  cakeFlavor: z.string().min(1, 'El sabor del bizcocho es obligatorio'),
  otherCakeFlavor: z.string().optional(),
  fillingFlavor1: z.string().min(1, 'El sabor del primer relleno es obligatorio'),
  otherFillingFlavor1: z.string().optional(),
  fillingFlavor2: z.string().optional().refine(val => val !== 'Ninguno', { message: "Selecciona un sabor o déjalo vacío" }),
  otherFillingFlavor2: z.string().optional(),
  cakeDescription: z.string().min(1, 'La descripción es obligatoria'),
  cakeText: z.string().optional(),
  allergies: z.string().optional(),
  privacyPolicy: z.union([z.literal('on'), z.boolean()]).refine(val => val === 'on' || val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
  source: z.enum(['email', 'whatsapp']).optional().default('email'),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const referenceImage = formData.get('reference-image') as File | null;
    const body = Object.fromEntries(formData.entries());
    
    // Prepare data for validation
    const dataToValidate = {
      ...body,
      privacyPolicy: body.privacyPolicy === 'on',
    };

    // Validate form data
    const validatedData = formSchema.parse(dataToValidate);
    
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
       tls: {
        rejectUnauthorized: false
      }
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

    const finalEventType = validatedData.eventType === 'Otro' && validatedData.otherEventType ? validatedData.otherEventType : validatedData.eventType;
    const finalCakeFlavor = validatedData.cakeFlavor === 'Otro (especificar)' && validatedData.otherCakeFlavor ? validatedData.otherCakeFlavor : validatedData.cakeFlavor;
    
    const finalFillingFlavor1 = validatedData.fillingFlavor1 === 'Otro (especificar)' && validatedData.otherFillingFlavor1 ? validatedData.otherFillingFlavor1 : validatedData.fillingFlavor1;
    const finalFillingFlavor2 = validatedData.fillingFlavor2 && validatedData.fillingFlavor2 !== 'Ninguno' 
        ? (validatedData.fillingFlavor2 === 'Otro (especificar)' && validatedData.otherFillingFlavor2 ? validatedData.otherFillingFlavor2 : validatedData.fillingFlavor2)
        : null;

    const fillingFlavors = [finalFillingFlavor1, finalFillingFlavor2].filter(Boolean).join(' y ');
    
    const subjectPrefix = validatedData.source === 'whatsapp' 
        ? "Solicitud de tarta iniciada por WhatsApp" 
        : "Nueva solicitud de tarta a medida";

    const adminEmailHtml = `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h1 style="color: #D87093;">${subjectPrefix}</h1>
        <p>Has recibido una nueva solicitud a través del formulario de la web.</p>
        ${validatedData.source === 'whatsapp' ? '<p style="font-weight: bold; color: #16a34a;">El cliente ha continuado por WhatsApp. Por favor, revisa tu chat.</p>' : ''}
        <hr>
        
        <h2>Información de Contacto</h2>
        <p><strong>Nombre:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Teléfono:</strong> ${validatedData.phone || 'No proporcionado'}</p>
        
        <h2>Detalles del Evento</h2>
        <p><strong>Fecha de entrega:</strong> ${validatedData.deliveryDate}</p>
        <p><strong>Raciones:</strong> ${validatedData.servings}</p>
        <p><strong>Tipo de evento:</strong> ${finalEventType}</p>
        
        <h2>Sabores</h2>
        <p><strong>Bizcocho:</strong> ${finalCakeFlavor}</p>
        <p><strong>Relleno(s):</strong> ${fillingFlavors}</p>
        
        <h2>Visión Creativa</h2>
        <p><strong>Descripción de la tarta:</strong><br>${validatedData.cakeDescription.replace(/\n/g, '<br>')}</p>
        <p><strong>Texto en la tarta:</strong> ${validatedData.cakeText || 'No proporcionado'}</p>
        
        <h2>Información Adicional</h2>
        <p><strong>Alergias o intolerancias:</strong><br>${validatedData.allergies || 'No proporcionado'}</p>
        
        <hr>
        <p style="font-size: 12px; color: #777;"><strong>Confirmación Legal:</strong> El usuario aceptó la política de privacidad.</p>
      </div>
    `;

    // Generate plain text version for admin email
    const adminEmailText = htmlToText(adminEmailHtml);
    const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@mortyscake.com>`;

    // Send mail to Admin
    await transporter.sendMail({
      from: `"Formulario Web Morty's Cake" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: validatedData.email,
      subject: `[${validatedData.source.toUpperCase()}] ${subjectPrefix} de: ${validatedData.name}`,
      html: adminEmailHtml,
      text: adminEmailText,
      attachments: attachments,
      headers: {
        'Message-ID': messageId
      }
    });
    
    // Send confirmation email ONLY if the source is 'email'
    if (validatedData.source === 'email') {
        const customerEmailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #513938; padding: 20px; text-align: center;">
                    <img src="https://mortyscake.com/image/Logo_mortys_cake.webp" alt="Morty's Cake Logo" style="height: 60px; width: auto;">
                </div>
                <div style="padding: 30px 20px; line-height: 1.6;">
                    <h1 style="color: #D87093; font-family: 'Pacifico', cursive;">¡Hemos recibido tu solicitud, ${validatedData.name}!</h1>
                    <p>Muchas gracias por pensar en Morty's Cake para tu celebración. Hemos recibido correctamente los detalles de tu tarta soñada y estamos muy emocionados por la posibilidad de crear algo mágico para ti.</p>
                    <p>Nos pondremos en contacto contigo a la mayor brevedad posible para revisar todos los detalles, darte un presupuesto y responder cualquier duda que puedas tener.</p>
                    <p>Mientras tanto, si necesitas cualquier cosa, no dudes en responder a este correo.</p>
                    <br>
                    <p>Con mucho cariño,<br><strong>El equipo de Morty's Cake</strong></p>
                </div>
                <div style="background-color: #f7f7f7; padding: 20px; text-align: center; font-size: 12px; color: #777;">
                    <p>Rúa Valle Inclán, 23, Bajo 11, 32004 Ourense</p>
                    <p>&copy; ${new Date().getFullYear()} Morty's Cake. Todos los derechos reservados.</p>
                </div>
            </div>
        `;

        const customerEmailText = htmlToText(customerEmailHtml);
        const customerMessageId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@mortyscake.com>`;

        await transporter.sendMail({
            from: `"Morty's Cake" <${SMTP_USER}>`,
            to: validatedData.email,
            replyTo: ADMIN_EMAIL,
            subject: "🧁 Confirmación de tu solicitud de tarta a medida",
            html: customerEmailHtml,
            text: customerEmailText,
            headers: {
                'Message-ID': customerMessageId
            }
        });
    }

    return NextResponse.json({ message: 'Solicitud procesada con éxito.' });

  } catch (error) {
    if (error instanceof ZodError) {
      // Return a 400 Bad Request with the first validation error
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    
    console.error('[API Error]', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Un error inesperado ocurrió en el servidor.';
    return NextResponse.json({ message: `Error al procesar la solicitud: ${errorMessage}` }, { status: 500 });
  }
}
