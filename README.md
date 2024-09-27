# EXPERIMENTAL

# Monero Arbitrary Multisig Wrapper

General purpose any M-of-N multisig monero wallet wrapper for [getmonero.org](https://getmonero.org) wallet  
Uses tor and hidden services to create serverless peer to peer connections for multisig  
With this you can easily create any M-of-N multisig setup, for example

* 2-of-3: collaborative decision-making - requres 2 of 3 parties to sign off on every transaction
* 3-of-5, 5-of-7: treasury management - requres multiple parties to sign off on every transaction
* 2-of-2, 3-of-3: joint account - requires all parties to sign off on every transaction
* ...

As this is a wrapper - the wallet files are compatible with [getmonero.org](https://getmonero.org) wallet

## Prerequisites

This is a nodejs package - install `nodejs` and install package dependencies in `p2p` folder with `yarn` or `npm i`  
This is package uses monero binaries, tor and tmux from your system path

for Ubuntu/Debian based `apt install tmux tor node nodejs monero` might suffice

## Usage
Each party would should execute these in their own environment (laptop, workstations...)

### Start daemon

This will start the monero daemon in simple mode
```
./binaries/daemon-simple-start
```

### Create wallets

```
./binaries/wallet-create mywallet1
./binaries/wallet-create mywallet2
./binaries/wallet-create mywallet3
...
```
Do note down the **onion + port** for each wallet as these are required for next step

### Open wallets

This will open `monero-wallet-rpc` and `tor` (not as daemon)
```
./p2p/binaries/multisig-open mywallet1
./p2p/binaries/multisig-open mywallet2
./p2p/binaries/multisig-open mywallet3
...
```
This needs to be left open for the proceeding steps

### Create multisig config file

This is an interactive wizard and will ask  
* multisig config creation path
* shared secret password (used for authentication when connecting to other parties)
* M and N to use
* other parties wallet names and onion+port identifiers
```
./p2p/binaries/config-create
```

### Setup wallets

Specify previously created multisig config file path
```
./p2p/binaries/multisig-setup --wallet-name mywallet1 --config-path multisig-config.yaml
./p2p/binaries/multisig-setup --wallet-name mywallet2 --config-path multisig-config.yaml
./p2p/binaries/multisig-setup --wallet-name mywallet3 --config-path multisig-config.yaml
...
```
Do note down your **deposit** address here

### Exchange multisig data

This is required before and after every spend
```
./p2p/binaries/multisig-import --wallet-name mywallet1 --config-path multisig-config.yaml
./p2p/binaries/multisig-import --wallet-name mywallet2 --config-path multisig-config.yaml
./p2p/binaries/multisig-import --wallet-name mywallet3 --config-path multisig-config.yaml
...
```
Total and unlocked balance are also displayed here

### Spend
When your deposit has been confirmed you can spend  

The party that wants to spend executes
```
./p2p/binaries/multisig-spend \
  --wallet-name mywallet1 \
  --config-path multisig-config.yaml \
  --spend-address 888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H \
  --spend-amount 1.5
```

The other parties who wish to sign execute
```
./p2p/binaries/multisig-spend --wallet-name mywallet2 --config-path multisig-config.yaml
```
