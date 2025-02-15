import React, {useEffect, useState} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Switch} from 'components/switch';
import {ReceiveContainer} from 'components/Receive';
import {SendContainer} from 'components/Send';
import {WalletStore} from 'stores/wallet';
import {TransitionEnd} from 'utils/hooks';
import {styles} from './styles';
import {Colors} from 'utils/colors';

const SendReceiveScreen = ({route}) => {
  const navigation = useNavigation();
  const [isReceive, setIsReceive] = useState(route.params.receive);
  const [address, setAddress] = useState('loading...');
  const [coinDescriptor, setCoinDescriptor] = useState({});
  const tEnded = TransitionEnd(navigation);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.coin,
    });
    const wallet = WalletStore.getWalletByCoinId(
      route.params.coin,
      route.params.chain,
    );
    setAddress(WalletStore.getWalletAddressByChain(wallet?.chain ?? '') ?? '');
    setCoinDescriptor(wallet ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = () => {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator color={Colors.foreground} size="large" />
      </View>
    );
  };
  const renderContainer = () => {
    if (isReceive) {
      return tEnded ? (
        <ReceiveContainer address={address} chain={route.params.chain} />
      ) : (
        loading()
      );
    } else {
      return tEnded ? (
        <SendContainer
          coin={route.params.coin}
          chain={route.params.chain}
          address={address}
          coinDescriptor={coinDescriptor}
        />
      ) : (
        loading()
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Switch switcher={v => setIsReceive(v)} receive={isReceive} />
      {renderContainer()}
    </ScrollView>
  );
};

export default SendReceiveScreen;
