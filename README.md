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

[![syncfusion.com/free-tools](https://www.google.com/s2/favicons?sz=48&domain=syncfusion.com)](https://www.syncfusion.com/free-tools/)

</td>
<td>

[![inbrowser.app](https://www.google.com/s2/favicons?sz=48&domain=inbrowser.app)](https://inbrowser.app/)

</td>
<td>

</td>
</tr>
</tbody>
</table>

## inside your windows

### `.wslconfig`

```md
[wsl2]
kernelCommandLine=sysctl.vm.swappiness=10
swap=4294967296
networkingMode=mirrored
```

### `.cloud-init/default.user-data`

```yaml
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
      read_and_eval "mkdir p p-work && (
      cd p
      git clone https://github.com/haikalrowi/wsl
      )"
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

```md
Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
```

- https://learn.microsoft.com/en-us/windows/wsl/networking

### reset wsl and remove vscode user data

```md
wsl --shutdown; wsl --unregister Ubuntu; Remove-Item -Path $env:APPDATA\Code -Recurse; Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
```

<details>
<summary>read more</summary>

```md
wsl --shutdown
```

```md
wsl --unregister Ubuntu
```

```md
Remove-Item -Path $env:APPDATA\Code -Recurse
```

```md
Remove-Item -Path $env:USERPROFILE\.vscode -Recurse
```

- https://learn.microsoft.com/en-us/windows/wsl/basic-commands
- https://code.visualstudio.com/docs/setup/uninstall#_clean-uninstall

</details>

## inside your wsl

### [install.sh](./install.sh)

```md
curl -sL https://github.com/haikalrowi/wsl/raw/HEAD/install.sh | bash -i
```

## inside your vscode

### from `git` to `.zip`

```md
git ls-files --cached --others --exclude-standard | python3 -c 'import os,sys,zipfile;name=os.path.basename(os.getcwd());zip_file=zipfile.ZipFile(f"{name}.zip","w");[zip_file.write(line.strip())for line in sys.stdin if os.path.exists(line.strip())];zip_file.close();'
```

```md
git diff --name-only HEAD | python3 -c 'import os,sys,zipfile;name=os.path.basename(os.getcwd());zip_file=zipfile.ZipFile(f"{name}.zip","w");[zip_file.write(line.strip())for line in sys.stdin if os.path.exists(line.strip())];zip_file.close();'
```

```md
git archive -o "$(basename $(git rev-parse --show-toplevel)).HEAD.zip" HEAD
```
