# 🚀 Деплой Storybook на Chromatic

## Шаг 1 — Зарегистрируйся на Chromatic

Перейди на **[chromatic.com](https://www.chromatic.com)**  
→ Sign in with GitHub  
→ Add project → выбери репозиторий `kayf-ui`  
→ Chromatic выдаст тебе **Project Token** (выглядит как `chpt_abc123xyz`)

---

## Шаг 2 — Добавь токен в GitHub Secrets

В репозитории:  
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

```
Name:  CHROMATIC_PROJECT_TOKEN
Value: chpt_abc123xyz  ← твой токен
```

---

## Шаг 3 — Установи Chromatic

```bash
npm install --save-dev chromatic
```

---

## Шаг 4 — Первый деплой (вручную)

```bash
npx chromatic --project-token=chpt_abc123xyz
```

После этой команды Chromatic выведет ссылку:
```
✔ Build 1 published
  View your Storybook at https://main--abc123.chromatic.com
```

---

## Шаг 5 — Обнови README

Замени `YOUR_CHROMATIC_ID` в `package.json` на реальный ID из URL.

В `README.md` добавь badge и ссылку:

```markdown
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?style=flat-square&logo=storybook&logoColor=white&labelColor=0a0a0f)](https://main--YOUR_ID.chromatic.com)
```

---

## Шаг 6 — Автодеплой настроен ✅

Файл `.github/workflows/chromatic.yml` уже в проекте.  
Теперь каждый `git push main` → автоматически деплоит новую версию Storybook.

```bash
git add .
git commit -m "feat: add Chromatic CI"
git push
```

---

## Итог

| Что | Где |
|-----|-----|
| Storybook live | `https://main--YOUR_ID.chromatic.com` |
| Каждый PR | preview URL в комментарии к PR |
| Visual diff | автоматически на каждый push |
| Бесплатно | до 5,000 snapshots / месяц |

---

## TurboSnap (уже включён)

В `chromatic.config.ts` включён `onlyChanged: true` — Chromatic будет тестировать **только сторис, которые затронул твой коммит**. Это экономит snapshots и ускоряет CI в ~3-5 раз по мере роста библиотеки.
