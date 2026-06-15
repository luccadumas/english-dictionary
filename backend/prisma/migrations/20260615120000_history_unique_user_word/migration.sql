-- Remove duplicate history rows, keeping the most recent per user/word pair.
DELETE FROM "history" h1
USING "history" h2
WHERE h1.user_id = h2.user_id
  AND h1.word_id = h2.word_id
  AND (
    h1.created_at < h2.created_at
    OR (h1.created_at = h2.created_at AND h1.id < h2.id)
  );

-- CreateIndex
CREATE UNIQUE INDEX "history_user_id_word_id_key" ON "history"("user_id", "word_id");
