import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '../mailer/mailer.service';
import { PlaceService } from '../place/place.service';
import { Subscription } from './entities/subscription.entity';
import { getPremiumHtml } from '../utils/mailerHtml';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    private readonly mailerService: MailerService,
    private readonly placeService: PlaceService,
  ) {}

  async create(data: Partial<Subscription>) {
    const subscription = await this.subscriptionModel.create(data);

    const place = await this.placeService.findOne(data.placeId);
    if (place.email) {
      const html = getPremiumHtml(data.premium, place.email);
      await this.mailerService.sendMail(place.email, html, data.premium);
    }

    return subscription;
  }
}
