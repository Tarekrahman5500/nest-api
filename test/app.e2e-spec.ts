import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { CustomExceptionFilter } from "../src/error-handler/http-exception.filter";
import * as morgan from "morgan";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "../src/bookmark/dto";


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
          .stores("userAt", "access_token");

      });
    });
  });

  describe("User", () => {

    describe("Get me", () => {

      it("should return user", () => {
        return pactum.spec()
          .get("/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200);

      });

    });
    describe("Edit user", () => {
      it("should return edit  user", () => {
        const dto: EditUserDto = { firstName: "kkc", email: "valid@example.com" };
        return pactum.spec()
          .patch("/users")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName);

      });
    });
  });

  describe("Bookmarks", () => {

    describe(" get empty bookmark", () => {

      it("should return bookmarks", () => {

        return pactum.spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .expectBodyContains([]);

      });
    });

    describe("Create bookmark", () => {

      const dto: CreateBookmarkDto = {
        title: " First Book",
        link: "wferfrgvlkrlrf",
        description: "12132rf43f"
      };

      it("should return created bookmark", () => {

        return pactum.spec()
          .post("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .withBody(dto)
          .expectStatus(201)
          .stores("bookmarkId", "id");
      });

    });

    describe("Get bookmarks", () => {

      it("should return bookmarks", () => {

        return pactum.spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });

    });
    describe("Get bookmark by id", () => {

      it("should return bookmark by id", () => {

        return pactum.spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .expectBodyContains("$S{bookmarkId}");
      });

    });
    describe("Edit bookmark by id", () => {

      const dto: EditBookmarkDto = { description: "new bookmark description" };
      it("should return Edit bookmark by id", () => {

        return pactum.spec()
          .patch("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withBody(dto)
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .expectBodyContains(dto.description);
      });
    });

    describe("Delete bookmark", () => {

      it("should return remove bookmark by id", () => {

        return pactum.spec()
          .delete("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(204);

      });
	  
	  
      it("should return empty bookmarks", () => {

        return pactum.spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .expectJsonLength(0);

      });

    });
  });

});