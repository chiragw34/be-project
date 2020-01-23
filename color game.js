var numSquares = 6; //keeps the track of number of squares generated im easy and hard mode
var colors = generateRandomColors(numSquares);
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var easyBtn = document.querySelector("#easyBtn");
var hardBtn = document.querySelector("#hardBtn");
var pickedColor = pickColor(); //function written below to generate random colors

colorDisplay.textContent = pickedColor;

easyBtn.addEventListener("click", function() {
  hardBtn.classList.remove("selected");
  easyBtn.classList.add("selected");
  numSquares = 3;
  colors = generateRandomColors(numSquares);
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor;
  for (var i = 0; i < squares.length; i++) {
    if (colors[i]) {
      //we'll take advantage of line number 17 as it will generate 3 random colors.
      squares[i].style.backgroundColor = colors[i];
    } else {
      squares[i].style.display = "none";
    }
  }
});

hardBtn.addEventListener("click", function() {
  easyBtn.classList.remove("selected");
  hardBtn.classList.add("selected");
  numSquares = 6;
  colors = generateRandomColors(numSquares);
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor;
  for (var i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = colors[i];
    squares[i].style.display = "block";
  }
});

resetButton.addEventListener("click", function() {
  //generate random colors
  colors = generateRandomColors(numSquares);
  //pick a new random color from array
  pickedColor = pickColor();
  //change the colorDisplay i.e. rgb(....) in h1
  colorDisplay.textContent = pickedColor;
  messageDisplay.textContent = "";
  this.textContent = "New Colors";
  //change the color of square

  for (var i = 0; i < squares.length; i++) {
    //applied initial colors to square
    squares[i].style.backgroundColor = colors[i];
  }
  h1.style.backgroundColor = "steelblue";
});

for (var i = 0; i < squares.length; i++) {
  //applied initial colors to square
  squares[i].style.backgroundColor = colors[i];

  //assigned event listener to each square
  squares[i].addEventListener("click", function() {
    //grab clicked color
    var clickedColor = this.style.backgroundColor;
    //compare clicked color with picked color
    if (clickedColor === pickedColor) {
      changedColor(clickedColor);
      messageDisplay.textContent = "Correct!";
      resetButton.textContent = "Play Again?";
      h1.style.backgroundColor = clickedColor;
    } else {
      this.style.backgroundColor = "#232323";
      messageDisplay.textContent = "Try Again";
    }
  });
}

function changedColor(color) {
  for (var i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = color;
  }
}

function pickColor() {
  var random = Math.floor(Math.random() * colors.length); //randomly pick numbers upto that length of colors array but not included that number if suppose we want till 6 then it will generate the random numbers till 5.9999
  //math.floor will cut out the after point numbers if 4.999 then it will make it 4
  return colors[random];
}

function generateRandomColors(num) {
  //Make an array
  var arr = [];
  //repeat num times num is number of squares
  for (var i = 0; i < num; i++) {
    //get random color and push into array
    arr.push(randomColor());
  }
  return arr;
}

function randomColor() {
  //pick "red" from 0-255
  var r = Math.floor(Math.random() * 256);
  //pick "Green" from 0-255
  var g = Math.floor(Math.random() * 256);
  //pick "Blue" from 0-255
  var b = Math.floor(Math.random() * 256);

  return "rgb(" + r + ", " + g + ", " + b + ")";
}
