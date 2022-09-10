# Distributed Ledgers

Sextant automates the deployment and management of enterprise blockchain
infrastructure, and currently supports the open-source Hyperledger Besu and
Hyperledger Sawtooth distributed ledgers.

## Hyperledger Besu

[Hyperledger Besu](https://www.hyperledger.org/use/besu) is an Ethereum client
designed to be enterprise-friendly for both public and private permissioned
network use cases. It can also be ran on test networks such as Rinkeby, Ropsten,
and Görli. Hyperledger Besu includes several consensus algorithms including PoW,
and PoA (IBFT, IBFT 2.0, Etherhash, and Clique). Its comprehensive permissioning
schemes are designed specifically for use in a consortium environment.

<!-->
## Hyperledger Fabric

[Hyperledger Fabric](https://www.hyperledger.org/use/fabric) is intended as a
foundation for developing applications or solutions with a modular architecture.
Hyperledger Fabric allows components, such as consensus and membership services,
to be plug-and-play. Its modular and versatile design satisfies a broad range of
industry use cases. It offers a unique approach to consensus that enables
performance at scale while preserving privacy.

<-->
## Hyperledger Sawtooth

[Hyperledger Sawtooth](https://www.hyperledger.org/use/sawtooth) offers a
flexible and modular architecture separates the core system from the application
domain, so smart contracts can specify the business rules for applications
without needing to know the underlying design of the core system. Hyperledger
Sawtooth supports a variety of consensus algorithms, including Practical
Byzantine Fault Tolerance (PBFT) and Proof of Elapsed Time (PoET).

### BTP Paralos

_BTP Paralos_ is a freely available, enterprise-grade distribution of
Hyperledger Sawtooth. BTP Paralos is 100% open source and is based on
Hyperledger Sawtooth 1.1.5 and Sawtooth PBFT 1.0.1. BTP is committed to
contributing any BTP Paralos enhancements or refinements to these upstream
projects.

The code is hosted on Github and freely available, prebuilt Docker images are
published periodically on Docker Hub.

* [BTP Paralos Github](https://github.com/blockchaintp)
* [BTP Paralos Docker](https://hub.docker.com/orgs/blockchaintp)
