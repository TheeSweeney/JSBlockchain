const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash){
        this.index = index;
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = ''
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, '01/01/2018', "Genesis Block", "0" );
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1]

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true
    }
}

let brianCoin = new Blockchain();


brianCoin.addBlock(new Block(2, '1/12/2018', {amount: 4}));
brianCoin.addBlock(new Block(1, '1/12/2018', {amount: 10}));
brianCoin.addBlock(new Block(1, '1/12/2018', {amount: 14}));

console.log("Is blockchain valid? T", brianCoin.isChainValid())

brianCoin.chain[1].data = {amount: 100}
brianCoin.chain[1].hash = brianCoin.chain[1].calculateHash()

console.log("Is blockchain valid? F", brianCoin.isChainValid())

function alterChain(blockchain, targetBlock, targetKey, newValue){
    for(var i = targetBlock; i < blockchain.length; i++){
        blockchain[targetBlock][targetKey] = newValue;
        
        const newHash = blockchain[targetBlock].calculateHash();
        
        blockchain[targetBlock].hash = newHash;
        blockchain[targetBlock + 1].previousHash = newHash;
    }
}

brianCoin.chain[1].data = {amount: 4}
brianCoin.chain[1].hash = brianCoin.chain[1].calculateHash()

console.log("Is blockchain valid? T", brianCoin.isChainValid())

alterChain(brianCoin, 1, "amount", 200)

console.log("Is blockchain valid? T(F)", brianCoin.isChainValid())

// console.log(JSON.stringify(brianCoin, null, 4))