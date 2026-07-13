## create

- ```md
  PROJECT_NAME="./" &&
  pnpm dlx create-next-app@^16.0.0 $PROJECT_NAME &&
  cd $PROJECT_NAME &&
  pnpm dlx shadcn@latest add haikalrowi/wsl/next-prettier &&
  pnpm dlx shadcn@latest add haikalrowi/wsl/next-env &&
  pnpm dlx shadcn@latest add haikalrowi/wsl/next-internationalization &&
  pnpm dlx shadcn@latest add haikalrowi/wsl/next-storyblok
  ```

- https://nextjs.org/docs/app/api-reference/cli/create-next-app
- https://prettier.io/docs/install
- https://github.com/tailwindlabs/prettier-plugin-tailwindcss
- https://nextjs.org/docs/app/guides/environment-variables
- https://next-international.vercel.app/docs/app-setup
- https://www.storyblok.com/docs/guides/nextjs

## development

- ```md
  rm -rf .next/ && pnpm run dev
  ```
- ```md
  rm -rf .next/ && pnpm run build && pnpm run start
  ```
- ```md
  rm -rf node_modules/ && pnpm install && pnpm outdated
  ```

## with `shadcn`

- ```md
  pnpm dlx shadcn@latest add button
  ```
- ```md
  node -e 'const fs=require("fs"),cp=require("child_process"),path="components/ui/",files=fs.readdirSync(path);if(files.length){cp.spawnSync("pnpm",["dlx","shadcn@latest","add","--yes","--overwrite",...files.filter(item=>fs.statSync(path+item).isFile()).map(item=>item.slice(0,item.lastIndexOf(".")))],{stdio:"inherit"})}'
  ```

- https://ui.shadcn.com/docs/cli
- https://ui.shadcn.com/docs/changelog

## with `supabase.com`

- ```md
  pnpm dlx shadcn@latest add https://supabase.com/ui/r/supabase-client-nextjs.json
  ```

- https://supabase.com/ui/docs/nextjs/client

## with `husky`

- ```md
  pnpm add --save-dev husky@^9.0.0 &&
  pnpm exec husky init
  ```

- https://typicode.github.io/husky/get-started.html
