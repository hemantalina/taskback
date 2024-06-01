import { Controller, Get,Res, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { User } from './user.entity';
import { UserService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Create User DTO:', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto): Promise<User> {
    console.log('Update User ID:', id);
    console.log('Update User DTO:', updateUserDto);
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    console.log('Delete User ID:', id);
    return this.userService.remove(Number(id));
  }

  @Get('/pdf')
  async getUserListPdf(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      const pdfBuffer: Buffer = await this.pdfService.generateUserListPdf(users);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Handle error response as needed
      res.status(500).send('Error generating PDF');
    }
  }
}
