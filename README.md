# WSL

**.wslconfig**

> ```md
> [wsl2]
> kernelCommandLine="sysctl.vm.swappiness=10"
> swap=4294967296
> networkingMode=mirrored
> ```

**Node.js (via nvm), yarn and pnpm (node)**

> shellscript bash sh shell zsh
>
> ```md
> wget -qO - https://github.com/devcontainers/features/raw/main/src/node/install.sh | sudo bash
> ```
>
> https://github.com/devcontainers/features/tree/main/src/node

**Python (python)**

> shellscript bash sh shell zsh
>
> ```md
> wget -qO - https://github.com/devcontainers/features/raw/main/src/python/install.sh | sudo bash
> ```
>
> https://github.com/devcontainers/features/tree/main/src/python

**CockroachDB**

> shellscript bash sh shell zsh
>
> ```md
> VERSION="cockroach-v21.2.17.linux-amd64" && \
> wget https://binaries.cockroachdb.com/${VERSION}.tgz && \
> tar -xvzf ${VERSION}.tgz && \
> sudo cp ${VERSION}/cockroach /usr/local/bin/ && \
> sudo mkdir -p /usr/local/lib/cockroach && \
> sudo cp -i ${VERSION}/lib/libgeos.so /usr/local/lib/cockroach/ && \
> sudo cp -i ${VERSION}/lib/libgeos_c.so /usr/local/lib/cockroach/ && \
> rm -rf ${VERSION}.tgz ${VERSION} && \
> which cockroach
> ```
>
> https://www.cockroachlabs.com/docs/v24.3/install-cockroachdb-linux#install-binary

**pnpm**

> shellscript bash sh shell zsh
>
> ```md
> curl -fsSL https://get.pnpm.io/install.sh | sh - && \
> source ~/.bashrc && \
> pnpm env use --global lts
> ```
>
> https://pnpm.io/installation#on-posix-systems
>
> https://pnpm.io/cli/env#use

# Visual Studio Code

> powershell ps ps1
>
> ```md
> Remove-Item -Path $env:APPDATA\Code -Recurse
> ```
>
> ```md
> Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
> ```
>
> https://code.visualstudio.com/docs/setup/uninstall#_clean-uninstall

**Install extensions**

> shellscript bash sh shell zsh
>
> ```md
> code --install-extension bradlc.vscode-tailwindcss & \
> code --install-extension dbaeumer.vscode-eslint & \
> code --install-extension esbenp.prettier-vscode & \
> code --install-extension Prisma.prisma & \
> code --install-extension semanticdiff.semanticdiff & \
> code --install-extension streetsidesoftware.code-spell-checker &
> wait
> ```

# More

> powershell ps ps1
>
> ```md
> wsl --shutdown; wsl --unregister Ubuntu; Remove-Item -Path $env:APPDATA\Code -Recurse; Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
> ```

> shellscript bash sh shell zsh
>
> **Next.js**
>
> > ```md
> > PROJECT_NAME="./my-app" && \
> > pnpm dlx create-next-app@15 $PROJECT_NAME --yes --turbopack && \
> > cd $PROJECT_NAME && \
> > pnpm add --save-dev prettier@3 && \
> > pnpm add --save-dev prettier-plugin-organize-imports@4 && \
> > pnpm add --save-dev prettier-plugin-tailwindcss@0.6 && \
> > echo '{ "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"] }' > .prettierrc
> > echo 'pnpm-lock.yaml' > .prettierignore
> > ```
> >
> > https://nextjs.org/docs/app/api-reference/cli/create-next-app
> >
> > https://prettier.io/docs/en/install
> >
> > https://github.com/simonhaenisch/prettier-plugin-organize-imports
> >
> > https://github.com/tailwindlabs/prettier-plugin-tailwindcss
> >
> > ```md
> > rm -rf .next/ node_modules/ pnpm-lock.yaml && pnpm install
> > ```
>
> **shadcn/ui**
>
> > ```md
> > pnpm dlx shadcn@latest init && \
> > pnpm dlx shadcn@latest add --all
> > ```
> >
> > https://ui.shadcn.com/docs/cli
>
> **Prisma**
>
> > ```md
> > pnpm add --save-dev prisma@6 && \
> > pnpm exec prisma init --datasource-provider sqlite --url file:./dev.db --with-model && \
> > pnpm exec prisma generate
> > ```
> >
> > https://www.prisma.io/docs/orm/reference/prisma-cli-reference#init
