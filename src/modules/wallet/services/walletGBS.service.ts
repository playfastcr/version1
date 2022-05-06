import axios from 'axios';

import GBSTransactionData from '../types/GBSTransactionData.type';

/* ––
 * –––– Class declaration
 * –––––––––––––––––––––––––––––––––– */
class WalletGBSDataService {
  instance = axios.create({
    baseURL: `${import.meta.env.VITE_GBS_WALLET_API}`,
    headers: {
      'Content-type': 'application/soap+xml',
    },
  });
  getCustomerInfo(data: GBSTransactionData) {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
    <GetCustomerInfo xmlns="www.extensionsoft.com/AsiInetSvcs">
      <systemID>${import.meta.env.VITE_GBS_SYSTEM_ID}</systemID>
      <systemPassword>${import.meta.env.VITE_GBS_SYSTEM_PASSWORD}</systemPassword>
      <clerkID>ANY</clerkID>
      <customerID>${data.customerID}</customerID>
    </GetCustomerInfo>
  </soap12:Body>
</soap12:Envelope>`;

    return this.instance.post('/SvcGetCustomerInfo.asmx', xml);
  }

  validateCustomerInfo(data: GBSTransactionData) {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <ValidateCustomer xmlns="www.extensionsoft.com/AsiInetSvcs">
      <systemID>${import.meta.env.VITE_GBS_SYSTEM_ID}</systemID>
      <systemPassword>${import.meta.env.VITE_GBS_SYSTEM_PASSWORD}</systemPassword>
      <clerkID>Admin</clerkID>
      <customerID>${data.customerID}</customerID>
      <password>${data.password}</password>
    </ValidateCustomer>
  </soap12:Body>
</soap12:Envelope>`;

    return this.instance.post('/SvcValidateCustomer.asmx', xml);
  }

  postTransaction(data: GBSTransactionData) {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
   <PostTransaction xmlns="www.extensionsoft.com/AsiInetSvcs">
      <systemID>${import.meta.env.VITE_GBS_SYSTEM_ID}</systemID>
      <systemPassword>${import.meta.env.VITE_GBS_SYSTEM_PASSWORD}</systemPassword>
      <clerkID>Admin</clerkID>
      <customerID>${data.customerID}</customerID>
      <amount>${data.amount}</amount>
      <tranCode>${data.tranCode}</tranCode>
      <tranType>${data.tranType}</tranType>
      <description>${data.description}</description>
      <bettingAdjustmentFlagYN>${data.description}</bettingAdjustmentFlagYN>
      <dailyFigureDate_YYYYMMDD></dailyFigureDate_YYYYMMDD>
    </PostTransaction>
  </soap12:Body>
</soap12:Envelope>`;
    return this.instance.post('/SvcPostTransaction.asmx', xml);
  }
}

export default new WalletGBSDataService();
