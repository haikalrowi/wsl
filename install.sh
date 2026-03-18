# curl -sL https://github.com/haikalrowi/wsl/raw/HEAD/install.sh | sudo -E bash -i

# pnpm and node.js

curl -fsSL https://get.pnpm.io/install.sh | sh - &&
. ~/.bashrc &&
pnpm env use --global lts

# ghcr.io/devcontainers/features/common-utils

DFCU="./.dfcu" &&
mkdir $DFCU &&
(
cd $DFCU &&
curl -LO https://github.com/devcontainers/features/raw/HEAD/src/common-utils/install.sh &&
curl -LO https://github.com/devcontainers/features/raw/HEAD/src/common-utils/main.sh &&
sudo INSTALLZSH="false" CONFIGUREZSHASDEFAULTSHELL="false" INSTALLOHMYZSH="false" INSTALLOHMYZSHCONFIG="false" UPGRADEPACKAGES="false" bash install.sh
)

# bun

curl -fsSL https://bun.com/install | bash

# cloudflared

sudo mkdir -p --mode=0755 /usr/share/keyrings &&
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null &&
echo "deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list &&
sudo apt-get update && sudo apt-get install cloudflared

# uv and python

curl -LsSf https://astral.sh/uv/install.sh | sh &&
. ~/.bashrc &&
uv python install

# poetry

curl -sSL https://install.python-poetry.org | python3 - &&
