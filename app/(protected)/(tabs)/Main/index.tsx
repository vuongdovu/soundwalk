import { HeaderMain } from '@/components/ui/complex/header/headerMain';
import { PillSelector } from '@/components/ui/primitive/pillSelector';
import { SWText } from '@/components/ui/primitive/text';
import { globalStyle } from '@/constants/styles';
import { AppleMaps } from 'expo-maps';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const options = ['🌐', '👥', '🤫'];
  const [selected, setSelected] = useState(0);

  return (
  <SafeAreaView style={[globalStyle.safeArea]}>
    <HeaderMain>
      <SWText style={globalStyle.leftBorder}>Sound Walk</SWText>
      <PillSelector 
        items={options}
        selectedIndex={selected}
        onChange={(index) => setSelected(index)}
        containerStyle={globalStyle.rightBorder}
      />
    </HeaderMain>
    <AppleMaps.View style={{flex: 1}}></AppleMaps.View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 
});
