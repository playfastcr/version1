/* ––
 * –––– Interface declaration
 * –––––––––––––––––––––––––––––––––– */
export default interface GBSTransactionData {
  customerID: string;
  password?: string;
  amount?: number;
  tranCode?: string;
  tranType?: string;
  description?: string;
  bettingAdjustmentFlagYN?: string;
}
