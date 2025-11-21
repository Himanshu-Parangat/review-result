# Review Result


```text
.
├── astro.config.mjs
├── drizzle.config.ts
├── LICENSE
├── Makefile
├── package.json
├── package-lock.json
├── public
│   └── favicon
│       └── R-favicon.ico
├── README.md
├── src
│   ├── components
│   │   ├── CopyrightNotice.astro
│   │   ├── TextSizeSwitcher.astro
│   │   └── ThemeSwitcher.astro
│   ├── config.ts
│   ├── db
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── store.db
│   ├── layouts
│   │   └── BaseLayout.astro
│   ├── pages
│   │   ├── index.astro
│   │   └── status.astro
│   ├── styles
│   │   └── global.css
│   └── utils
│       ├── MainUtils.ts
│       └── SeedUtil.ts
└── tsconfig.json

10 directories, 22 files
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

Usage: `make <Command from below>` 


### Application Targets

| Command | Action                   |
| :------ | :----------------------- |
| build   | Build the Astro project  |
| dev     | Start development server |
| preview | Preview production build |
| start   | Run compiled server      |
| clean   | Remove build artifacts   |


### Database Targets (Drizzle)

| Command     | Action                   |
| :---------- | :----------------------- |
| db-generate | Generate migration files |
| db-migrate  | Apply migrations         |
| db-studio   | Open Drizzle Studio      |
| db-reset    | Reset DB + migrations    |


### Setup & Maintenance

| Command   | Action                         |
| :-------- | :----------------------------- |
| install   | Install npm dependencies       |
| reinstall | Clean & reinstall dependencies |
| check     | Run environment checks         |
| setup     | Run full project setup         |


### Example

| Command    | Action                     |
| :--------- | :------------------------- |
| make check | Check project dependencies |
| make setup | Run full project setup     |
| make dev   | Run the development server |


