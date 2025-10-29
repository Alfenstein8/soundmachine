nix-shell -p bun --run "bun i && bun -b run build && PORT=5500 bun -b run build/index.js"
