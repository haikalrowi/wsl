# wsl

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/haikalrowi/wsl)

|                                                                                                                 |                                                                                                        |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [![httpie](https://www.google.com/s2/favicons?sz=48&domain=req.new)](https://req.new)                           | [![t3chat](https://www.google.com/s2/favicons?sz=48&domain=t3.chat)](https://t3.chat)                  |
| [![prettier](https://www.google.com/s2/favicons?sz=48&domain=prettier.io)](https://prettier.io/playground)      | [![cobalt](https://www.google.com/s2/favicons?sz=48&domain=cobalt.tools)](https://cobalt.tools)        |
| [![tailwindcss](https://www.google.com/s2/favicons?sz=48&domain=tailwindcss.com)](https://play.tailwindcss.com) | [![deepl](https://www.google.com/s2/favicons?sz=48&domain=www.deepl.com)](https://www.deepl.com)       |
| [![privatebin](https://www.google.com/s2/favicons?sz=48&domain=pastes.dev)](https://pastes.dev)                 | [![eva](https://www.google.com/s2/favicons?sz=48&domain=colors.eva.design)](https://colors.eva.design) |
| [![omatsuri](https://www.google.com/s2/favicons?sz=48&domain=omatsuri.app)](https://omatsuri.app)               |                                                                                                        |
| [![grep](https://www.google.com/s2/favicons?sz=48&domain=grep.app)](https://grep.app)                           |

## inside your windows

### .wslconfig

> ```md
> [wsl2]
> kernelCommandLine="sysctl.vm.swappiness=10"
> swap=4294967296
> networkingMode=mirrored
> ```

### reset wsl and remove vscode user data

> **one line copy paste (powershell ps ps1)**
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

## inside your wsl

### pnpm and node.js (shellscript bash sh shell zsh)

> ```md
> curl -fsSL https://get.pnpm.io/install.sh | sh - &&
> source ~/.bashrc &&
> pnpm env use --global lts
> ```
>
> - https://pnpm.io/installation#on-posix-systems
> - https://pnpm.io/cli/env#use

### ghcr.io/devcontainers/features/common-utils (shellscript bash sh shell zsh)

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

### bun (shellscript bash sh shell zsh)

> ```md
> curl -fsSL https://bun.com/install | bash
> ```
>
> - https://bun.com/docs/installation

## inside your vscode

### install extensions (shellscript bash sh shell zsh)

> ```md
> code --install-extension bradlc.vscode-tailwindcss &
> code --install-extension dbaeumer.vscode-eslint &
> code --install-extension esbenp.prettier-vscode &
> code --install-extension streetsidesoftware.code-spell-checker &
> wait
> ```

### vercel/next.js (shellscript bash sh shell zsh)

> ```md
> PROJECT_NAME="./" &&
> pnpm dlx create-next-app@^16 $PROJECT_NAME &&
> cd $PROJECT_NAME &&
> pnpm dlx shadcn add https://github.com/haikalrowi/wsl/raw/refs/heads/main/registry/dist/next-prettier.json
> ```
>
> - https://nextjs.org/docs/app/api-reference/cli/create-next-app
> - https://prettier.io/docs/install
> - https://github.com/simonhaenisch/prettier-plugin-organize-imports
> - https://github.com/tailwindlabs/prettier-plugin-tailwindcss
>
> ```md
> rm -rf .next/ && pnpm run dev
> ```
>
> ```md
> rm -rf .next/ && pnpm run build && pnpm run start
> ```
>
> <s>
>
> ```
> pnpm dlx shadcn add https://github.com/haikalrowi/wsl/raw/refs/heads/main/registry/dist/next-eslint.json
> ```
>
> </s>
>
> ```md
> pnpm pkg set scripts.predev="rm -rf .next/" &&
> pnpm pkg set scripts.prebuild="rm -rf .next/"
> ```
>
> ```md
> rm -rf node_modules/ pnpm-lock.yaml && pnpm install && pnpm outdated
> ```
>
> <s>
>
> ```md
> pnpm install next-international@^1
> ```
>
> - https://next-international.vercel.app/docs/app-setup
>
> </s>
>
> ```md
> pnpm add --save-dev husky@^9 &&
> pnpm exec husky init
> ```
>
> - https://typicode.github.io/husky/get-started.html

### shadcn-ui/ui (shellscript bash sh shell zsh)

> ```md
> pnpm dlx shadcn add button
> ```
>
> - https://ui.shadcn.com/docs/tailwind-v4#changelog
> - https://ui.shadcn.com/docs/cli

### supabase/supabase (shellscript bash sh shell zsh)

> ```md
> pnpm exec shadcn add https://supabase.com/ui/r/supabase-client-nextjs.json
> ```
>
> - https://supabase.com/ui/docs/nextjs/client
