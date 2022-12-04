const { ethers, Contract } = require('ethers')
const axios =  require("axios")

const PATH_FINDER_API_URL = "https://api.pathfinder.routerprotocol.com/api"
const STATS_API_URL = "https://api.stats.routerprotocol.com/api"

const chainMapping = {
    "137": {
        "chain": "Polygon",
        "rpc": "https://polygon-rpc.com",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0xfEd3c880FF02B195abee916328c5a3953976befD",
        "NATIVE": {
            "address": "0x0000000000000000000000000000000000001010",
            "wrapped_address": "0x4c28f48448720e9000907BC2611F73022fdcE1fA"
        }
    },
    "1": {
        "chain": "Ethereum",
        "rpc": "https://speedy-nodes-nyc.moralis.io/36a3a9840a5f2cc2ea2bbb42/eth/mainnet",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x5e9A385a15cDE1b149Cb215d9cF3151096A37D67",
        "NATIVE": {
            "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "wrapped_address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        }
    },
    "250": {
        "chain": "Fantom",
        "rpc": "https://rpc.ftm.tools/",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x621F0549102262148f6a7D289D8330adf7CbC09F",
        "NATIVE": {
            "address": "0x0100000000000000000000000000000000000001",
            "wrapped_address": "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
        }
    },
    "42161": {
        "chain": "Arbitrum",
        "rpc": "https://arb1.arbitrum.io/rpc",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x88b1E0ecaC05b876560eF072d51692F53932b16f",
        "NATIVE": {
            "address": "0x0000000000000000000000000000000000001010",
            "wrapped_address": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
        }
    },
    "56": {
        "chain": "BSC",
        "rpc": "https://bsc-dataseed.binance.org/",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x45d880647Ec9BEF6Bff58ee6bB985C67d7234b0C",
        "NATIVE": {
            "address": "0x0100000000000000000000000000000000000001",
            "wrapped_address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        }
    },
    "43114": {
        "chain": "Avalanche",
        "rpc": "https://api.avax.network/ext/bc/C/rpc",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x5febcA23e97c8ead354318e5A3Ed34ec3704459a",
        "NATIVE": {
            "address": "0x0100000000000000000000000000000000000001",
            "wrapped_address": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
        }
    },
    "10": {
        "chain": "Optimism",
        "rpc": "https://mainnet.optimism.io",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x88b1E0ecaC05b876560eF072d51692F53932b16f",
        "NATIVE": {
            "address": "0x0000000000000000000000000000000000001010",
            "wrapped_address": "0x4200000000000000000000000000000000000006"
        }
    },
    "25": {
        "chain": "Cronos",
        "rpc": "https://evm.cronos.org",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0xf44Ff799eA2bBFeC96f9A50498209AAc3C2b3b8b",
        "NATIVE": {
            "address": "0x0000000000000000000000000000000000000001",
            "wrapped_address": "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23"
        }
    },
    "1666600000": {
        "chain": "Harmony",
        "rpc": "https://api.harmony.one",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x8413041a7702603d9d991F2C4ADd29e4e8A241F8",
        "NATIVE": {
            "address": "0x0000000000000000000000000000000000001010",
            "wrapped_address": "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a"
        }
    },
    "1313161554": {
        "chain": "Aurora",
        "rpc": "https://mainnet.aurora.dev",
        "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
        "oneSplit_address": "0x13538f1450Ca2E1882Df650F87Eb996fF4Ffec34",
        "NATIVE": {
            "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "wrapped_address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB"
        }
    }
}



// calling the pathfinder api using axios
const fetchPathfinderData = async (params) => {
    const endpoint = "quote"
    const pathUrl = `${PATH_FINDER_API_URL}/${endpoint}`
    console.log(pathUrl)
    try {
        const res = await axios.get(pathUrl, { params })
        return res.data
    } catch (e) {
        console.error(`Fetching data from pathfinder: ${e}`)
    }
}

exports.main = async (from, to, fromTokenAddress, toTokenAddress, amount, feeTokenAddress) => {
    const localMap = {    
        "Polygon":137,
        "Ethereum":1,
        "Fantom":250,
        "Arbitrum":42161,
        "BSC": 56,
        "Avalanche":43114,
        "Optimism":10,
        "Cronos":25,
        "Harmony":1666600000,
        "Aurora":1313161554
    }
    const args = {
        'fromTokenAddress': fromTokenAddress, // FTM on Fantom
        'toTokenAddress': toTokenAddress, // MATIC on Polygon
        'amount': amount, // 1 FTM
        'fromTokenChainId': localMap[from], // Fantom
        'toTokenChainId': localMap[to], // Polygon
        'userAddress': '0xC7fd9fAE37C533429bE1BfA510F48211d00DCB7C',
        'feeTokenAddress': feeTokenAddress, // ROUTE on Fantom
        'slippageTolerance': 2,
        'widgetId': 24, // get your unique wdiget id by contacting us on Telegram
    }
    try{
        const pathfinder_response = await fetchPathfinderData(args)
        console.log("-------------PATHFINDER RESULTS-------------")
        console.log(pathfinder_response)
        return true;
    }catch(e){
        return false;
    }
    
}
