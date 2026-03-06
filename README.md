# Soundmachine
Create a layout of cool samples and have them automatically sync to your Launchpad!

## Compatible Launchpads
* Launchpad Pro

## Installation
Follow Dev setup for now. But want to create docker image

## Dev setup
### Dependencies
The easiest is to use [Mise](https://mise.jdx.dev/).
It with help you install the deps:
* Python
* pnpm
* uv
* black
* git

Then run `git clone git@github.com:Alfenstein8/soundmachine.git`

### Running Server
1. `cd server`
2. `mise trust && mise i`
3. `pnpm i`
4. `pnpm db:push` and select yes
5. `pnpm dev`

#### Troubleshooting
Nothing yet

### Running Client
1. `cd client`
2. `mise trust && mise i`
3. `uv run main.py`

#### Troubleshooting
##### `Cannot access file /usr/local/share/alsa/alsa.conf`
```sh
sudo mkdir  /usr/local/share/alsa
sudo ln -s /usr/share/alsa/alsa.conf /usr/local/share/alsa/alsa.conf
```

![Hej](img/er_diagram.svg)
