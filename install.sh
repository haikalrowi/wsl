# curl -sL https://github.com/haikalrowi/wsl/raw/HEAD/install.sh | bash -i

# pnpm and node.js

sudo -v &&
curl -fsSL https://get.pnpm.io/install.sh | sh - &&
. ~/.bashrc &&
pnpm env use --global lts

# ghcr.io/devcontainers/features/common-utils

sudo -v &&
DFCU="./.dfcu" &&
mkdir $DFCU &&
(
cd $DFCU &&
curl -LO https://github.com/devcontainers/features/raw/HEAD/src/common-utils/install.sh &&
curl -LO https://github.com/devcontainers/features/raw/HEAD/src/common-utils/main.sh &&
sudo INSTALLZSH="false" CONFIGUREZSHASDEFAULTSHELL="false" INSTALLOHMYZSH="false" INSTALLOHMYZSHCONFIG="false" UPGRADEPACKAGES="false" bash install.sh
)

# bun

sudo -v &&
curl -fsSL https://bun.com/install | bash

# cloudflared

sudo -v &&
sudo mkdir -p --mode=0755 /usr/share/keyrings &&
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null &&
echo "deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list &&
sudo apt-get update && sudo apt-get install cloudflared

# uv

sudo -v &&
curl -LsSf https://astral.sh/uv/install.sh | sh &&
. ~/.bashrc &&
uv python install

# poetry

sudo -v &&
curl -sSL https://install.python-poetry.org | python3 - &&
. ~/.bashrc &&
poetry --version
