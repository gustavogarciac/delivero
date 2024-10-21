-- CreateTable
CREATE TABLE "deliverer_tokens" (
    "id" TEXT NOT NULL,
    "deliverer_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliverer_tokens_pkey" PRIMARY KEY ("id")
);
