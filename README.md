# notes app

simple note taking app built on arweave blockchain using weavedb and t3 Stack (tRPC, typescript, nextjs)

allows for mutable creation of notes that can be seen by everyone.

surports the creation of private notes that is viewed by owner only but still publicly available on the blockchain.
with siwe and a custom rainbowkit adapter for server authentication.

## weavedb 
weavedb is a NoSql database built on arweave blockchain with smartweave. it functions as a smart-contract as a database allowing for decentralised apps that emulate services similar to Google firestore.

## siwe (see-wee)
siwe,short for sign in with Ethereum is a JavaScript library that enables web3 authentication flows for your web apps.


## rainbowkit
rainbowkit is a wallet connect library that makes it easy to connect to multiple wallet from a react application.

## tRPC
tRPC is a typesafe API framework that brings the client and server code closer without schemas or code generation. enabling you to build full stack applications with typescript.

to get started
- follow this [article](#) to learn how to use weavedb in a tRPC app.