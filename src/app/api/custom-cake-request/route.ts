
import { NextRequest, NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para enviar correo
async function sendMail({ to, subject, html, attachments }: { to: string; subject: string; html: string; attachments?: any[] }) {
  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Handler de la API
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Obtener las credenciales de las variables de entorno
    const wpUser = process.env.WP_USER;
    const wpPassword = process.env.WP_APP_PASSWORD;
    const wpUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!wpUser || !wpPassword || !wpUrl || !adminEmail) {
      console.error('Faltan variables de entorno para la configuración de WordPress o el email de administrador.');
      return NextResponse.json({ success: false, message: 'Error de configuración en el servidor.' }, { status: 500 });
    }
    
    // Obtener campos del formulario
    const formFields: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
        formFields[key] = value;
    }
    
    let imageUrl = '';
    const imageFile = formData.get('reference_image') as File;

    if (imageFile && imageFile.size > 0) {
        // Si hay una imagen, subirla a WordPress
        const buffer = await imageFile.arrayBuffer();
        const headers = new Headers({
            'Content-Disposition': `attachment; filename=${imageFile.name}`,
            'Authorization': `Basic ${btoa(`${wpUser}:${wpPassword}`)}`,
            'Content-Type': imageFile.type,
        });

        const uploadResponse = await fetch(`${wpUrl}/wp-json/wp/v2/media`, {
            method: 'POST',
            headers,
            body: buffer,
        });

        if (uploadResponse.ok) {
            const mediaDetails = await uploadResponse.json();
            imageUrl = mediaDetails.source_url;
        } else {
            console.error('Error al subir la imagen:', await uploadResponse.text());
            // No bloqueamos el envío si la imagen falla, pero guardamos el error
            imageUrl = 'Error al subir la imagen.';
        }
    }
    
    // Preparar el cuerpo del email en HTML
    const emailHtml = `
      <h1>Nueva Solicitud de Tarta a Medida</h1>
      <p>Has recibido una nueva solicitud a través del formulario web.</p>
      <h2>Detalles del Cliente:</h2>
      <ul>
        <li><strong>Nombre:</strong> ${formFields.name}</li>
        <li><strong>Email:</strong> ${formFields.email}</li>
        <li><strong>Teléfono:</strong> ${formFields.phone || 'No proporcionado'}</li>
      </ul>
      <h2>Detalles del Pedido:</h2>
      <ul>
        <li><strong>Fecha de entrega:</strong> ${format(new Date(formFields.delivery_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</li>
        <li><strong>Raciones:</strong> ${formFields.servings}</li>
        <li><strong>Tipo de evento:</strong> ${formFields.event_type}</li>
        <li><strong>Sabor de bizcocho:</strong> ${formFields.cake_flavor}</li>
        <li><strong>Sabor de relleno:</strong> ${formFields.filling_flavor}</li>
        <li><strong>Texto en la tarta:</strong> ${formFields.cake_text || 'Ninguno'}</li>
        <li><strong>Alergias/Intolerancias:</strong> ${formFields.allergies || 'Ninguna especificada'}</li>
        <li><strong>Políticas Aceptadas:</strong> ${formFields.privacy_policy === 'on' ? 'Sí' : 'No'}</li>
      </ul>
      <h2>Descripción de la Tarta:</h2>
      <p>${formFields.cake_description.replace(/\n/g, '<br>')}</p>
      ${imageUrl ? `<h2>Imagen de Referencia:</h2><p><a href="${imageUrl}">Ver Imagen Adjunta</a></p><img src="${imageUrl}" alt="Imagen de referencia" style="max-width: 400px; height: auto;" />` : ''}
    `;

    // Enviar el correo
    const emailSent = await sendMail({
      to: adminEmail,
      subject: `Nueva Solicitud de Tarta a Medida de ${formFields.name}`,
      html: emailHtml,
    });
    
    if (!emailSent) {
      // Si el email falla, devolvemos un error pero la imagen ya podría estar subida
      return NextResponse.json({ success: false, message: 'El servidor no pudo enviar la notificación por correo.' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Solicitud enviada con éxito.' });

  } catch (error) {
    console.error('Error en el endpoint de solicitud:', error);
    const message = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
