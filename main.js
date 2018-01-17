const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(data, previousHash){
        this.timestamp = new Date().getTime();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block minded: " + this.hash)
    }
}

class Blockchain{
    constructor(){
        this.difficulty = 4;
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        let genesisBlock = new Block("Genesis Block", "0" );
        genesisBlock.mineBlock(this.difficulty);

        return genesisBlock
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.index=(this.chain.length)
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)
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

function alterChain(blockchain, targetBlock, targetKey, newValue){
    for(var i = targetBlock; i < blockchain.length; i++){
        blockchain[targetBlock][targetKey] = newValue;
        
        const newHash = blockchain[targetBlock].calculateHash();
        
        blockchain[targetBlock].hash = newHash;
        blockchain[targetBlock + 1].previousHash = newHash;
    }
}

console.log("Mining block 1... ")
brianCoin.addBlock(new Block({amount: 4}));
console.log("Mining block 2... ")
brianCoin.addBlock(new Block({amount: 10}));
console.log("Mining block 3... ")
brianCoin.addBlock(new Block({amount: 14}));

console.log(brianCoin)

console.log("Is blockchain valid? T", brianCoin.isChainValid())

alterChain(brianCoin, 1, "amount", 200)

console.log("Is blockchain valid? T(F)", brianCoin.isChainValid())

console.log(brianCoin)
// console.log(JSON.stringify(brianCoin, null, 4))