import 'server-only';
import Stripe from 'stripe';

// sem apiVersion fixa no construtor - usa a padrao da conta, evita quebrar em cada upgrade do SDK
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);