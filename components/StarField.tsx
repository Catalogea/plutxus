import { StyleSheet, View } from 'react-native';

const stars = [
  [8, 18, 2], [18, 42, 1], [29, 12, 1], [38, 29, 2], [49, 8, 1],
  [61, 22, 1], [74, 14, 2], [88, 35, 1], [94, 11, 1], [13, 73, 1],
  [26, 88, 2], [44, 68, 1], [58, 91, 1], [72, 74, 1], [84, 86, 2],
  [97, 65, 1], [6, 54, 1], [67, 48, 1], [35, 55, 1], [53, 39, 1],
];

export function StarField() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.nonInteractive]}>
      {stars.map(([left, top, size], index) => (
        <View
          key={index}
          style={[styles.star, { left: `${left}%`, top: `${top}%`, width: size, height: size, borderRadius: size / 2 }]}
        />
      ))}
      <View style={styles.haze} />
    </View>
  );
}

const styles = StyleSheet.create({
  nonInteractive: { pointerEvents: 'none' },
  star: { position: 'absolute', backgroundColor: '#D9D3C7', opacity: 0.45 },
  haze: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    top: '27%', left: '50%', marginLeft: -130, opacity: 0.18,
    backgroundColor: '#332E48',
  },
});