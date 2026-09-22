import nodemailer from "nodemailer";

/**
 * Sends a clean, styled HTML order confirmation email to the customer
 */
export const sendOrderConfirmationEmail = async (order) => {
  try {
    let transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Automatic free test inbox
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("ℹ️ Using Ethereal test email account.");
    }

    // Build the table rows for each ordered item
    const itemsHtml = order.orderItems
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 0; font-size: 14px; color: #1e293b;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #64748b;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: bold; color: #1e293b;">
            $${(Number(item.price) * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    // HTML Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 32px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: bold;">Luxora Store</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Official Order Confirmation</p>
        </div>

        <div style="padding: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a;">Thank you for your order, ${order.customer.name}!</h2>
          <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.5;">
            We have received your order and our team is preparing it for shipment.
          </p>

          <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #64748b;">
            <p style="margin: 0 0 6px 0;">Order Reference: <strong style="color: #0f172a; font-family: monospace;">#${order._id.toString().slice(-8).toUpperCase()}</strong></p>
            <p style="margin: 0 0 6px 0;">Delivery Address: <strong style="color: #0f172a;">${order.customer.address}, ${order.customer.city}</strong></p>
            <p style="margin: 0;">Payment Method: <strong style="color: #0f172a;">${order.paymentMethod || "Card"}</strong></p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 12px; text-transform: uppercase; color: #94a3b8;">
                <th style="padding-bottom: 8px;">Item</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="border-top: 2px solid #e2e8f0; padding-top: 16px; text-align: right;">
            <span style="font-size: 14px; color: #64748b; margin-right: 12px;">Total Paid:</span>
            <span style="font-size: 24px; font-weight: bold; color: #4f46e5;">$${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">Luxora Inc. • All rights reserved.</p>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Luxora Store" <${process.env.EMAIL_USER || "orders@luxorastore.com"}>`,
      to: order.customer.email,
      subject: `Receipt: Order #${order._id.toString().slice(-8).toUpperCase()} - Luxora`,
      html: htmlContent,
    });

    console.log(`✅ Email dispatched to ${order.customer.email}`);

    // If using the automatic test account, it prints a clickable preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Clickable Email Preview URL: ${previewUrl}`);
    }

    return info;
  } catch (error) {
    console.error("❌ Email sending failed (order is still saved safely):", error.message);
  }
};