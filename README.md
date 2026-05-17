# Дошка оголошень

Веб-застосунок типу "класифайди" — переглядай, шукай і публікуй оголошення.
Виконано як домашнє завдання **GoIT × Neoversity**.

🔗 **Live preview:** запусти локально, http://localhost:3000

---

## Стек

| Шар | Технологія |
|-----|------------|
| Backend | Node.js 20+ · **Express 5** |
| Шаблонізатор | **EJS** |
| ORM | **Prisma 6** |
| База даних | **SQLite** (`prisma/dev.db`) |
| Тести | **Vitest** · Supertest · Cheerio |
| Шрифти | Fraunces · Newsreader · JetBrains Mono *(Google Fonts)* |

---

## Швидкий старт

```bash
npm install
npm run setup          # копіює .env-файли та застосовує міграції (одноразово)
npm run dev            # http://localhost:3000
```

> **Що робить `setup`:** копіює `.env.example` → `.env` і `.env.test.example` → `.env.test`
> (якщо ще не існують), потім запускає `prisma migrate dev` для створення `dev.db`
> і генерації Prisma Client.

> `.env` і `.env.test` у `.gitignore` — реальні значення не комітяться.
> Шаблони `.env.example` / `.env.test.example` — тут саме для того, щоб у нового
> розробника був готовий старт.

### Корисні скрипти

```bash
npm run dev          # запустити сервер
npm test             # тести в watch-режимі
npm run test:run     # один прогін (~21 сек, 59 тестів)
npm run db:studio    # Prisma Studio на :5555
npm run db:reset     # скинути dev.db і перезастосувати міграції
```

---

## Маршрути

| Метод | Шлях | Призначення |
|-------|------|------------|
| `GET` | `/` | Список оголошень: пошук, сортування, пагінація (10/стор) |
| `GET` | `/announcements` | Форма створення |
| `POST` | `/announcements` | Створення з серверною валідацією |
| `GET` | `/announcements/:id` | Перегляд одного оголошення |
| `DELETE` | `/announcements/:id` | Видалення (204 No Content) |

Параметри `GET /`: `?search=&sort=newest|oldest&page=N` — усі опціональні, зберігаються в URL пагінації.

---

## Структура проєкту

```
.
├── app.js                            # composition root — createApp(prisma)
├── server.js                         # запуск listen() з config.port
├── routes/
│   └── announcements.js              # Express Router → controller
├── controllers/
│   └── announcementsController.js    # list, newForm, create, show, destroy
├── validators/
│   └── announcement.js               # pure-function серверна валідація
├── lib/
│   ├── config.js                     # завантаження .env / .env.test + валідація
│   ├── constants.js                  # HTTP_STATUS, VIEWS, SORT, VALIDATION тощо
│   ├── paths.js                      # route paths + URL helpers
│   └── messages.js                   # тексти повідомлень валідації
├── views/                            # EJS шаблони (index, show, new, 404, error)
├── public/
│   └── styles.css                    # editorial classifieds стилі
├── prisma/
│   ├── schema.prisma                 # модель Announcement
│   └── migrations/
└── tests/
    ├── setup.js                      # ізольована test.db, deleteMany в beforeEach
    ├── helpers.js                    # фабрики даних, парсер HTML
    └── *.test.js                     # integration tests по маршрутах
```

---

## Тести

**59 тестів** покривають:

- Список: пагінація, пошук, сортування, збереження параметрів у URL.
- Перегляд: повний рендер, 404 на неіснуючий і нечисловий id.
- Форма: HTML-валідація, всі 5 полів, правильні атрибути.
- Створення: серверна валідація кожного правила, збереження введених значень при помилці, `trim()` перед записом.
- Видалення: 204 на успіх, 404 на неіснуючий id.
- Помилки: 404 на невідомі маршрути, 500 на throw в обробнику.
- Валідатор: unit-тести pure-функції без HTTP.

Test DB — окремий файл `prisma/test.db` через `.env.test`, чиститься перед кожним тестом.

---

## Модель даних

```prisma
model Announcement {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  category    String   // 'sale' | 'service' | 'job' | 'other'
  price       Float
  contactInfo String
  createdAt   DateTime @default(now())
}
```

---

## Дизайн

**Editorial classifieds / old-school newspaper.**
Кремовий папір, друкарський вермільйон, заголовки на Fraunces, тіло на Newsreader, мета на JetBrains Mono. Жорсткі рамки і тіні-офсети без блюру, подвійні rules, category-stamps кольоровим квартетом (вермільйон / зелень / охра / плям), drop-cap на сторінці перегляду.
