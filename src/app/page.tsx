"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Target, Clock, Zap, RefreshCw, Play, Home } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "menu" | "playing" | "won" | "lost";

interface DifficultyConfig {
  min: number;
  max: number;
  attempts: number;
  label: string;
  color: string;
}

const difficulties: Record<Difficulty, DifficultyConfig> = {
  easy: { min: 1, max: 50, attempts: 10, label: "Easy", color: "bg-green-500" },
  medium: { min: 1, max: 100, attempts: 8, label: "Medium", color: "bg-yellow-500" },
  hard: { min: 1, max: 200, attempts: 6, label: "Hard", color: "bg-red-500" }
};

export default function NumberGuessingGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [attemptsLeft, setAttemptsLeft] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameTime, setGameTime] = useState<number>(0);
  const [guessHistory, setGuessHistory] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing") {
      interval = setInterval(() => {
        setGameTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const startGame = () => {
    const config = difficulties[difficulty];
    const number = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    
    setTargetNumber(number);
    setAttemptsLeft(config.attempts);
    setGameState("playing");
    setFeedback("");
    setGuess("");
    setStartTime(Date.now());
    setGameTime(0);
    setGuessHistory([]);
  };

  const calculateScore = (attemptsUsed: number, timeTaken: number): number => {
    const config = difficulties[difficulty];
    const attemptsLeft = config.attempts - attemptsUsed;
    const baseScore = (attemptsLeft / config.attempts) * 1000;
    const timePenalty = Math.min(timeTaken / 1000, 60) / 60 * 200;
    return Math.max(0, Math.floor(baseScore - timePenalty));
  };

  const getHint = (userGuess: number, target: number): string => {
    const config = difficulties[difficulty];
    const totalRange = config.max - config.min;
    const difference = Math.abs(userGuess - target);
    const percentageOff = (difference / totalRange) * 100;

    if (userGuess > target) {
      if (percentageOff > 30) return "🔥 Way too high! Try a much lower number.";
      if (percentageOff > 15) return "📈 Too high! Try going lower.";
      return "🎯 A little high - you're getting closer!";
    } else {
      if (percentageOff > 30) return "❄️ Way too low! Try a much higher number.";
      if (percentageOff > 15) return "📉 Too low! Try going higher.";
      return "🎯 A little low - you're getting closer!";
    }
  };

  const handleGuess = () => {
    const userGuess = parseInt(guess);
    const config = difficulties[difficulty];
    
    if (isNaN(userGuess) || userGuess < config.min || userGuess > config.max) {
      setFeedback(`Please enter a number between ${config.min} and ${config.max}!`);
      return;
    }

    const newGuessHistory = [...guessHistory, userGuess];
    setGuessHistory(newGuessHistory);

    if (userGuess === targetNumber) {
      const finalScore = calculateScore(newGuessHistory.length, gameTime);
      setScore(finalScore);
      setGameState("won");
      setFeedback(`🎉 Congratulations! You found the number ${targetNumber}!`);
    } else {
      const newAttemptsLeft = attemptsLeft - 1;
      setAttemptsLeft(newAttemptsLeft);
      
      if (newAttemptsLeft === 0) {
        setGameState("lost");
        setFeedback(`💀 Game Over! The number was ${targetNumber}.`);
      } else {
        setFeedback(getHint(userGuess, targetNumber));
      }
    }
    
    setGuess("");
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setGuessHistory([]);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const config = difficulties[difficulty];
  const progressValue = gameState === "playing" ? ((config.attempts - attemptsLeft) / config.attempts) * 100 : 0;

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Number Guessing Game
            </CardTitle>
            <CardDescription className="text-lg">
              Test your intuition and guess the secret number!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Choose Difficulty:</label>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(difficulties).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${config.color}`} />
                        <span>{config.label}</span>
                        <span className="text-xs text-muted-foreground">
                          ({config.min}-{config.max}, {config.attempts} attempts)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Selected: {config.label}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Range: {config.min} to {config.max}</p>
                <p>• Attempts: {config.attempts}</p>
                <p>• Smart hints included!</p>
              </div>
            </div>
            
            <Button onClick={startGame} className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={resetGame} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Menu
          </Button>
          <Badge variant="secondary" className="px-4 py-2 text-lg">
            <div className={`w-3 h-3 rounded-full ${config.color} mr-2`} />
            {config.label}
          </Badge>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Attempts Left</p>
                <p className="text-2xl font-bold">{attemptsLeft}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold">{formatTime(gameTime)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Range</p>
                <p className="text-2xl font-bold">{config.min}-{config.max}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{config.attempts - attemptsLeft}/{config.attempts} attempts used</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Make Your Guess
              </CardTitle>
              <CardDescription>
                Enter a number between {config.min} and {config.max}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`${config.min}-${config.max}`}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  className="text-lg h-12"
                  min={config.min}
                  max={config.max}
                />
                <Button 
                  onClick={handleGuess} 
                  disabled={!guess || gameState !== "playing"}
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Guess
                </Button>
              </div>
              
              {feedback && (
                <Alert className={`${gameState === "won" ? "border-green-500 bg-green-50" : gameState === "lost" ? "border-red-500 bg-red-50" : "border-blue-500 bg-blue-50"}`}>
                  <AlertDescription className="text-lg font-medium">
                    {feedback}
                  </AlertDescription>
                </Alert>
              )}

              {(gameState === "won" || gameState === "lost") && (
                <div className="space-y-4">
                  {gameState === "won" && (
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-lg font-bold">Final Score: {score} points</p>
                      <p className="text-sm text-muted-foreground">
                        Time: {formatTime(gameTime)} | Attempts: {guessHistory.length}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={startGame} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                    <Button variant="outline" onClick={resetGame} className="flex-1">
                      <Home className="w-4 h-4 mr-2" />
                      Menu
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guess History */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Guess History</CardTitle>
              <CardDescription>
                Your previous guesses ({guessHistory.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {guessHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No guesses yet. Make your first guess!
                  </p>
                ) : (
                  guessHistory.map((historyGuess, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="font-medium">#{index + 1}</span>
                      <Badge variant={historyGuess === targetNumber ? "default" : "secondary"}>
                        {historyGuess}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {historyGuess > targetNumber ? "Too high" : historyGuess < targetNumber ? "Too low" : "Correct!"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
