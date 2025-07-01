import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Post('cancel-subscription')
  cancelSubscription(@Body() dto: CancelSubscriptionDto) {
    return this.paymentsService.cancelSubscription(dto);
  }

  @Get('success')
  success() {
    return {
      ok: 'true',
      message: 'Payment was successful',
    };
  }

  @Get('cancel')
  cancel() {
    return {
      ok: 'true',
      message: 'Payment was cancelled',
    };
  }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
