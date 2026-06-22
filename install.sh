#!/bin/bash

: 'start'
START=$(cat /sys/class/net/eth0/statistics/rx_bytes)
sudo --validate

: '
`devcontainers/features`
https://github.com/devcontainers/features/tree/HEAD/src/common-utils
https://github.com/devcontainers/features/tree/HEAD/src/node
'
(
DFCU=".dfcu" &&
git clone --no-checkout --filter=blob:none --depth 1 https://github.com/devcontainers/features.git $DFCU &&
cd $DFCU
git checkout HEAD src/common-utils &&
rm -rf src/common-utils/bin src/common-utils/scripts &&
sudo env INSTALLZSH="false" INSTALLOHMYZSH="false" INSTALLOHMYZSHCONFIG="false" UPGRADEPACKAGES="false" bash src/common-utils/install.sh
git checkout HEAD src/node &&
sudo env NODEGYPDEPENDENCIES="false" bash src/node/install.sh
)

: '
`bun`
https://bun.com/docs/installation#installation
curl -fsSL https://bun.com/install | bash
'

: '
`cloudflared`
https://developers.cloudflare.com/tunnel/advanced/local-management/create-local-tunnel/#1-download-and-install-cloudflared
'
sudo mkdir -p --mode=0755 /usr/share/keyrings &&
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null &&
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list &&
sudo apt-get update &&
sudo apt-get install cloudflared

: '
`uv`, `python`
https://docs.astral.sh/uv/getting-started/installation/#standalone-installer
https://docs.astral.sh/uv/guides/install-python/#getting-started
'
curl -LsSf https://astral.sh/uv/install.sh | sh &&
. .bashrc &&
uv python install

: '
`poetry`
https://python-poetry.org/docs/#installing-with-the-official-installer
'
curl -sSL https://install.python-poetry.org | python3 -

: 'end'
END=$(cat /sys/class/net/eth0/statistics/rx_bytes)
echo "$(( (END-START)/1024/1024 )) MB"
