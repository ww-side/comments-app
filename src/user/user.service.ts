import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';
import { validate } from 'class-validator';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private generateJwtToken(user: UserEntity): string {
    const payload = { id: user.id, username: user.username, email: user.email };
    const secretKey = process.env.JWT_SECRET_KEY;
    const options = { expiresIn: '24h' };

    return jwt.sign(payload, secretKey, options);
  }

  async registration(createUserDto: CreateUserDto) {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = bcrypt.hashSync(createUserDto.password, 7);
    user.email = createUserDto.email;

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new BadRequestException('User with this username already exists.');
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException('User with this email already exists.');
    }

    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.userRepository.save(user);

    return { message: 'User successfully registered' };
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException(`This user doesn't exist.`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.generateJwtToken(user);

    return { token };
  }
}
