DROP INDEX IF EXISTS "words_word_idx";

CREATE INDEX "favorites_user_id_created_at_idx" ON "favorites"("user_id", "created_at" DESC);
CREATE INDEX "history_user_id_created_at_idx" ON "history"("user_id", "created_at" DESC);
