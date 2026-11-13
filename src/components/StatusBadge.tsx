import { StyleSheet, Text, View } from 'react-native';

import { COR_STATUS, Status } from '@/constants/agro';

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <View style={[styles.badge, { backgroundColor: COR_STATUS[status] }]}>
      <Text style={styles.texto}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  texto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
