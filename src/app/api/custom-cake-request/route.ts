
import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
    let imageId = null;
    const imageFile = formData.get('reference_image') as File;

    if (imageFile && imageFile.size > 0) {
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

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Error al subir la imagen a WordPress:', errorText);
            let errorMessage = 'Error al subir la imagen de referencia.';
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.code === 'rest_cannot_create') {
                errorMessage = 'Error de permisos: La subida de archivos a WordPress está deshabilitada o no tienes permiso.';
              } else if (errorJson.code === 'incorrect_password') {
                errorMessage = 'Error de WordPress: La contraseña de aplicación no es correcta.';
              } else if (errorJson.message) {
                 errorMessage = `Error de WordPress: ${errorJson.message}`;
              }
            } catch (e) {
              if (errorText.length < 200) {
                errorMessage = `Error del servidor: ${errorText}`;
              }
            }
            throw new Error(errorMessage);
        }
        
        const mediaDetails = await uploadResponse.json();
        imageUrl = mediaDetails.source_url;
        imageId = mediaDetails.id;
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
        <li><strong>Políticas Aceptadas:</strong> ${formFields.privacy_policy === 'true' ? 'Sí' : 'No'}</li>
      </ul>
      <h2>Descripción de la Tarta:</h2>
      <p>${formFields.cake_description.replace(/\n/g, '<br>')}</p>
      ${imageUrl ? `<h2>Imagen de Referencia:</h2><p><a href="${imageUrl}">Ver Imagen Adjunta</a></p><img src="${imageUrl}" alt="Imagen de referencia" style="max-width: 400px; height: auto;" />` : ''}
    `;

    const mailerHeaders = new Headers({
        'Authorization': `Basic ${btoa(`${wpUser}:${wpPassword}`)}`,
        'Content-Type': 'application/json',
    });

    const mailerBody = {
        to: adminEmail,
        subject: `Nueva Solicitud de Tarta a Medida de ${formFields.name}`,
        message: emailHtml,
        ...(imageId && { attachments: [imageId] }),
    };
    
    const mailerResponse = await fetch(`${wpUrl}/wp-json/morty/v1/send-email`, {
        method: 'POST',
        headers: mailerHeaders,
        body: JSON.stringify(mailerBody),
    });

    if (!mailerResponse.ok) {
        const errorResult = await mailerResponse.json();
        console.error('Error al delegar el envío de correo a WordPress:', errorResult);
        throw new Error(errorResult.message || 'WordPress no pudo enviar el correo.');
    }
    
    const mailerResult = await mailerResponse.json();
    if (!mailerResult.success) {
      console.error('Respuesta de WordPress (fallida):', mailerResult.data);
      throw new Error(mailerResult.data.message || 'WordPress informó de un error al enviar el correo.');
    }
    
    return NextResponse.json({ success: true, message: 'Solicitud enviada con éxito.' });

  } catch (error) {
    console.error('Error en el endpoint de solicitud:', error);
    const message = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
