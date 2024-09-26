# wsl

Commands I use often.

## WSL (CLI)

```
wsl --shutdown
```

```
wsl --unregister Ubuntu
```

```
wsl --install Ubuntu
```

- [Basic commands for WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)

## WSL (Ubuntu)

**Node.js (via nvm), yarn and pnpm (node)**

> Shell - shellscript bash sh shell zsh

```
wget -qO- https://github.com/devcontainers/features/raw/main/src/node/install.sh | sudo bash
```

**Python (python)**

> Shell - shellscript bash sh shell zsh

```
wget -qO- https://github.com/devcontainers/features/raw/main/src/python/install.sh | sudo bash
```

- https://github.com/devcontainers/features/tree/main/src/node
- https://github.com/devcontainers/features/tree/main/src/python

## Visual Studio Code

> PowerShell - powershell ps ps1

```
Remove-Item -Path $env:APPDATA\Code -Recurse
```

> PowerShell - powershell ps ps1

```
Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
```

- [Uninstall Visual Studio Code](https://code.visualstudio.com/docs/setup/uninstall#_clean-uninstall)

**Install extensions**

> Shell - shellscript bash sh shell zsh

```sh
code --install-extension bierner.github-markdown-preview
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension GitHub.copilot
code --install-extension lkrms.inifmt
code --install-extension p42ai.refactor
code --install-extension Prisma.prisma
code --install-extension streetsidesoftware.code-spell-checker
```
