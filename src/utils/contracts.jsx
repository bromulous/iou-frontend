import { ethers } from "ethers";
import BondIssuanceABI from './BondIssuance.json';
import PaymentHandlingABI from './PaymentHandling.json';
import BondTradingABI from './BondTrading.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);

const bondIssuanceAddress = "YOUR_BOND_ISSUANCE_CONTRACT_ADDRESS";
const paymentHandlingAddress = "YOUR_PAYMENT_HANDLING_CONTRACT_ADDRESS";
const bondTradingAddress = "YOUR_BOND_TRADING_CONTRACT_ADDRESS";

const bondIssuanceContract = new ethers.Contract(bondIssuanceAddress, BondIssuanceABI, provider);
const paymentHandlingContract = new ethers.Contract(paymentHandlingAddress, PaymentHandlingABI, provider);
const bondTradingContract = new ethers.Contract(bondTradingAddress, BondTradingABI, provider);

export { bondIssuanceContract, paymentHandlingContract, bondTradingContract };
