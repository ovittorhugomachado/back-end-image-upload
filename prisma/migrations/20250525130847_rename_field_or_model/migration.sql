-- CreateTable
CREATE TABLE "usuário" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "image" VARCHAR(255),

    CONSTRAINT "usuário_pkey" PRIMARY KEY ("id")
);
