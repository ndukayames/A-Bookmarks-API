import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SigninDto, SignupDto } from 'src/auth/dto';
import { Prisma } from '@prisma/client';
import { UpdateProfileDto } from 'src/user/dto';
import { NewBookmarkDto } from 'src/bookmark/dto';
import { UpdateBookmarkDto } from 'src/bookmark/dto/update-bookmark.dto';
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

  describe('Users', () => {
    let user;
    describe('Get profile data', () => {
      it('should get profile data', async () => {
        await pactum
          .spec()
          .get('/users/me')
          .expectStatus(200)
          .stores('user', 'res.body')
          .withBearerToken(`$S{access_token}`)
          .end();
      });
    });
    describe('Profile MManagment', () => {
      it('should update basic data', async () => {
        const userUpdateDto: UpdateProfileDto = {
          firstName: 'nduka',
          lastName: 'yames',
        };
        const response = await pactum
          .spec()
          .patch('/users/me')
          .withBearerToken(`$S{access_token}`)
          .withJson(userUpdateDto)
          .expectStatus(200)
          .end();

        expect(response.body.firstName).toEqual(userUpdateDto.firstName);
        expect(response.body.lastName).toEqual(userUpdateDto.lastName);
      });
      it('should change email', async () => {
        const newEmail = { email: 'jamesobi15@gmail.com' };

        const response = await pactum
          .spec()
          .patch('/users/change-email')
          .withBearerToken(`$S{access_token}`)
          .withJson(newEmail)
          .expectStatus(200)
          .end();

        expect(response.body.email).toEqual(newEmail.email);
      });
      it('should log in with updated email', async () => {
        const signinData = {
          email: 'jamesobi15@gmail.com',
          password: 'test',
        };
        const response = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinData)
          .expectStatus(200)
          .stores('access_token', 'access_token');
      });
      it('should change password', async () => {
        const newPassword = { password: 'winnerjoy' };

        const response = await pactum
          .spec()
          .patch('/users/change-password')
          .withBearerToken(`$S{access_token}`)
          .withJson(newPassword)
          .expectStatus(200)
          .end();
      });
      it('should log in with updated password', async () => {
        const signinData = {
          email: 'jamesobi15@gmail.com',
          password: 'winnerjoy',
        };
        const response = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinData)
          .expectStatus(200)
          .stores('access_token', 'access_token');
      });
      it('should delete user account', async () => {
        const response = await pactum
          .spec()
          .delete('/users/me')
          .withBearerToken(`$S{access_token}`)
          .expectStatus(200)
          .end();
      });
    });
  });
  describe('Bookmarks', () => {
    const signupData: SignupDto = {
      email: 'tzirw@example.com',
      password: 'test',
    };
    const signinData: SigninDto = {
      email: 'tzirw@example.com',
      password: 'test',
    };
    it('should create new user', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(signupData)
        .expectStatus(201);
    });
    it('should signin new user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(signinData)
        .expectStatus(200)
        .stores('access_token', 'access_token');
    });
    it("should create user's boomark", async () => {
      const newBookmarkDto: NewBookmarkDto = {
        title: 'first bookmark',
        link: 'http://example.com',
        description: 'This is my first bookmark',
      };

      const response = await pactum
        .spec()
        .post('/bookmarks')
        .withJson(newBookmarkDto)
        .withBearerToken(`$S{access_token}`)
        .stores('bookmarkId', 'id')
        .expectStatus(201);

      expect(response.body.id).toBeDefined();
    });
    it("should update user's boomark", async () => {
      const updateBookmarkDto: UpdateBookmarkDto = {
        title: 'first bookmark updated',
      };
      const response = await pactum
        .spec()
        .patch('/bookmarks/{id}')
        .withPathParams('id', `$S{bookmarkId}`)
        .withJson(updateBookmarkDto)
        .withBearerToken(`$S{access_token}`)
        .expectStatus(200);

      expect(response.body.title).toMatch(updateBookmarkDto.title);
    });
    it("should get user's boomarks", async () => {
      const response = await pactum
        .spec()
        .get('/bookmarks/all')
        .withPathParams('id', `$S{bookmarkId}`)
        .withQueryParams('page', '1')
        .withQueryParams('limit', '10')
        .withBearerToken(`$S{access_token}`)
        .expectStatus(200);
      console.dir(response.body);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
