import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}
  

  async create(createRoleDto: CreateRoleDto) {
    const role =await this.prismaService.role.findFirst({
      where:{ name: createRoleDto.name },
    });

    if (role){
      throw new BadRequestException(`Role ${role.name} already exists`)
    }
    return this.prismaService.role.create({ data: createRoleDto });
  }

  async findAll() {
    return this.prismaService.role.findMany(); 
  }

  async findOne(id: number) {
    const role = await this.prismaService.role.findFirst({where:{id}});

    if(!role){
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prismaService.role.findFirst({where:{id}});

    if(!role){
      throw new NotFoundException('Role not found');
    }

    const doesRoleExist =await this.prismaService.role.findFirst({
      where:{ name: updateRoleDto.name },
    });

    if (doesRoleExist && doesRoleExist.id !== id){
      throw new BadRequestException(`Role ${role.name} already exists`)
    }
  
    return this.prismaService.role.update({
      where: {id},
      data: updateRoleDto,
    })
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
