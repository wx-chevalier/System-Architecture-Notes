import { Module } from '@nestjs/common';

import { AgreementsModule } from '@agreements/main/agreements-module';

@Module({
  imports: [AgreementsModule],
})
export class AppModule {}
