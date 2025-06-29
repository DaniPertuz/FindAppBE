import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from '../config';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { PlaceService } from '../place/place.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  constructor(
    private placeService: PlaceService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, placeId, plan } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
          recurring: {
            interval: 'month' as Stripe.Price.Recurring.Interval,
          },
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        placeId,
        plan,
      },
      line_items: lineItems,
      mode: 'subscription',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret,
      );
    } catch (error) {
      res.status(400).send(`Webhook error: ${error.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        const placeId = session.metadata?.placeId;
        const plan = parseInt(session.metadata?.plan || '1', 10);
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (placeId && [1, 2, 3].includes(plan)) {
          await this.placeService.update(placeId, {
            premium: plan as 1 | 2 | 3,
          });
          await this.subscriptionsService.create({
            placeId,
            plan,
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
          });
        }

      default:
        console.log(`Event ${event.type} not handled`);
        break;
    }

    return res.status(200).json({ sig });
  }
}
