# wsl

Commands I use often.

## WSL (CLI)

```md
wsl --shutdown
```

```md
wsl --unregister Ubuntu
```

```md
wsl --install Ubuntu
```

- [Basic commands for WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)

## WSL (Ubuntu)

**Node.js (via nvm), yarn and pnpm (node)**

> shellscript bash sh shell zsh

```md
wget -qO- https://github.com/devcontainers/features/raw/main/src/node/install.sh | sudo bash
```

https://github.com/devcontainers/features/tree/main/src/node

**Python (python)**

> shellscript bash sh shell zsh

```md
wget -qO- https://github.com/devcontainers/features/raw/main/src/python/install.sh | sudo bash
```

https://github.com/devcontainers/features/tree/main/src/python

**CockroachDB**

> shellscript bash sh shell zsh

```md
export VERSION="cockroach-v24.1.7.linux-amd64" && \
wget https://binaries.cockroachdb.com/${VERSION}.tgz && \
tar -xvzf ${VERSION}.tgz && \
sudo cp ${VERSION}/cockroach /usr/local/bin/ && \
sudo mkdir -p /usr/local/lib/cockroach && \
sudo cp -i ${VERSION}/lib/libgeos.so /usr/local/lib/cockroach/ && \
sudo cp -i ${VERSION}/lib/libgeos_c.so /usr/local/lib/cockroach/ && \
rm -rf ${VERSION}.tgz ${VERSION} && \
which cockroach
```

https://www.cockroachlabs.com/docs/v24.3/install-cockroachdb-linux#install-binary

## Visual Studio Code

> powershell ps ps1

```md
Remove-Item -Path $env:APPDATA\Code -Recurse
```

> powershell ps ps1

```md
Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
```

- [Uninstall Visual Studio Code](https://code.visualstudio.com/docs/setup/uninstall#_clean-uninstall)

**Install extensions**

> shellscript bash sh shell zsh

```md
code --install-extension bradlc.vscode-tailwindcss & \
code --install-extension dbaeumer.vscode-eslint & \
code --install-extension esbenp.prettier-vscode & \
code --install-extension GitHub.copilot & \
code --install-extension Prisma.prisma & \
code --install-extension semanticdiff.semanticdiff & \
code --install-extension streetsidesoftware.code-spell-checker &
```

##

```md
wsl --shutdown; wsl --unregister Ubuntu; Remove-Item -Path $env:APPDATA\Code -Recurse; Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
```

```md
export PROJECT_NAME="my-app" && \
pnpx create-next-app@15 $PROJECT_NAME --yes --turbopack && \
cd $PROJECT_NAME && \
pnpm add --save-dev --save-exact prettier@3 && \
pnpm add --save-dev prettier-plugin-organize-imports@4 && \
pnpm add --save-dev prettier-plugin-tailwindcss@0.6 && \
echo '{ "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"] }' > .prettierrc
```
