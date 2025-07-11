import random
import time
from typing import Tuple

def get_difficulty_range() -> Tuple[int, int, int]:
    while True:
        print("\nSelect difficulty level:")
        print("1. Easy (1-50, 10 attempts)")
        print("2. Medium (1-100, 8 attempts)")
        print("3. Hard (1-200, 6 attempts)")
        try:
            choice = int(input("Enter your choice (1-3): "))
            if choice == 1:
                return 1, 50, 10
            elif choice == 2:
                return 1, 100, 8
            elif choice == 3:
                return 1, 200, 6
            else:
                print("Invalid choice! Please select 1, 2, or 3.")
        except ValueError:
            print("Please enter a valid number!")

def calculate_score(attempts_left: int, max_attempts: int, time_taken: float) -> int:
    base_score = (attempts_left / max_attempts) * 1000
    time_penalty = min(time_taken, 60) / 60 * 200
    return int(base_score - time_penalty)

def give_hint(guess: int, number: int, min_num: int, max_num: int) -> None:
    """Provide a helpful hint to the player based on the current range."""
    total_range = max_num - min_num
    difference = abs(guess - number)
    percentage_off = (difference / total_range) * 100

    if guess > number:
        if percentage_off > 30:
            print("Way too high! Try a much lower number.")
        elif percentage_off > 15:
            print("Too high! Try going lower.")
        else:
            print("A little high - you're getting closer!")
    else:
        if percentage_off > 30:
            print("Way too low! Try a much higher number.")
        elif percentage_off > 15:
            print("Too low! Try going higher.")
        else:
            print("A little low - you're getting closer!")

def play_game() -> None:
    print("\n=== Welcome to the Number Guessing Game! ===\n")
    
    min_num, max_num, max_attempts = get_difficulty_range()
    number = random.randint(min_num, max_num)
    attempts_left = max_attempts
    
    print(f"\nI'm thinking of a number between {min_num} and {max_num}.")
    print(f"You have {max_attempts} attempts to guess it!")
    print("Hint: The closer you get, the more precise the hints will be!")
    
    start_time = time.time()
    
    while attempts_left > 0:
        try:
            print(f"\nAttempts left: {attempts_left}")
            guess = int(input("Enter your guess: "))
            
            if guess < min_num or guess > max_num:
                print(f"Please guess a number between {min_num} and {max_num}!")
                continue
                
            if guess == number:
                time_taken = time.time() - start_time
                score = calculate_score(attempts_left, max_attempts, time_taken)
                print(f"\n🎉 Congratulations! You've found the number {number}!")
                print(f"Time taken: {time_taken:.2f} seconds")
                print(f"Score: {score} points")
                break
            
            give_hint(guess, number, min_num, max_num)
            attempts_left -= 1
            
            if attempts_left == 0:
                print(f"\nGame Over! The number was {number}.")
                
        except ValueError:
            print("Please enter a valid number!")

def main() -> None:
    while True:
        play_game()
        play_again = input("\nWould you like to play again? (yes/no): ").lower()
        if play_again != 'yes':
            print("\nThanks for playing! Goodbye! 👋")
            break

if __name__ == "__main__":
    main()
