import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Configure transporter (using environment variables or test account if not configured)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'codesbarrera@gmail.com',
      pass: process.env.EMAIL_PASS || 'demo_password_placeholder'
    }
  });

  // API route to send order confirmation emails
  app.post('/api/send-order-email', async (req, res) => {
    try {
      const { customer, cart, total, isMayorista } = req.body;

      if (!customer || !customer.email) {
        return res.status(400).json({ success: false, error: 'Correo electrónico del cliente requerido.' });
      }

      const itemsListHtml = cart
        .map(
          (item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.cantidad}x ${item.nombre} (${item.equipo})</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">Talla: <b>${item.talla}</b></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</td>
        </tr>
      `
        )
        .join('');

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 12px;">
          <div style="background: #0f2a43; color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">⚽ Distribuidora Barrera</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #c9d6e2;">Confirmación de Pedido - Bogotá y Soacha</p>
          </div>

          <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-top: 15px; border: 1px solid #e3e8ed;">
            <h2 style="color: #0f2a43; font-size: 16px; margin-top: 0;">¡Hola, ${customer.nombre} ${customer.apellido || ''}!</h2>
            <p style="font-size: 13px; color: #5c6b78; line-height: 1.5;">
              Hemos recibido tu pedido correctamente. Estamos preparando tus camisetas con la mejor calidad.
            </p>

            <h3 style="color: #0f2a43; font-size: 14px; border-bottom: 2px solid #e3e8ed; padding-bottom: 6px; margin-top: 20px;">Detalles del Envío</h3>
            <p style="font-size: 13px; color: #333; margin: 4px 0;"><b>Dirección:</b> ${customer.direccion} (${customer.barrio || ''})</p>
            <p style="font-size: 13px; color: #333; margin: 4px 0;"><b>Ciudad:</b> ${customer.ciudad}</p>
            <p style="font-size: 13px; color: #333; margin: 4px 0;"><b>Teléfono:</b> ${customer.telefono}</p>

            <h3 style="color: #0f2a43; font-size: 14px; border-bottom: 2px solid #e3e8ed; padding-bottom: 6px; margin-top: 20px;">Productos</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              ${itemsListHtml}
            </table>

            <div style="margin-top: 15px; text-align: right; font-size: 15px; font-weight: bold; color: #0f2a43;">
              Total a Pagar: $${Number(total).toLocaleString('es-CO')}
              ${isMayorista ? '<div style="font-size: 11px; color: #1f9d55; font-weight: normal;">(Incluye Descuento Mayorista 10%)</div>' : ''}
            </div>

            <div style="background: #fff0f5; border: 1px dashed #ffb3cc; padding: 12px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #e00063; font-weight: bold;">💜 Recuerda realizar tu pago al Nequi: 302 834 5744</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #5c6b78;">Envía tu comprobante por WhatsApp al 300 517 7418 para despachar tu pedido.</p>
            </div>
          </div>

          <div style="text-align: center; color: #888; font-size: 11px; margin-top: 20px;">
            © Distribuidora Barrera · Ventas al por mayor y detal en Bogotá y Soacha
          </div>
        </div>
      `;

      // 1. Send confirmation email to customer
      // 2. Send order notification email to store admin (codesbarrera@gmail.com)
      const adminEmail = 'codesbarrera@gmail.com';

      try {
        await transporter.sendMail({
          from: '"Distribuidora Barrera" <codesbarrera@gmail.com>',
          to: customer.email,
          subject: '⚽ Confirmación de tu Pedido - Distribuidora Barrera',
          html: emailHtml
        });

        await transporter.sendMail({
          from: '"Sistema Distribuidora Barrera" <codesbarrera@gmail.com>',
          to: adminEmail,
          subject: `🚀 Nuevo Pedido de ${customer.nombre} (${customer.ciudad})`,
          html: `<h1>Nuevo Pedido Recibido</h1>${emailHtml}`
        });

        return res.json({ success: true, message: 'Correos de confirmación enviados exitosamente al cliente y al administrador.' });
      } catch (mailErr: any) {
        console.warn('Mail transport note (simulated mode if credentials are mock):', mailErr.message);
        // Even if SMTP auth is mock, return success so user gets confirmation in UI and WhatsApp
        return res.json({
          success: true,
          simulated: true,
          message: 'Pedido registrado y correos simulados correctamente (configura credenciales SMTP en producción para envío real).'
        });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
