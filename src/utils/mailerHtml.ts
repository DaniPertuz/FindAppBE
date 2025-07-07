export const getPremiumHtml = (premium: number, email: string) => {
  const premiums = {
    1: {
      title: '¡Has adquirido el Paquete Básico!',
      body: `
      <h4 style="font-size: 26px;">Con este plan ahora puedes:</h4>
      <ul style="text-align: start;>
        <li>Subir 1 imagen de tu negocio</li>
        <li>Subir 1 imagen de tus productos</li>
        <li>Subir 1 video promocional</li>
        <li>Tener visibilidad básica de tu negocio en la app</li>
      </ul>
      `,
    },
    2: {
      title: '¡Has adquirido el Paquete Regular!',
      body: `
      <h4 style="font-size: 26px;">Con este plan ahora puedes:</h4>
      <ul style="text-align: start;>
        <li>Subir hasta 2 imágenes de tu negocio</li>
        <li>Subir hasta 2 imágenes de tus productos</li>
        <li>Subir hasta 2 videos promocionales</li>
        <li>Registrar más canales de comunicación del lugar (Instagram & WhatsApp).</li>
        <li>Tener mayor visibilidad y priorización en nuestros motores de búsqueda</li>
      </ul>
      `,
    },
    3: {
      title: '¡Has adquirido el Paquete Premium!',
      body: `
      <h4 style="font-size: 26px;">Con este plan ahora puedes:</h4>
      <ul style="text-align: start;">
        <li>Subir imágenes ilimitadas de tu negocio</li>
        <li>Subir imágenes ilimitadas de tus productos</li>
        <li>Subir hasta 10 videos promocionales</li>
        <li>Registrar más canales de comunicación del lugar (Instagram & WhatsApp).</li>
        <li>Tener máxima visibilidad y posicionamiento en nuestros motores de búsqueda</li>
      </ul>
      `,
    },
  };

  const selected = premiums[premium];

  return `
    <html>
    <body style="margin:0; padding:0;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; padding: 20px; font-family: Arial, sans-serif; color: #000000;">
        <tr>
          <td align="center">
            <h2 style="margin-top: 0; font-size: 32px;">${selected.title}</h2>
            ${selected.body}
          </td>
        </tr>
        <tr>
          <td align="center">
            <img src="https://res.cloudinary.com/dpertuzo/image/upload/v1733709493/findapp/icons/fa_complete_color.png" alt="FindApp Logo" style="height: 120px; width: 260px;" />
          </td>
        </tr>
        <tr>
          <td align="center">
            <p style="font-size: 12px; color: #777777; margin-top: 16px;">
              Este correo fue enviado a <strong>${email}</strong><br/>
              Por favor no responder a esta dirección de correo electrónico, ya que es un envío automático.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
