# wsl

<table>
<tbody>
<tr>
<td>

[![grep.app](https://www.google.com/s2/favicons?sz=48&domain=grep.app)](https://grep.app/)

</td>
<td>

[![play.tailwindcss.com](https://www.google.com/s2/favicons?sz=48&domain=play.tailwindcss.com)](https://play.tailwindcss.com/)

</td>
<td>

[![colors.eva.design](https://www.google.com/s2/favicons?sz=48&domain=colors.eva.design)](https://colors.eva.design/)

</td>
<td>

[![omatsuri.app](https://www.google.com/s2/favicons?sz=48&domain=omatsuri.app)](https://omatsuri.app/)

</td>
<td>

[![pastes.dev](https://www.google.com/s2/favicons?sz=48&domain=pastes.dev)](https://pastes.dev/)

</td>
<td>

[![req.new](https://www.google.com/s2/favicons?sz=48&domain=req.new)](https://req.new/)

</td>
</tr>
<tr>
<td>

[![google.com/ai](https://www.google.com/s2/favicons?sz=48&domain=google.com)](https://google.com/ai)

</td>
<td>

[![translate.google.com](https://www.google.com/s2/favicons?sz=48&domain=translate.google.com)](https://translate.google.com/)

</td>
<td>

[![cobalt.tools](https://www.google.com/s2/favicons?sz=48&domain=cobalt.tools)](https://cobalt.tools/)

</td>
<td>

</td>
<td>

</td>
<td>

</td>
</tr>
</tbody>
</table>

## inside your windows

### .wslconfig

> ```md
> [wsl2]
> kernelCommandLine="sysctl.vm.swappiness=10"
> swap=4294967296
> networkingMode=mirrored
> ```

### wsl allow inbound connections

> ```md
> Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
> ```
>
> - https://learn.microsoft.com/en-us/windows/wsl/networking

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
> (
> cd $DFCU &&
> curl -LO https://github.com/devcontainers/features/raw/HEAD/src/common-utils/install.sh &&
> curl -LO https://github.com/devcontainers/features/raw/HEAD/src/common-utils/main.sh &&
> sudo INSTALLZSH="false" CONFIGUREZSHASDEFAULTSHELL="false" INSTALLOHMYZSH="false" INSTALLOHMYZSHCONFIG="false" UPGRADEPACKAGES="false" sh install.sh
> )
> ```
>
> - https://github.com/devcontainers/features/tree/main/src/common-utils

### bun (shellscript bash sh shell zsh)

> ```md
> curl -fsSL https://bun.com/install | bash
> ```
>
> - https://bun.com/docs/installation

### cloudflared (shellscript bash sh shell zsh)

> ```md
> sudo mkdir -p --mode=0755 /usr/share/keyrings &&
> curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null &&
> echo "deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list &&
> sudo apt-get update && sudo apt-get install cloudflared
> ```
>
> - https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/#1-download-and-install-cloudflared
> - https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/#use-trycloudflare
> - https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/run-parameters/

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
> pnpm dlx create-next-app@^16.0.0 $PROJECT_NAME &&
> cd $PROJECT_NAME &&
> pnpm dlx shadcn@latest add https://github.com/haikalrowi/wsl/raw/HEAD/registry/dist/next-prettier.json
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
> pnpm dlx shadcn@latest add https://github.com/haikalrowi/wsl/raw/HEAD/registry/dist/next-eslint.json
> ```
>
> </s>
>
> ```md
> rm -rf node_modules/ && pnpm install && pnpm outdated
> ```
>
> <s>
>
> ```md
> pnpm add next-international@^1
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
> pnpm dlx shadcn@latest add button
> ```
>
> - https://ui.shadcn.com/docs/changelog
> - https://ui.shadcn.com/docs/cli

### supabase/supabase (shellscript bash sh shell zsh)

> ```md
> pnpm dlx shadcn@latest add https://supabase.com/ui/r/supabase-client-nextjs.json
> ```
>
> - https://supabase.com/ui/docs/nextjs/client
