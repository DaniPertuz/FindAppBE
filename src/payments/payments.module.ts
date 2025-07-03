import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PlaceModule } from '../place/place.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [PlaceModule, SubscriptionsModule, MailerModule],
})
export class PaymentsModule {}
