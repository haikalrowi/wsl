# curl -sL https://github.com/haikalrowi/wsl/raw/HEAD/install.sh | bash -i

START=$(cat /sys/class/net/eth0/statistics/rx_bytes)

sudo -v

# ghcr.io/devcontainers/features

(
DFCU=".dfcu" &&
git clone --no-checkout --filter=blob:none --depth 1 https://github.com/devcontainers/features.git $DFCU &&
cd $DFCU
git checkout HEAD src/common-utils &&
sudo env INSTALLZSH="false" INSTALLOHMYZSH="false" INSTALLOHMYZSHCONFIG="false" UPGRADEPACKAGES="false" bash src/common-utils/install.sh
git checkout HEAD src/node &&
sudo env NODEGYPDEPENDENCIES="false" bash src/node/install.sh
)

# bun

curl -fsSL https://bun.com/install | bash

# cloudflared

sudo mkdir -p --mode=0755 /usr/share/keyrings &&
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null &&
echo "deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list &&
sudo apt-get update &&
sudo apt-get install cloudflared

# uv and python

curl -LsSf https://astral.sh/uv/install.sh | sh &&
. .bashrc &&
uv python install

# poetry

curl -sSL https://install.python-poetry.org | python3 -

END=$(cat /sys/class/net/eth0/statistics/rx_bytes)

echo "$(( (END-START)/1024/1024 )) MB"
