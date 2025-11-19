DRIZZLE = npx drizzle-kit
CONFIG = drizzle.config.ts

.PHONY: migrate generate studio seed reset

generate:
	$(DRIZZLE) generate --config=$(CONFIG)

migrate:
	$(DRIZZLE) migrate --config=$(CONFIG)

studio:
	$(DRIZZLE) studio --config=$(CONFIG)

reset:
	rm -f src/db/*.db
	rm -rf drizzle/*
	echo "Database + migrations reset."
