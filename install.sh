#!/bin/bash

: 'start'
START=$(cat /sys/class/net/eth0/statistics/rx_bytes)
sudo --validate

: '
[devcontainers/features]
https://github.com/devcontainers/features/tree/HEAD/src/common-utils
https://github.com/devcontainers/features/tree/HEAD/src/node
'
(
DFCU=~/.dfcu &&
git clone --no-checkout --filter=blob:none --depth 1 https://github.com/devcontainers/features.git $DFCU &&
cd $DFCU
git checkout HEAD src/common-utils &&
rm -rf src/common-utils/bin src/common-utils/scripts &&
sudo INSTALLZSH="false" \
 INSTALLOHMYZSH="false" \
 INSTALLOHMYZSHCONFIG="false" \
 UPGRADEPACKAGES="false" \
 bash src/common-utils/install.sh
git checkout HEAD src/node &&
sudo NODEGYPDEPENDENCIES="false" \
 bash src/node/install.sh
)

: '
[bun]
https://bun.com/docs/installation#installation
curl -fsSL https://bun.com/install | bash
'

: '
[cloudflared]
https://developers.cloudflare.com/tunnel/advanced/local-management/create-local-tunnel/#1-download-and-install-cloudflared
'
sudo mkdir -p --mode=0755 /usr/share/keyrings &&
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null &&
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list &&
sudo apt-get update &&
sudo apt-get install cloudflared

: '
[uv, python]
https://docs.astral.sh/uv/getting-started/installation/#standalone-installer
https://docs.astral.sh/uv/guides/install-python/#getting-started
'
curl -LsSf https://astral.sh/uv/install.sh | sh &&
. ~/.bashrc &&
uv python install

: '
[poetry]
https://python-poetry.org/docs/#installing-with-the-official-installer
'
curl -sSL https://install.python-poetry.org | python3 -

: '
[brew]
https://brew.sh/
https://docs.brew.sh/Homebrew-on-Linux
'
(
sudo apt-get install -y build-essential procps curl file git
NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
)

: '
[docker]
https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
'
(
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl status docker
sudo systemctl start docker
sudo docker run hello-world
)

: 'end'
END=$(cat /sys/class/net/eth0/statistics/rx_bytes)
echo "$(( (END-START)/1024/1024 )) MB"
