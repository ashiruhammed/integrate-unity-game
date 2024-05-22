/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';


import { RootStackParamList } from '../../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["gateway://"],
  config: {
    screens: {
      Dashboard: {
        screens: {
          Home:'Home',
          Learn:'Learn',
          Wallet:'Wallet',
         Profile:'Profile'
        },
      },
      MyWallet: 'MyWallet',
      Concordium:'Concordium/:token',
      auth:{

      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
