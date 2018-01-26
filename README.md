# AirToken dApp

**NOTE: This is not yet ready for production use. This is a push of the latest codebase to provide an update on development progress. Version 1.0 will be released by the end of Q1 2018.**

This repository contains a VueJS / NodeJS client that enables communication with the AirToken ERC20 smart contract and additional contracts that support AirToken functionality.

When version 1.0 is released, AIR holders will be able to send AIR to users of the Airfox Android application and redeem AIR directly for airtime and mobile data to over 500 carriers worldwide. This will enable mobile payments and remittances via the blockchain to most prepaid phones in the world.

Airfox will host the dApp online, but using this repository anyone will be able to run the dApp locally for themselves.

## Status

The AirToken dApp is under heavy development and is not ready for production use. Version 1.0 is expected by the end of Q1.

## Usage

**This is not ready for local use yet. First production release is expected by the end of Q1 2018**.

To run locally, clone the repo, have nodejs installed, and in terminal:

`npm install`

`npm run dev`

The dApp will be running at `http://localhost:8080/`

## TODO
- Finish reworking dApp UI to match new designs
- Finalize CI workflow and dockerize for Kubernetes
- Deploy MDN contract to mainnet
- Test fully against Airfox production backend and ensure functionality works against the Android app