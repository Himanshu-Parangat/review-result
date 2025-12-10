###############################################################
#  ____        _ _     _   ____                               #
# | __ ) _   _(_) | __| | |  _ \ _ __ ___   ___ ___  ___ ___  #
# |  _ \| | | | | |/ _` | | |_) | '__/ _ \ / __/ _ \/ __/ __| #
# | |_) | |_| | | | (_| | |  __/| | | (_) | (_|  __/\__ \__ \ #
# |____/ \__,_|_|_|\__,_| |_|   |_|  \___/ \___\___||___/___/ #
###############################################################
                                                           


##############################
# Colors                     #
##############################
Red=\033[0;31m
Green=\033[0;32m
Yellow=\033[0;33m
Blue=\033[0;34m
Purple=\033[0;35m
Cyan=\033[0;36m
Gray=\033[0;90m
Reset=\033[0m

##############################
# Variables                  #
##############################
APPLICATION_NAME =Review Result
DRIZZLE = npx drizzle-kit
CONFIG = drizzle.config.ts

.DEFAULT_GOAL := help

.PHONY: help build dev preview start clean \
        db-generate db-migrate db-studio db-reset install reinstall check setup


%:
	@printf "${Gray}[Dead]${Cyan} The target ${Red}'$@'${Cyan} is not hooked up to anything meaningful.${Reset}"
	@printf "\n${Yellow}[Hint]${Cyan} Try running ${Green}'make help'${Cyan} for usage information.${Reset}\n"


##############################
# Help Menu                  #
##############################
help:
	@printf "\n${Cyan}[Greeting] This Makefile is for Automating Build process for Application ${Reset}"
	@printf "${Blue} ${APPLICATION_NAME} ${Reset} \n\n"
	@printf "\n${Purple}Usage:${Reset} make <target>\n\n"

	@printf "${Blue}Application Targets:${Reset}\n"
	@printf "  ${Purple}build${Reset}        Build the Astro project\n"
	@printf "  ${Purple}dev${Reset}          Start development server\n"
	@printf "  ${Purple}preview${Reset}      Preview production build\n"
	@printf "  ${Purple}start${Reset}        Run compiled server\n"
	@printf "  ${Purple}clean${Reset}        Remove build artifacts\n\n"

	@printf "${Blue}Database Targets (Drizzle):${Reset}\n"
	@printf "  ${Purple}db-generate${Reset}  Generate migration files\n"
	@printf "  ${Purple}db-migrate${Reset}   Apply migrations\n"
	@printf "  ${Purple}db-studio${Reset}    Open Drizzle Studio\n"
	@printf "  ${Purple}db-reset${Reset}     Reset DB + migrations\n\n"

	@printf "${Blue}Setup & Maintenance:${Reset}\n"
	@printf "  ${Purple}install${Reset}      Install npm dependencies\n"
	@printf "  ${Purple}reinstall${Reset}    Clean & reinstall dependencies\n"
	@printf "  ${Purple}check${Reset}        Run environment checks\n"
	@printf "  ${Purple}setup${Reset}        Run full project setup\n\n"

	@printf "${Red}Example:${Reset}\n"
	@printf "  ${Yellow}make check${Reset}  ${Gray}- this will check for project dependencies\n"
	@printf "  ${Yellow}make setup${Reset}   ${Gray}- this will run full project setup\n"
	@printf "  ${Yellow}make dev${Reset}     ${Gray}- this will run the dev server\n"


##############################
# App Commands               #
##############################
build:
	@printf "${Cyan}[build] Building project...${Reset}\n"
	npm run build

dev:
	@printf "${Cyan}[dev] Starting dev server...${Reset}\n"
	npm run dev

preview:
	@printf "${Cyan}[preview] Previewing production build...${Reset}\n"
	npm run preview

start:
	@printf "${Cyan}[start] Starting compiled server...${Reset}\n"
	node ./dist/server/entry.mjs

clean:
	@printf "${Cyan}[clean] Removing build artifacts...${Reset}\n"
	rm -rf ./.astro
	rm -rf ./dist

##############################
# Database Commands          #
##############################
db-generate:
	@printf "${Cyan}[db-generate] Generating migrations...${Reset}\n"
	@if [ -z "${name}" ]; then \
		printf "\n${Red}✖ Missing migration name!${Reset}\n"; \
		printf "${Yellow}Usage:${Reset} make db-generate name=<migration_name>\n\n"; \
		exit 1; \
	fi
	@printf "\n${Cyan}[db-generate]${Reset} Creating migration: ${Green}${name}${Reset}\n"
	${DRIZZLE} generate --config=${CONFIG} --name="${name}"
	@printf "${Green}✔ Migration generated successfully!${Reset}\n"


db-migrate:
	@printf "${Cyan}[db-migrate] Applying migrations...${Reset}\n"
	${DRIZZLE} migrate --config=${CONFIG}
	@printf "\n${Cyan}[db-migrate]${Reset} Applying migrations...\n"
	@if ${DRIZZLE} migrate --config=${CONFIG}; then \
		printf "${Green}✔ All migrations applied successfully!${Reset}\n"; \
	else \
		printf "${Red}✖ Migration failed!${Reset}\n"; \
		exit 1; \
	fi


db-studio:
	@printf "${Cyan}[db-studio] Opening Drizzle Studio...${Reset}\n"
	${DRIZZLE} studio --config=${CONFIG}

db-reset:
	@printf "${Cyan}[db-reset] Resetting database and migrations...${Reset}\n"
	rm -f src/db/*.db
	rm -rf drizzle/*
	@printf "${Red}Database and migrations reset.${Reset}\n"

################################
# Dependency & Setup Targets   #
################################

install:
	@printf "${Cyan}[install] Installing dependencies...${Reset}\n"
	npm install

reinstall:
	@printf "${Cyan}[reinstall] Removing node_modules and reinstalling...${Reset}\n"
	rm -rf node_modules package-lock.json
	npm install

check:
	@printf "${Cyan}[checks] Running environment checks...${Reset}\n"
	@printf "Node: "
	@node -v || (printf "${Red}Missing Node.js${Reset}\n" && exit 1)
	@printf "npm: "
	@npm -v || (printf "${Red}Missing npm${Reset}\n" && exit 1)
	@printf "Drizzle: "
	@${DRIZZLE} --version || (printf "${Red}Missing drizzle-kit${Reset}\n" && exit 1)
	@printf "${Green}All good!${Reset}\n"

setup:
	@printf "${Cyan}[setup] Project setup started...${Reset}\n"
	npm install
	${DRIZZLE} migrate --config=${CONFIG}
	npm run build
	@printf "${Green}Project fully set up!${Reset}\n"
