
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Entiende cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestros servicios de cursos de repostería en Morty\'s Cake.',
  robots: { 
    index: true, 
    follow: true 
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
            En Morty's Cake, nos comprometemos a proteger tu privacidad. Esta política detalla cómo recopilamos, utilizamos, protegemos y gestionamos tu información personal en nuestro sitio web y al acceder a nuestros cursos de repostería. Tu confianza es fundamental para nosotros.
          </p>
        </section>

        <section id="data-controller" className="mb-8">
          <h2 className="text-3xl font-bold">Responsable del Tratamiento de Datos</h2>
          <p>
            A efectos del Reglamento General de Protección de Datos (RGPD) y otra legislación aplicable, el responsable del tratamiento de tus datos es:
          </p>
          <ul className="list-none mt-4 p-0 border-l-4 border-primary pl-4">
            <li><strong>Nombre Comercial:</strong> Morty's Cake</li>
            <li><strong>Domicilio Social:</strong> Rúa Valle Inclán, 23, Bajo 11, 32004 Ourense, España</li>
            <li><strong>Correo Electrónico de Contacto:</strong> <a href="mailto:privacidad@mortyscake.com">privacidad@mortyscake.com</a></li>
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
          <h2 className="text-3xl font-bold">Cómo Utilizamos tu Información</h2>
          <p>Usamos tus datos para las siguientes finalidades:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Para proporcionar y gestionar tu acceso a nuestros cursos.</li>
            <li>Para procesar tus pagos de forma segura.</li>
            <li>Para comunicarnos contigo sobre tu cuenta, soporte y actualizaciones del servicio.</li>
            <li>Para mejorar y optimizar nuestro sitio web y oferta de cursos.</li>
            <li>Para cumplir con nuestras obligaciones legales y prevenir el fraude.</li>
            <li>Para enviarte información de marketing sobre nuevos cursos y ofertas, siempre que tengamos tu consentimiento.</li>
          </ul>
        </section>

        <section id="data-sharing" className="mb-8">
          <h2 className="text-3xl font-bold">Con Quién Compartimos tus Datos</h2>
          <p>No vendemos ni alquilamos tu información personal. Solo la compartimos con terceros de confianza que nos ayudan a operar nuestro servicio:</p>
           <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Proveedores de servicios de pago</strong> para procesar transacciones.</li>
            <li><strong>Herramientas de análisis</strong> como Google Analytics para entender el uso del sitio.</li>
            <li><strong>Autoridades legales</strong> cuando sea requerido por ley.</li>
          </ul>
        </section>

        <section id="user-rights" className="mb-8">
          <h2 className="text-3xl font-bold">Tus Derechos de Protección de Datos (ARCO)</h2>
          <p>Tienes derecho a:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Acceder</strong> a los datos personales que tenemos sobre ti.</li>
            <li><strong>Rectificar</strong> cualquier información personal que sea incorrecta o esté incompleta.</li>
            <li><strong>Suprimir</strong> tus datos personales de nuestros sistemas ("derecho al olvido").</li>
            <li><strong>Oponerte</strong> al tratamiento de tus datos para fines de marketing directo.</li>
            <li><strong>Limitar</strong> el tratamiento de tus datos en determinadas circunstancias.</li>
            <li><strong>Portar</strong> tus datos a otro responsable en un formato estructurado.</li>
          </ul>
          <p className="mt-4">Para ejercer cualquiera de estos derechos, por favor, contacta con nosotros en <a href="mailto:privacidad@mortyscake.com">privacidad@mortyscake.com</a>.</p>
        </section>

         <section id="data-security" className="mb-8">
          <h2 className="text-3xl font-bold">Seguridad de los Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales, incluyendo cifrado SSL y controles de acceso. Sin embargo, ningún método de transmisión por internet es 100% seguro.</p>
        </section>

        <section id="policy-changes">
          <h2 className="text-3xl font-bold">Cambios en esta Política</h2>
          <p>Nos reservamos el derecho a modificar esta política. Cualquier cambio será publicado en esta página con una nueva fecha de actualización. Te recomendamos revisarla periódicamente.</p>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
