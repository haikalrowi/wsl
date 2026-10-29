# wsl

<details>
<summary>
</summary>

- [![grep.app](https://www.google.com/s2/favicons?sz=32&domain=grep.app)](https://grep.app/)
  [![prettier.io/playground](https://www.google.com/s2/favicons?sz=32&domain=prettier.io)](https://prettier.io/playground)
  [![play.tailwindcss.com](https://www.google.com/s2/favicons?sz=32&domain=play.tailwindcss.com)](https://play.tailwindcss.com/)
  [![colors.eva.design](https://www.google.com/s2/favicons?sz=32&domain=colors.eva.design)](https://colors.eva.design/)
  [![omatsuri.app](https://www.google.com/s2/favicons?sz=32&domain=omatsuri.app)](https://omatsuri.app/)
  [![pastes.dev](https://www.google.com/s2/favicons?sz=32&domain=pastes.dev)](https://pastes.dev/)
  [![req.new](https://www.google.com/s2/favicons?sz=32&domain=req.new)](https://req.new/)
  [![cobalt.tools](https://www.google.com/s2/favicons?sz=32&domain=cobalt.tools)](https://cobalt.tools/)
  [![it-tools.tech](https://www.google.com/s2/favicons?sz=32&domain=it-tools.tech)](https://it-tools.tech/)
- [![google.com/ai](https://www.google.com/s2/favicons?sz=32&domain=google.com)](https://google.com/ai?q=.)
  [![search.brave.com/ask](https://www.google.com/s2/favicons?sz=32&domain=search.brave.com)](https://search.brave.com/ask?q=.)
  [![chat.mistral.ai/chat](https://www.google.com/s2/favicons?sz=32&domain=chat.mistral.ai)](https://chat.mistral.ai/chat?q=.)
  [![perplexity.ai](https://www.google.com/s2/favicons?sz=32&domain=perplexity.ai)](https://perplexity.ai/?q=.)
  [![chatgpt.com](https://www.google.com/s2/favicons?sz=32&domain=chatgpt.com)](https://chatgpt.com/?q=.)
- [![google.com/search?q=translate](https://www.google.com/s2/favicons?sz=32&domain=google.com)](https://google.com/search?q=translate)
  [![bing.com/search?q=translate](https://www.google.com/s2/favicons?sz=32&domain=bing.com)](https://bing.com/search?q=translate)

---

- https://grokipedia.com/page/Backus%E2%80%93Naur_form
- https://github.com/open-source/github-secure-open-source-fund/projects#:~:text=What%20are%20all%20the%20projects
- https://code.claude.com/docs/en/settings#exceptions-to-managed-settings-precedence

</details>

## in your windows

### `.wslconfig`

- ```md
  [wsl2]
  kernelCommandLine=sysctl.vm.swappiness=10
  swap=4GB
  networkingMode=mirrored
  ```

- https://learn.microsoft.com/en-us/windows/wsl/wsl-config#wslconfig

### `.cloud-init/default.user-data`

- ```yaml
  #cloud-config
  users:
    - name: p
      groups: [sudo]
      lock_passwd: false
      passwd: $6$Fkm85PlXFLb5FVWm$Fwt1BCuKkr86UY8VS.ogm6yrN.saXeWaLuFp.Vi9oKG58cUWdb4KnT4W/F6.STLczBFMAe1rm/T7OMST7dMZX1
      shell: /bin/bash
  write_files:
    - path: /etc/wsl.conf
      content: "\n[user]\ndefault=p\n"
      append: true
    - path: /etc/profile.d/confirm-run.sh
      content: |
        confirm_run() {
          [ ! -e "/var/tmp/.confirm-run-$1" ] && sudo -v && {
            printf "%s\n" "$(type "$1")"
            read -r -p "$1 [y/n]: " yn
            [ "$yn" = "y" ] || [ "$yn" = "n" ] && touch "/var/tmp/.confirm-run-$1"
            [ "$yn" = "y" ] && "$1"
            [ "$yn" = "y" ] || [ "$yn" = "n" ] || confirm_run "$1"
          }
        }

        p1() {
          mkdir -p ~/p ~/p-work && (cd ~/p && git clone https://github.com/haikalrowi/wsl)
        }

        p2() {
          bash -ci "$(curl -fsSL https://github.com/haikalrowi/wsl/raw/HEAD/install.sh)"
        }

        confirm_run p1
        confirm_run p2
  ```

- https://docs.cloud-init.io/en/latest/reference/datasources/wsl.html
- https://docs.cloud-init.io/en/latest/reference/modules.html
- https://docs.cloud-init.io/en/latest/reference/examples.html

### allow wsl inbound connections

- ```md
  Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
  ```

- https://learn.microsoft.com/en-us/windows/wsl/networking

### open vscode

- ```md
  code --install-extension ms-vscode-remote.remote-wsl; code --remote wsl+default
  ```

### unregister wsl and remove vscode user data

- ```md
  wsl --shutdown; wsl --unregister Ubuntu; Remove-Item -Path $env:APPDATA\Code -Recurse; Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
  ```

<details>
<summary>
</summary>

- ```md
  wsl --shutdown
  ```

- ```md
  wsl --unregister Ubuntu
  ```

- ```md
  Remove-Item -Path $env:APPDATA\Code -Recurse
  ```

- ```md
  Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
  ```

- https://learn.microsoft.com/en-us/windows/wsl/basic-commands
- https://code.visualstudio.com/docs/setup/uninstall#_clean-uninstall

</details>

## in your wsl (vscode)

### `git` to `.zip`

- ```
  git ls-files --cached --others --exclude-standard | python3 -c 'import os,sys,subprocess,zipfile;git=lambda*arguments:subprocess.check_output(("git",)+arguments,text=True).strip();repository=os.path.basename(git("rev-parse","--show-toplevel"));branch=git("branch","--show-current").replace("/","-")or"branch";name=f"{repository}.{branch}.zip";zip_file=zipfile.ZipFile(name,"w",zipfile.ZIP_DEFLATED,compresslevel=9);[zip_file.write(path)for path in map(str.strip,sys.stdin)if path!=name and os.path.exists(path)];zip_file.close()'
  ```

- ```
  git diff --name-only --relative HEAD | python3 -c 'import os,sys,subprocess,zipfile;git=lambda*arguments:subprocess.check_output(("git",)+arguments,text=True).strip();repository=os.path.basename(git("rev-parse","--show-toplevel"));branch=git("branch","--show-current").replace("/","-")or"branch";name=f"{repository}.{branch}.zip";zip_file=zipfile.ZipFile(name,"w",zipfile.ZIP_DEFLATED,compresslevel=9);[zip_file.write(path)for path in map(str.strip,sys.stdin)if path!=name and os.path.exists(path)];zip_file.close()'
  ```

### `image/*` to `.avif`

- ```md
  pnpm add -D sharp
  node -e '["./"].forEach(folder=>require("node:fs").readdirSync(folder).filter(file=>[require("sharp").format.jpeg.input.fileSuffix,require("sharp").format.png.input.fileSuffix,require("sharp").format.webp.input.fileSuffix].flat().includes(require("node:path").extname(file))).forEach(file=>require("sharp")(folder+file).avif({quality:50,effort:7}).toFile(folder+file.replace(require("node:path").extname(file),".avif"))))'
  ```

### mcp

- ```md
  CLAUDE="$(ls -d ~/.vscode-server/extensions/anthropic.claude-code-*/resources/native-binary/claude | sort -V | tail -1)"
  "$CLAUDE" --version
  ```

- ```md
  CLAUDE="$(ls -d ~/.vscode-server/extensions/anthropic.claude-code-*/resources/native-binary/claude | sort -V | tail -1)"
  "$CLAUDE" mcp add --transport http Storyblok https://mcp.storyblok.com/mcp
  "$CLAUDE" mcp add --transport http Slack https://mcp.slack.com/mcp --header "Authorization: Bearer xoxp-..."
  ```

- https://www.storyblok.com/docs/tooling/mcp-server/setup
- https://docs.slack.dev/ai/slack-mcp-server/#transport-protocol

### docker

- ```md
  docker run --rm --interactive --tty ubuntu
  ```

- ```md
  DEBIAN_FRONTEND=noninteractive apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y sudo curl git
  ```
