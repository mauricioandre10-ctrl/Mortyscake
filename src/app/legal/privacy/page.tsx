
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Entiende cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestros servicios de cursos y productos de repostería en Morty\'s Cake.',
  robots: { 
    index: true, 
    follow: true 
  },
  openGraph: {
    title: 'Política de Privacidad | Morty\'s Cake',
    description: 'Detalles sobre cómo protegemos y gestionamos tus datos personales.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Privacidad | Morty\'s Cake',
    description: 'Detalles sobre cómo protegemos y gestionamos tus datos personales.',
    images: ['/image/fondo_heder.webp'],
  },
};

const PrivacyPolicyPage = () => {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Política de Privacidad</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: <time dateTime="2025-09-08">8 de septiembre de 2025</time>
          </p>
        </header>

        <section id="introduction" className="mb-8">
          <p className="lead">
            En Morty's Cake, nos comprometemos a proteger tu privacidad. Esta política detalla cómo recopilamos, utilizamos, protegemos y gestionamos tu información personal en nuestro sitio web y al acceder a nuestros cursos de repostería. Tu confianza es fundamental para nosotros. La utilización del sitio web implica la aceptación plena de las disposiciones incluidas en este documento.
          </p>
        </section>

        <section id="data-controller" className="mb-8">
          <h2 className="text-3xl font-bold">Responsable del Tratamiento de Datos</h2>
          <p>
            A efectos del Reglamento (UE) 2016/679 General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD), el responsable del tratamiento de tus datos es:
          </p>
          <ul className="list-none mt-4 p-0 border-l-4 border-primary pl-4">
            <li><strong>Nombre Comercial:</strong> Morty's Cake</li>
            <li><strong>CIF Intracomunitario:</strong> ESB32496622</li>
            <li><strong>Domicilio Social:</strong> Rúa Valle Inclán, 23, Bajo 11, 32004 Ourense, España</li>
            <li><strong>Correo Electrónico de Contacto:</strong> <a href="mailto:info@mortyscake.com">info@mortyscake.com</a></li>
          </ul>
        </section>

        <section id="information-we-collect" className="mb-8">
          <h2 className="text-3xl font-bold">Información que Recopilamos</h2>
          <p>Recopilamos diferentes tipos de información en función de tu interacción con nosotros:</p>
          <h3 className="text-2xl font-semibold mt-4">Información que nos proporcionas directamente</h3>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Datos de la cuenta:</strong> Nombre, apellidos y dirección de correo electrónico al registrarte.</li>
            <li><strong>Datos de pago:</strong> Información de tarjeta de crédito/débito y datos de facturación, procesados de forma segura por nuestros proveedores de pago.</li>
            <li><strong>Comunicaciones:</strong> Mensajes y consultas que nos envías a través de formularios de contacto o correo electrónico.</li>
          </ul>
          <h3 className="text-2xl font-semibold mt-4">Información recopilada automáticamente</h3>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Datos de uso:</strong> Información sobre cómo utilizas nuestro sitio, qué cursos visualizas y tu progreso.</li>
            <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo, e información del dispositivo.</li>
            <li><strong>Cookies y tecnologías similares:</strong> Utilizamos cookies para el funcionamiento del sitio, análisis y personalización. Para más detalles, consulta nuestra <Link href="/legal/cookies">Política de Cookies</Link>.</li>
          </ul>
        </section>

        <section id="how-we-use-information" className="mb-8">
          <h2 className="text-3xl font-bold">Finalidad del Tratamiento de Datos</h2>
          <p>Usamos tus datos para las siguientes finalidades:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Para proporcionar y gestionar tu acceso a nuestros cursos y productos.</li>
            <li>Para procesar tus pedidos y pagos de forma segura.</li>
            <li>Para comunicarnos contigo sobre tu cuenta, soporte, actualizaciones del servicio y estado de tus pedidos.</li>
            <li>Para mejorar y optimizar nuestro sitio web y nuestra oferta de cursos y productos.</li>
            <li>Para cumplir con nuestras obligaciones legales, fiscales y administrativas, así como para prevenir el fraude.</li>
            <li>Para enviarte comunicaciones comerciales sobre nuevos cursos, productos y ofertas, siempre que tengamos tu consentimiento explícito.</li>
          </ul>
        </section>

        <section id="user-obligations" className="mb-8">
          <h2 className="text-3xl font-bold">Acceso y Utilización del Sitio Web</h2>
          <p>El acceso al sitio web y la contratación de productos y servicios están reservados a personas mayores de 18 años. El usuario garantiza que los datos aportados son verdaderos, exactos y completos, y se compromete a utilizar los servicios y contenidos de conformidad con la ley, la buena fe y el orden público.</p>
        </section>
        
        <section id="data-sharing" className="mb-8">
          <h2 className="text-3xl font-bold">Con Quién Compartimos tus Datos</h2>
          <p>No vendemos ni alquilamos tu información personal. Solo la compartimos con terceros de confianza que nos ayudan a operar nuestro servicio, siempre bajo estrictos acuerdos de confidencialidad:</p>
           <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Proveedores de servicios de pago</strong> para procesar transacciones de forma segura.</li>
            <li><strong>Herramientas de análisis</strong> como Google Analytics para entender el uso del sitio, siempre que hayas dado tu consentimiento.</li>
            <li><strong>Empresas de logística y transporte</strong> para gestionar el envío de productos físicos.</li>
            <li><strong>Autoridades legales, fiscales o administrativas</strong> cuando sea requerido por ley.</li>
          </ul>
        </section>

        <section id="user-rights" className="mb-8">
          <h2 className="text-3xl font-bold">Tus Derechos de Protección de Datos</h2>
          <p>Como usuario, tienes derecho a ejercer tus derechos de Acceso, Rectificación, Cancelación, Oposición, Portabilidad y Limitación del tratamiento de tus datos:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Acceder</strong> a los datos personales que tenemos sobre ti.</li>
            <li><strong>Rectificar</strong> cualquier información personal que sea incorrecta o esté incompleta.</li>
            <li><strong>Suprimir</strong> tus datos personales de nuestros sistemas ("derecho al olvido").</li>
            <li><strong>Oponerte</strong> al tratamiento de tus datos para fines de marketing directo.</li>
            <li><strong>Limitar</strong> el tratamiento de tus datos en determinadas circunstancias.</li>
            <li><strong>Portar</strong> tus datos a otro responsable en un formato estructurado.</li>
          </ul>
          <p className="mt-4">Para ejercer cualquiera de estos derechos, por favor, contacta con nosotros en <a href="mailto:info@mortyscake.com">info@mortyscake.com</a>, adjuntando una copia de tu documento de identidad para verificar tu identidad.</p>
        </section>
        
        <section id="intellectual-property" className="mb-8">
          <h2 className="text-3xl font-bold">Propiedad Intelectual</h2>
          <p>
            Todos los contenidos del Sitio Web, incluyendo textos, fotografías, gráficos, vídeos, recetas, logos y diseños, son propiedad de Morty's Cake o de terceros que han autorizado su uso. Queda estrictamente prohibida la reproducción, distribución, comunicación pública o transformación de dichos contenidos sin nuestra autorización previa y por escrito.
          </p>
        </section>

         <section id="data-security" className="mb-8">
          <h2 className="text-3xl font-bold">Seguridad de los Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra el acceso no autorizado, la alteración o la destrucción. Esto incluye cifrado SSL y controles de acceso. Sin embargo, ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro.</p>
        </section>

        <section id="policy-changes">
          <h2 className="text-3xl font-bold">Cambios en esta Política</h2>
          <p>Nos reservamos el derecho a modificar esta política para adaptarla a novedades legislativas o cambios en nuestros servicios. Cualquier cambio será publicado en esta página con una nueva fecha de actualización. Te recomendamos revisarla periódicamente.</p>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;

    