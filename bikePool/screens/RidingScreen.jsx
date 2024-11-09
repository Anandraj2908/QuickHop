import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BALL_SIZE = 50;
const BALL_RADIUS = BALL_SIZE / 2;
const BALL_SPEED = 3;
const SPAWN_INTERVAL = 1000;
const UPDATE_INTERVAL = 16; // ~60fps

const FallingBallsGame = () => {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const generateBallId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const isWithinTapArea = useCallback((touchX, touchY, ballX, ballY) => {
    const dx = touchX - (ballX + BALL_RADIUS);
    const dy = touchY - (ballY + BALL_RADIUS);
    return Math.sqrt(dx * dx + dy * dy) <= BALL_RADIUS;
  }, []);

  useEffect(() => {
    let ballInterval;
    let spawnInterval;

    if (isRunning) {
      ballInterval = setInterval(() => {
        setBalls(prevBalls => {
          return prevBalls
            .map(ball => ({
              ...ball,
              y: ball.y + BALL_SPEED,
              opacity: ball.isHit ? 0 : 1
            }))
            .filter(ball => ball.y < height && !ball.isHit);
        });
      }, UPDATE_INTERVAL);

      spawnInterval = setInterval(() => {
        setBalls(prevBalls => {
          const maxBalls = 10;
          if (prevBalls.length >= maxBalls) return prevBalls;

          const ballType = Math.random() < 0.6 ? 'green' : 'red';
          const x = Math.max(0, Math.min(width - BALL_SIZE, Math.random() * (width - BALL_SIZE)));
          return [
            ...prevBalls,
            {
              id: generateBallId(),
              x,
              y: -BALL_SIZE,
              type: ballType,
              isHit: false,
              opacity: 1
            }
          ];
        });
      }, SPAWN_INTERVAL);
    }

    return () => {
      clearInterval(ballInterval);
      clearInterval(spawnInterval);
    };
  }, [isRunning, generateBallId]);

  const handleBallTap = useCallback((event, ball) => {
    const touchX = event.nativeEvent.pageX;
    const touchY = event.nativeEvent.pageY;

    if (isWithinTapArea(touchX, touchY, ball.x, ball.y)) {
      if (ball.type === 'green') {
        setScore(prevScore => prevScore + 1);
        setBalls(prevBalls =>
          prevBalls.map(b =>
            b.id === ball.id ? { ...b, isHit: true } : b
          )
        );
      } else if (ball.type === 'red') {
        endGame();
      }
    }
  }, [isWithinTapArea]);

  const endGame = useCallback(() => {
    setIsRunning(false);
    
  }, [score]);

  const startGame = useCallback(() => {
    setScore(0); // Reset score only here
    setBalls([]);
    setIsRunning(true);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#87CEEB', '#ADD8E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      {!isRunning && (
        <View style={styles.introCard}>
          <Text style={styles.introText}>Just sit back and enjoy the game until we reach the destination!</Text>
        </View>
      )}
      {!isRunning && (
        <View style={styles.startScreen}>
          <Text style={styles.title}>Falling Balls Game</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startGame}
            activeOpacity={0.7}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
      {isRunning && (
        <View style={styles.gameArea}>
          {balls.map((ball) => (
            <TouchableOpacity
              key={ball.id}
              style={[
                styles.ball,
                { left: ball.x, top: ball.y, opacity: ball.opacity },
                ball.type === 'green' ? styles.greenBall : styles.redBall
              ]}
              onPress={(event) => handleBallTap(event, ball)}
              activeOpacity={1}
              hitSlop={{ top: BALL_RADIUS, bottom: BALL_RADIUS, left: BALL_RADIUS, right: BALL_RADIUS }}
            />
          ))}
        </View>
      )}
      <Text style={styles.score}>Score: {score}</Text>
      {isRunning && (
        <TouchableOpacity
          style={styles.endButton}
          onPress={endGame}
          activeOpacity={0.7}
        >
          <Text style={styles.endButtonText}>End Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  startScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  introCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  introText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameArea: {
    position: 'relative',
    width: '100%',
    height: height - 100,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_RADIUS,
  },
  greenBall: {
    backgroundColor: '#32CD32',
  },
  redBall: {
    backgroundColor: '#FF4444',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  endButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  endButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FallingBallsGame;
