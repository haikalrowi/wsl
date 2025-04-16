# wsl

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/haikalrowi/wsl)

|                                                                                                        |                                                                     |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [![httpie](https://avatars.githubusercontent.com/u/24454777?s=50)](https://req.new)                    | [![t3chat](https://t3.chat/favicon.ico)](https://t3.chat)           |
| [![prettier](https://avatars.githubusercontent.com/u/25822731?s=50)](https://prettier.io/playground)   | [![cobalt](https://cobalt.tools/favicon.png)](https://cobalt.tools) |
| [![tailwindcss](https://avatars.githubusercontent.com/u/67109815?s=50)](https://play.tailwindcss.com/) |                                                                     |
| [![privatebin](https://avatars.githubusercontent.com/u/20367028?s=50)](https://privatebin.net/)        |                                                                     |

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
> code --install-extension Prisma.prisma &
> code --install-extension semanticdiff.semanticdiff &
> code --install-extension streetsidesoftware.code-spell-checker &
> wait
> ```

### vercel/next.js

> > shellscript bash sh shell zsh
>
> ```md
> PROJECT_NAME="./my-app" &&
> pnpm dlx create-next-app@15 $PROJECT_NAME &&
> cd $PROJECT_NAME &&
> pnpm add --save-dev prettier@3 &&
> pnpm add --save-dev prettier-plugin-organize-imports@4 &&
> pnpm add --save-dev prettier-plugin-tailwindcss@0.6 &&
> echo '{ "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"] }' > .prettierrc &&
> echo 'pnpm-lock.yaml' > .prettierignore
> ```
>
> - https://nextjs.org/docs/app/api-reference/cli/create-next-app
> - https://prettier.io/docs/install
> - https://github.com/simonhaenisch/prettier-plugin-organize-imports
> - https://github.com/tailwindlabs/prettier-plugin-tailwindcss
>
> ```md
> rm -rf .next/ node_modules/ pnpm-lock.yaml && pnpm install
> ```

### shadcn-ui/ui

> > shellscript bash sh shell zsh
>
> ```md
> pnpm add --save-dev shadcn@2.4 &&
> pnpm exec shadcn init &&
> pnpm exec shadcn add button
> ```
>
> - https://ui.shadcn.com/docs/cli

### supabase/supabase

> > shellscript bash sh shell zsh
>
> ```md
> pnpm exec shadcn add https://supabase.com/ui/r/supabase-client-nextjs.json
> ```
>
> - https://supabase.com/ui/docs/nextjs/client

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

</details>
