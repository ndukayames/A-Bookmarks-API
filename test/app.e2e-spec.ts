import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SigninDto, SignupDto } from 'src/auth/dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3001);
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3001');
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const signupData: SignupDto = {
      email: 'tzirw@example.com',
      password: 'test',
    };
    const signinData: SigninDto = {
      email: 'tzirw@example.com',
      password: 'test',
    };
    describe('Signup', () => {
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupData)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinData)
          .expectStatus(200)
          .stores('access_token', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get profile data', () => {
      it('should get profile data', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(200)
          .withBearerToken(`$S{access_token}`);
      });
    });
  });
  it.todo('todo should pass');
});
