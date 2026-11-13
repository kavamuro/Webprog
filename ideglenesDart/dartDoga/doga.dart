void main() {
  print('-' * 30);
  print('Volume of a Cuboid');
  print(getVolumeOfCuboid(1, 2, 2) == 4);
  print(getVolumeOfCuboid(6.3, 2, 5) == 63);

  print('-' * 30);
  print('Rock Paper Scissors!');
  print(rps('rock', 'scissors') == "Player 1 won!");
  print(rps('scissors', 'paper') == "Player 1 won!");
  print(rps('paper', 'rock') == "Player 1 won!");
  print(rps('paper', 'paper') == "Draw!");
  print(rps('rock', 'rock') == "Draw!");
  print(rps('scissors  ', 'scissors  ') == "Draw!");
  print(rps('scissors', 'rock') == "Player 2 won!");
  print(rps('paper', 'scissors') == "Player 2 won!");
  print(rps('rock', 'paper') == "Player 2 won!");

  print('-' * 30);
  print('Grasshopper - Check for factor');
  print(checkForFactor(2450, 5) == true);
  print(checkForFactor(24612, 3) == true);
  print(checkForFactor(9, 2) == false);
  print(checkForFactor(653, 7) == false);
  print(checkForFactor(2453, 5) == false);
  print(checkForFactor(24617, 3) == false);

  print('-' * 30);
  print('Count of positives / sum of negatives');
  print(
    countPositivesSumNegatives([
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          -11,
          -12,
          -13,
          -14,
          -15,
        ]).join(', ') ==
        '10, -65',
  );
  print(
    countPositivesSumNegatives([
          0,
          2,
          3,
          0,
          5,
          6,
          7,
          8,
          9,
          10,
          -11,
          -12,
          -13,
          -14,
        ]).join(', ') ==
        '8, -50',
  );
  print(countPositivesSumNegatives([0]).join(', ') == '0, 0');

  print('-' * 30);
  print('Get the mean of an array');
  print(getAverage([2, 2, 2, 2]) == 2);
  print(getAverage([1, 2, 3, 4, 5]) == 3);
  print(getAverage([1, 1, 1, 1, 1, 1, 1, 2]) == 1);
}

double getVolumeOfCuboid(double length, double width, double height) {
  return length * width * height;
}

String rps(String p1, String p2) {
  final s1 = p1.trim();
  final s2 = p2.trim();

  if (s1 == s2) {
    return "Draw!";
  }
  if ((s1 == "rock" && s2 == "scissors") ||
      (s1 == "scissors" && s2 == "paper") ||
      (s1 == "paper" && s2 == "rock")) {
    return "Player 1 won!";
  } else {
    return "Player 2 won!";
  }
}

bool checkForFactor(int base, int factor) {
  return base % factor == 0;
}

List<int> countPositivesSumNegatives(List<int>? input) {
  if (input == null || input.isEmpty) {
    return [];
  }
  int countPositives = 0;
  int sumNegatives = 0;
  for (int number in input) {
    if (number > 0) {
      countPositives++;
    } else if (number < 0) {
      sumNegatives += number;
    }
  }
  return [countPositives, sumNegatives];
}

int getAverage(List<int> arr) {
  if (arr.isEmpty) return 0;
  int sum = arr.reduce((a, b) => a + b);
  return sum ~/ arr.length;
}
