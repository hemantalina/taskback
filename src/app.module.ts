import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PdfService } from './users/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'users.db',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
  ],
  providers: [PdfService],
})
export class AppModule {}
