import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { envs } from './config';
import { FavoriteModule } from './favorite/favorite.module';
import { JourneyModule } from './journey/journey.module';
import { PlaceModule } from './place/place.module';
import { ProductModule } from './product/product.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(envs.mongoUrl),
    PlaceModule,
    RatingModule,
    UserModule,
    JourneyModule,
    ProductModule,
    FavoriteModule,
    AuthModule,
    SearchModule,
    PaymentsModule,
    SubscriptionsModule,
    MailerModule,
  ],
  providers: [MailerService],
})
export class AppModule {}
