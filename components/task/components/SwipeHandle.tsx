import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

interface SwipeHandleProps {
  taskId: string;
  taskAnimations: { [key: string]: Animated.Value };
  panResponder: any;
}

export const SwipeHandle = ({ taskId, taskAnimations, panResponder }: SwipeHandleProps) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.swipeHandle,
        {
          backgroundColor: theme.card,
          transform: [{
            translateX: taskAnimations[taskId] || new Animated.Value(0)
          }]
        }
      ]}
    >
      <View style={[styles.handleBar, { backgroundColor: theme.secondary }]} />
      <View style={[styles.handleBar, { backgroundColor: theme.secondary }]} />
      <View style={[styles.handleBar, { backgroundColor: theme.secondary }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeHandle: {
    width: 80,
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  handleBar: {
    width: 4,
    height: 4,
    marginVertical: 2,
    borderRadius: 2,
  },
}); 