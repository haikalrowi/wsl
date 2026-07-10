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
  [![chat.mistral.ai/chat](https://www.google.com/s2/favicons?sz=32&domain=chat.mistral.ai)](https://chat.mistral.ai/chat?q=.)
  [![perplexity.ai](https://www.google.com/s2/favicons?sz=32&domain=perplexity.ai)](https://perplexity.ai/?q=.)
  [![chatgpt.com](https://www.google.com/s2/favicons?sz=32&domain=chatgpt.com)](https://chatgpt.com/?q=.)
- [![google.com/search?q=translate](https://www.google.com/s2/favicons?sz=32&domain=google.com)](https://google.com/search?q=translate)
  [![bing.com/search?q=translate](https://www.google.com/s2/favicons?sz=32&domain=bing.com)](https://bing.com/search?q=translate)

</details>
<details>
<summary>
</summary>

- https://grokipedia.com/page/Backus%E2%80%93Naur_form

</details>

## inside your windows

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
      content: |

        [user]
        default=p
      append: true
    - path: /home/p/.bashrc
      content: |

        #
        [ ! -f /var/tmp/.p ] && sudo -v && touch /var/tmp/.p && (
          read_and_eval() {
            read -p "$1 [y/n]: " yn
            [ "$yn" = "y" ] && eval "$1"
            [ "$yn" = "y" ] || [ "$yn" = "n" ] || read_and_eval "$1"
          }
          read_and_eval "mkdir p p-work && (cd p && git clone https://github.com/haikalrowi/wsl)"
          read_and_eval "curl -sL https://github.com/haikalrowi/wsl/raw/HEAD/install.sh | bash -i"
        )
      owner: p
      append: true
      defer: true
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

~~## inside your wsl~~

## inside your vscode

### from `git` to `.zip`

- ```md
  git ls-files --cached --others --exclude-standard | python3 -c 'import os,subprocess,sys,zipfile;output=subprocess.check_output(["git","rev-parse","--show-toplevel","--abbrev-ref","HEAD"]).decode().strip().split("\n");basename=os.path.basename(output[0]);branch=output[1].replace("/","-");name=f"{basename}.{branch}.zip";zip_file=zipfile.ZipFile(name,"w");[zip_file.write(line.strip())for line in sys.stdin if os.path.exists(line.strip())and line.strip()!=name];zip_file.close();'
  ```

- ```md
  git diff --name-only --relative HEAD | python3 -c 'import os,subprocess,sys,zipfile;output=subprocess.check_output(["git","rev-parse","--show-toplevel","--abbrev-ref","HEAD"]).decode().strip().split("\n");basename=os.path.basename(output[0]);branch=output[1].replace("/","-");name=f"{basename}.{branch}.zip";zip_file=zipfile.ZipFile(name,"w");[zip_file.write(line.strip())for line in sys.stdin if os.path.exists(line.strip())and line.strip()!=name];zip_file.close();'
  ```

### from `image/*` to `.avif`

- ```md
  pnpm add -D sharp
  node -e '["./"].forEach(folder=>require("fs").readdirSync(folder).filter(file=>file.endsWith(".png")).forEach(file=>require("sharp")(folder+file).avif({quality:50,effort:7}).toFile(folder+file.replace(".png",".avif"))))'
  ```
