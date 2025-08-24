# wsl

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/haikalrowi/wsl)

|                                                                                                       |                                                                                             |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [![httpie](https://avatars.githubusercontent.com/u/24454777?s=48)](https://req.new)                   | [![t3chat](https://t3.chat/favicon.ico)](https://t3.chat)                                   |
| [![prettier](https://avatars.githubusercontent.com/u/25822731?s=48)](https://prettier.io/playground)  | [![cobalt](https://cobalt.tools/icons/maskable/48.png)](https://cobalt.tools)               |
| [![tailwindcss](https://avatars.githubusercontent.com/u/67109815?s=48)](https://play.tailwindcss.com) | [![deepl](https://avatars.githubusercontent.com/u/83310993?s=48)](https://www.deepl.com/en) |
| [![privatebin](https://avatars.githubusercontent.com/u/20367028?s=48)](https://privatebin.net)        | [![eva](https://colors.eva.design/favicon.ico)](https://colors.eva.design)                  |
| [![omatsuri](https://omatsuri.app/assets/favicon.ico)](https://omatsuri.app)                          | [![imagekit](https://imagekit.io/icons/icon-48x48.png)](https://imagekit.io/tools)          |
| [![grep](https://grep.app/icon.png)](https://grep.app)                                                |

<details>

<summary>

## inside your windows

</summary>

### .wslconfig

> ```md
> [wsl2]
> kernelCommandLine="sysctl.vm.swappiness=10"
> swap=4294967296
> networkingMode=mirrored
> ```

### reset wsl and remove vscode user data

> > powershell ps ps1
>
> **one line copy paste**
>
> ```md
> wsl --shutdown; wsl --unregister Ubuntu; Remove-Item -Path $env:APPDATA\Code -Recurse; Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
> ```
>
> <details>
>
> <summary>read more</summary>
>
> **reset wsl**
>
> ```md
> wsl --shutdown
> ```
>
> ```md
> wsl --unregister Ubuntu
> ```
>
> - https://learn.microsoft.com/en-us/windows/wsl/basic-commands
>
> **remove vscode user data**
>
> ```md
> Remove-Item -Path $env:APPDATA\Code -Recurse
> ```
>
> ```md
> Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
> ```
>
> - https://code.visualstudio.com/docs/setup/uninstall#_clean-uninstall
>
> </details>

</details>

<details>

<summary>

## inside your wsl

</summary>

### pnpm and node.js

> > shellscript bash sh shell zsh
>
> ```md
> curl -fsSL https://get.pnpm.io/install.sh | sh - &&
> source ~/.bashrc &&
> pnpm env use --global lts
> ```
>
> - https://pnpm.io/installation#on-posix-systems
> - https://pnpm.io/cli/env#use

### ghcr.io/devcontainers/features/common-utils

> > shellscript bash sh shell zsh
>
> ```md
> DFCU="./.dfcu" &&
> mkdir $DFCU &&
> cd $DFCU &&
> curl -LO https://github.com/devcontainers/features/raw/refs/heads/main/src/common-utils/install.sh &&
> curl -LO https://github.com/devcontainers/features/raw/refs/heads/main/src/common-utils/main.sh &&
> sudo INSTALLZSH="false" CONFIGUREZSHASDEFAULTSHELL="false" INSTALLOHMYZSH="false" INSTALLOHMYZSHCONFIG="false" UPGRADEPACKAGES="false" sh install.sh
> ```
>
> - https://github.com/devcontainers/features/tree/main/src/common-utils

### bun

> > shellscript bash sh shell zsh
>
> ```md
> curl -fsSL https://bun.com/install | bash
> ```
>
> - https://bun.com/docs/installation

</details>

<details>

<summary>

## inside your vscode

</summary>

### install extensions

> > shellscript bash sh shell zsh
>
> ```md
> code --install-extension bradlc.vscode-tailwindcss &
> code --install-extension dbaeumer.vscode-eslint &
> code --install-extension esbenp.prettier-vscode &
> code --install-extension fill-labs.dependi &
> code --install-extension streetsidesoftware.code-spell-checker &
> wait
> ```

### vercel/next.js

> > shellscript bash sh shell zsh
>
> ```md
> PROJECT_NAME="./" &&
> pnpm dlx create-next-app@15 $PROJECT_NAME --reset-preferences &&
> cd $PROJECT_NAME &&
> pnpm add --save-dev prettier@3 &&
> pnpm add --save-dev prettier-plugin-organize-imports@4 &&
> pnpm add --save-dev prettier-plugin-tailwindcss@0.6 &&
> echo "{\"plugins\":[\"prettier-plugin-organize-imports\",\"prettier-plugin-tailwindcss\"]}" > .prettierrc &&
> echo 'pnpm-lock.yaml' > .prettierignore
> ```
>
> - https://nextjs.org/docs/app/api-reference/cli/create-next-app
> - https://prettier.io/docs/install
> - https://github.com/simonhaenisch/prettier-plugin-organize-imports
> - https://github.com/tailwindlabs/prettier-plugin-tailwindcss
>
> > shellscript bash sh shell zsh
>
> ```
> echo "public-hoist-pattern[]=*eslint-plugin-*" > .npmrc
> ```
>
> > shellscript bash sh shell zsh
>
> ```md
> pnpm pkg set scripts.dev="rm -rf .next/ && next dev --turbopack" &&
> pnpm pkg set scripts.build="rm -rf .next/ && next build"
> ```
>
> > shellscript bash sh shell zsh
>
> ```md
> rm -rf node_modules/ pnpm-lock.yaml && pnpm install && pnpm outdated
> ```
>
>  <s>
>
> > shellscript bash sh shell zsh
>
> ```md
> pnpm install next-international@1
> ```
>
> - https://next-international.vercel.app/docs/app-setup
>
> </s>
>
> > shellscript bash sh shell zsh
>
> ```md
> pnpm add --save-dev husky@9 &&
> pnpm exec husky init
> ```
>
> - https://typicode.github.io/husky/get-started.html

### shadcn-ui/ui

> > shellscript bash sh shell zsh
>
> ```md
> pnpm dlx shadcn@2 add button
> ```
>
> - https://ui.shadcn.com/docs/tailwind-v4#changelog
> - https://ui.shadcn.com/docs/cli

### supabase/supabase

> > shellscript bash sh shell zsh
>
> ```md
> pnpm exec shadcn add https://supabase.com/ui/r/supabase-client-nextjs.json
> ```
>
> - https://supabase.com/ui/docs/nextjs/client

<s>

### prisma/prisma

> > shellscript bash sh shell zsh
>
> ```md
> pnpm add --save-dev prisma@6 &&
> pnpm exec prisma init --datasource-provider sqlite --url file:./dev.db --with-model &&
> pnpm exec prisma migrate dev --name init &&
> pnpm exec prisma migrate reset --force
> ```
>
> - https://www.prisma.io/docs/orm/reference/prisma-cli-reference#init

</s>

</details>
