# Number Guessing Game

A fun and interactive number guessing game implemented in Python with multiple difficulty levels and score tracking.

## Features

- Three difficulty levels:
  - Easy (1-50, 10 attempts)
  - Medium (1-100, 8 attempts)
  - Hard (1-200, 6 attempts)
- Smart hint system
- Score calculation based on:
  - Remaining attempts
  - Time taken to guess
- Input validation and error handling
- Option to play multiple rounds

## Requirements

- Python 3.6 or higher
- No additional packages required

## How to Run

1. Make sure you have Python installed on your system
2. Navigate to the game directory
3. Run the game using:
   ```bash
   python number-game.py
   ```

## How to Play

1. Start the game and select a difficulty level (1-3)
2. The game will generate a random number within the range for your chosen difficulty
3. Enter your guess when prompted
4. You'll receive hints after each incorrect guess:
   - "Way too high/low" if your guess is off by more than 20
   - "A bit high/low" if your guess is closer
5. Try to guess the number within the allowed attempts
6. Your score is calculated based on:
   - Number of attempts remaining
   - Time taken to guess correctly
7. Choose to play again or exit after each round

## Implementation Details

The game is structured into several key functions:

- `get_difficulty_range()`: Handles difficulty selection and returns range parameters
- `calculate_score()`: Computes score based on attempts left and time taken
- `give_hint()`: Provides intelligent feedback based on the guess
- `play_game()`: Main game loop with input handling and game logic
- `main()`: Controls multiple game rounds and program flow

### Scoring System

- Base score: Up to 1000 points based on remaining attempts
- Time penalty: Up to 200 points deducted based on time taken
- Higher scores are achieved by:
  - Using fewer attempts
  - Guessing quickly
  - Playing on harder difficulties

## Tips

- Pay attention to the hints - they'll help you narrow down the range
- Try to guess efficiently to maximize your score
- On harder difficulties, use a binary search approach for better results 