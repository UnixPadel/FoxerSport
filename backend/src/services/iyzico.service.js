import Iyzipay from 'iyzipay';
import iyzipay from '../utils/iyzico.js';

// ─────────────────────────────────────────────────────────────────────
// Iyzico Checkout Form Service
// Encapsulates all Iyzico API interactions with clean builder pattern.
// ─────────────────────────────────────────────────────────────────────

/**
 * Maps a 2-letter country code to a full country name
 * required by Iyzico's API.
 */
const COUNTRY_MAP = {
  TR: 'Turkey',
  DE: 'Germany',
  FR: 'France',
  GB: 'United Kingdom',
  US: 'United States',
};

const resolveCountry = (code) => COUNTRY_MAP[code] || code || 'Turkey';

// ── Private Builders ─────────────────────────────────────────────────

/**
 * Builds the buyer object for the Iyzico request.
 * @param {Object} user  - Prisma User model
 * @param {Object} addressSnapshot - Address snapshot from order
 * @param {string} ip - Client IP address
 */
const buildBuyer = (user, addressSnapshot, ip) => ({
  id:                  user.id,
  name:                user.firstName,
  surname:             user.lastName,
  gsmNumber:           user.phone || '+905000000000',
  email:               user.email,
  identityNumber:      '11111111111',
  lastLoginDate:       formatDate(user.lastLoginAt || user.createdAt),
  registrationDate:    formatDate(user.createdAt),
  registrationAddress: addressSnapshot.addressLine1 || 'N/A',
  ip:                  sanitizeIp(ip),
  city:                addressSnapshot.city || 'Istanbul',
  country:             resolveCountry(addressSnapshot.countryCode),
  zipCode:             addressSnapshot.postalCode || '00000',
});

/**
 * Builds a shipping or billing address for the Iyzico request.
 * @param {Object} snapshot - Address snapshot from order
 */
const buildAddress = (snapshot) => ({
  contactName: `${snapshot.firstName || ''} ${snapshot.lastName || ''}`.trim() || 'N/A',
  city:        snapshot.city || 'Istanbul',
  country:     resolveCountry(snapshot.countryCode),
  address:     snapshot.addressLine1 || 'N/A',
  zipCode:     snapshot.postalCode || '00000',
});

/**
 * Builds the basket items array for the Iyzico request.
 * Iyzico requires the sum of basket item prices to equal `price`.
 * @param {Array} orderItems - Order items from Prisma
 */
const buildBasketItems = (orderItems) =>
  orderItems.map((item) => ({
    id:        item.id,
    name:      item.productSnapshot?.name || `Product ${item.productId}`,
    category1: 'Sports',
    category2: 'Equipment',
    itemType:  Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
    price:     item.totalPrice.toString(),
  }));

/**
 * Formats a Date object to "YYYY-MM-DD HH:mm:ss" as Iyzico expects.
 */
const formatDate = (date) => {
  if (!date) return '2024-01-01 00:00:00';
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/**
 * Sanitizes IP address — strips ::ffff: prefix from IPv4-mapped IPv6.
 */
const sanitizeIp = (ip) => {
  if (!ip) return '127.0.0.1';
  return ip.replace(/^::ffff:/, '');
};

// ── Public API ───────────────────────────────────────────────────────

/**
 * Initializes an Iyzico Checkout Form session.
 *
 * @param {Object} params
 * @param {Object} params.order       - Full order with items, user, etc.
 * @param {string} params.callbackUrl - Server-side callback URL
 * @param {string} params.clientIp    - Client's IP address
 * @returns {Promise<Object>} Iyzico response with paymentPageUrl
 */
export const initializeCheckoutForm = ({ order, callbackUrl, clientIp }) => {
  return new Promise((resolve, reject) => {
    const request = {
      locale:          Iyzipay.LOCALE.TR,
      conversationId:  order.orderNumber,
      price:           order.subtotal.toString(),
      paidPrice:       order.total.toString(),
      currency:        Iyzipay.CURRENCY.TRY,
      basketId:        order.id,
      paymentGroup:    Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6],
      buyer:           buildBuyer(order.user, order.shippingAddressSnapshot, clientIp),
      shippingAddress: buildAddress(order.shippingAddressSnapshot),
      billingAddress:  buildAddress(order.billingAddressSnapshot),
      basketItems:     buildBasketItems(order.items),
    };

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        console.error('[Iyzico] Checkout form init error:', err);
        return reject(new Error('Payment gateway connection error'));
      }

      if (result.status !== 'success') {
        console.error('[Iyzico] Checkout form init failed:', result.errorMessage);
        return reject(new Error(result.errorMessage || 'Failed to initialize payment'));
      }

      resolve({
        token:              result.token,
        paymentPageUrl:     result.paymentPageUrl,
        checkoutFormContent: result.checkoutFormContent,
        tokenExpireTime:    result.tokenExpireTime,
      });
    });
  });
};

/**
 * Retrieves the payment result from Iyzico using the callback token.
 *
 * @param {string} token - The token received from Iyzico's callback
 * @returns {Promise<Object>} Iyzico payment result
 */
export const retrieveCheckoutResult = (token) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err, result) => {
      if (err) {
        console.error('[Iyzico] Retrieve error:', err);
        return reject(new Error('Failed to verify payment'));
      }

      resolve(result);
    });
  });
};
