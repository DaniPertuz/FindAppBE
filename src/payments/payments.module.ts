import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PlaceModule } from '../place/place.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [PlaceModule, SubscriptionsModule],
})
export class PaymentsModule {}
