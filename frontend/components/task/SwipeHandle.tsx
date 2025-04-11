import { Animated, View, StyleSheet } from 'react-native';

interface SwipeHandleProps {
  taskId: string;
  taskAnimations: { [key: string]: Animated.Value };
  createPanResponder: (taskId: string) => any;
}

export const SwipeHandle = ({ taskId, taskAnimations, createPanResponder }: SwipeHandleProps) => {
  const panResponder = createPanResponder(taskId);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.swipeHandle,
        {
          transform: [{
            translateX: taskAnimations[taskId] || new Animated.Value(0)
          }]
        }
      ]}
    >
      <View style={styles.handleBar} />
      <View style={styles.handleBar} />
      <View style={styles.handleBar} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeHandle: {
    width: 80,
    height: '100%',
    backgroundColor: '#e0e0e0',
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
    backgroundColor: '#666',
    marginVertical: 2,
    borderRadius: 2,
  },
}); 