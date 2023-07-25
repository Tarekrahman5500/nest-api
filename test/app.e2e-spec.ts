import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { CustomExceptionFilter } from "../src/error-handler/http-exception.filter";
import * as morgan from "morgan";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "../src/auth/dto";


describe("App e2e", () => {
  let app: INestApplication;
  let prima: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({

      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new CustomExceptionFilter());
    app.use(morgan("dev"));
    app.setGlobalPrefix("/api");
    await app.init();
    await app.listen(3333);
    prima = app.get(PrismaService);
    await prima.cleanDB();
    pactum.request.setBaseUrl("http://localhost:3333/api");
  });
  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const dto: AuthDto = { email: "valid@example.com", password: "123" };
    describe("Sign up", () => {

      it("should throw an error if email empty", () => {
        return pactum.spec()
          .post("/auth/signup"
          ).withBody({ password: dto.password }).expectStatus(400);

      });
      it("should throw an error if password empty", () => {
        return pactum.spec()
          .post("/auth/signup"
          ).withBody({ email: dto.email }).expectStatus(400);

      });
      it("should throw an error if email and password empty", () => {
        return pactum.spec()
          .post("/auth/signup"
          ).expectStatus(400);

      });
      it("should be sign up", () => {
        return pactum.spec()
          .post("/auth/signup"
          ).withBody(dto).expectStatus(201);
      });
    });
    describe("Signing", () => {

      it("should throw an error if email empty", () => {
        return pactum.spec()
          .post("/auth/signin"
          ).withBody({ password: dto.password }).expectStatus(400);

      });
      it("should throw an error if password empty", () => {
        return pactum.spec()
          .post("/auth/signin"
          ).withBody({ email: dto.email }).expectStatus(400);

      });
      it("should throw an error if email and password empty", () => {
        return pactum.spec()
          .post("/auth/signin"
          ).expectStatus(400);

      });
      it("should be sign in", () => {
        return pactum.spec()
          .post("/auth/signin"
          ).withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');

      });
    });
  });

  describe("User", () => {

    describe("Get me", () => {

      it("should return user", () => {
        return pactum.spec()
          .get("/users/me")
           .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect();
      });

    });
    describe("Edit user", () => {

    });
  });

  describe("Bookmarks", () => {
    describe("Create bookmark", () => {

    });

    describe("Get bookmarks", () => {

    });
    describe("Get bookmark by id", () => {

    });
    describe("Edit bookmark", () => {

    });

    describe("Delete bookmark", () => {

    });
  });

});