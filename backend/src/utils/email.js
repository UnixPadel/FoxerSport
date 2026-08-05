import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'password'
  }
});

/**
 * HTML Template reflecting Foxersport.com styling
 * Dark theme, Open Sans / Montserrat fonts, logo, and clean structure.
 */
const getHtmlTemplate = (title, content, actionUrl = null, actionText = 'Siparişi Görüntüle') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Montserrat:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #000000;
      padding: 30px 20px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .content h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 24px;
      color: #000000;
      margin-top: 0;
    }
    .button-container {
      text-align: center;
      margin-top: 30px;
    }
    .button {
      background-color: #ff6600; /* Foxersport Accent Color fallback */
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: 600;
      border-radius: 4px;
      display: inline-block;
      font-family: 'Montserrat', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer {
      background-color: #1a1a1a;
      color: #999999;
      text-align: center;
      padding: 20px;
      font-size: 12px;
    }
    .footer a {
      color: #ffffff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <a href="https://foxersport.com">
        <img src="https://foxersport.com/image/catalog/foxer-logo.png" alt="Foxersport Logo">
      </a>
    </div>
    <div class="content">
      <h1>${title}</h1>
      <div>${content}</div>
      ${actionUrl ? `
      <div class="button-container">
        <a href="${actionUrl}" class="button">${actionText}</a>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Foxersport. Tüm hakları saklıdır.</p>
      <p><a href="https://foxersport.com">foxersport.com</a> | info@foxersport.com</p>
    </div>
  </div>
</body>
</html>
`;

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const title = `Siparişiniz Alındı (#${orderDetails.orderNumber})`;
  
  let itemsHtml = '<ul style="list-style: none; padding: 0;">';
  orderDetails.items.forEach(item => {
    itemsHtml += `
      <li style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between;">
        <span><strong>${item.quantity}x</strong> ${item.productSnapshot.name}</span>
        <span>${item.totalPrice} ₺</span>
      </li>
    `;
  });
  itemsHtml += '</ul>';

  const content = `
    <p>Merhaba,</p>
    <p>Siparişiniz başarıyla alınmıştır ve hazırlanma sürecine geçilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">Sipariş Özeti</h3>
      ${itemsHtml}
      <div style="text-align: right; margin-top: 15px; font-size: 18px;">
        <strong>Genel Toplam: ${orderDetails.total} ₺</strong>
      </div>
    </div>
    <p>Siparişiniz kargoya verildiğinde size takip numarası ile birlikte yeni bir e-posta göndereceğiz.</p>
  `;

  // Provide a link to their order tracking page if frontend URL is known
  const actionUrl = `${process.env.FRONTEND_URL || 'http://localhost'}/account/orders/${orderDetails.orderNumber}`;

  const mailOptions = {
    from: `"Foxersport" <${process.env.SMTP_FROM || 'noreply@foxersport.com'}>`,
    to: userEmail,
    subject: title,
    html: getHtmlTemplate(title, content, actionUrl, 'Siparişi Görüntüle')
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
