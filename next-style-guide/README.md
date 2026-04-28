## create

```md
PROJECT_NAME="./" &&
pnpm dlx create-next-app@^16.0.0 $PROJECT_NAME &&
cd $PROJECT_NAME &&
pnpm dlx shadcn@latest add https://github.com/haikalrowi/wsl/raw/HEAD/registry/dist/next-prettier.json
```

- https://nextjs.org/docs/app/api-reference/cli/create-next-app
- https://prettier.io/docs/install
- https://github.com/simonhaenisch/prettier-plugin-organize-imports
- https://github.com/tailwindlabs/prettier-plugin-tailwindcss

## development

```md
rm -rf .next/ && pnpm run dev
```

```md
rm -rf .next/ && pnpm run build && pnpm run start
```

```md
rm -rf node_modules/ && pnpm install && pnpm outdated
```

## with `next-international`

```md
pnpm add next-international@^1.0.0
```

- https://next-international.vercel.app/docs/app-setup

## with `shadcn`

```md
pnpm dlx shadcn@latest add button
```

```md
ls components/ui | cut -d . -f 1 | xargs pnpm dlx shadcn@latest add --yes --overwrite
```

- https://ui.shadcn.com/docs/cli
- https://ui.shadcn.com/docs/changelog

## with `supabase.com`

```md
pnpm dlx shadcn@latest add https://supabase.com/ui/r/supabase-client-nextjs.json
```

- https://supabase.com/ui/docs/nextjs/client

## with `husky`

```md
pnpm add --save-dev husky@^9.0.0 &&
pnpm exec husky init
```

- https://typicode.github.io/husky/get-started.html
