import React, { Component } from "react";
import axios from "axios";
import { Button, TextField } from "@material-ui/core";
import { GameSettings } from "./GameSettings";
import { Square } from "./Square";
import { Leaderboard } from "./Leaderbord";

//   const endGame = name => {
//     setWinner(name);
//     setIsEnd(true);
//   };

//   const delay = arr => {
//     const delay = setInterval(() => {
//       const squares = arr;
//       const blueSq = squares.filter(sq => sq.isBlue);

//       if (blueSq.length) {
//         squares[blueSq[0].id].isBlue = false;
//         squares[blueSq[0].id].isRed = true;
//         squares[blueSq[0].id].clickable = false;
//         console.log(squares);
//       }

//       if (
//         squares.filter(sq => sq.isGreen).length === Math.round(size ** 2 / 2)
//       ) {
//         endGame(winner);
//         clearInterval(delay);
//       } else if (
//         squares.filter(sq => sq.isRed).length === Math.round(size ** 2 / 2)
//       ) {
//         endGame("Computer");
//         clearInterval(delay);
//       } else {
//         const availableSq = squares.filter(sq => sq.available);

//         if (availableSq.length) {
//           const random = Math.floor(Math.random() * availableSq.length);
//           const active = availableSq[random];
//           squares[active.id].isBlue = true;
//           squares[active.id].available = false;
//         }
//       }
//     }, settings[mode].delay);
//   };

//   const handleStartGame = () => {
//     const size = settings[mode].field;

//     setSize(size);

//     const squareArr = createSquare(size);

//     if (isEnd) {
//       setSquaresInfo(squareArr);
//     }

//     setIsStart(true);

//     delay(squareArr);
//   };

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: null,
      mode: "",
      size: null,
      delay: null,
      winner: "",
      isEnd: false,
      isStart: false,
      squares: null,
      player: "",
      winners: []
    };
  }
  //Получаем данные с сервера до загрузки!
  async componentDidMount() {
    const result = await axios(
      "https://starnavi-frontend-test-task.herokuapp.com/game-settings"
    );
    const winners = await axios(
      "https://starnavi-frontend-test-task.herokuapp.com/winners"
    );
    console.log(result.data);
    this.setState({
      settings: result.data,
      size: result.data[Object.keys(result.data)[0]].field,
      winners: winners.data
    });
  }

  //Отправка данных на сервер

  postData = async () => {
    const date = new Date();
    const sendDate = `${date
      .toTimeString()
      .slice(0, 5)}; ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "long"
    })} ${date.getFullYear()}`;

    const winnersInfo = {
      winner: this.state.winner,
      date: sendDate
    };

    return await fetch(
      `https://starnavi-frontend-test-task.herokuapp.com/winners`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(winnersInfo)
      }
    )
      .then(res => res.json())
      .then(data => {
        this.setState({ winners: data });
      });
  };

  //Создание поля игры

  createSquare = size => {
    let squareInfo = [];

    for (let i = 0; i < size ** 2; i++) {
      squareInfo[i] = {
        id: i,
        isBlue: null,
        isGreen: null,
        isRed: null,
        clickable: true,
        available: true,
        player: ""
      };
    }

    this.setState({
      squares: squareInfo
    });

    return squareInfo;
  };

  //Обработка событий нажатия на "точку"
  handleClick = e => {
    const { squares } = this.state;
    const square = squares[e.target.dataset.id];
    if (square.isBlue) {
      squares[square.id].isBlue = false;
      squares[square.id].isGreen = true;
      squares[square.id].clickable = false;

      this.setState({
        squares
      });
    }
  };

  //Выбор режима игры

  handleChangeMode = e => {
    const gameMode = e.target.value;
    console.log("gameMode: ", gameMode);

    this.setState(prev => {
      console.log(prev.settings[gameMode].field);
      return {
        mode: gameMode,
        size: prev.settings[gameMode].field,
        delay: prev.settings[gameMode].delay
      };
    });

    console.log(this.state.settings[gameMode].field);

    this.createSquare(this.state.settings[gameMode].field);
  };

  //Обработка окончания игры.

  endGame = name => {
    this.setState({
      isStart: false,
      isEnd: true,
      winner: name
    });
    alert(`${name} won`);
    this.postData();
  };

  //Метод рендеринга цветных квадратов

  delay = () => {
    const delay = setInterval(() => {
      const { squares, size, player } = this.state;

      const blueSq = squares.filter(sq => sq.isBlue);
      if (blueSq.length) {
        squares[blueSq[0].id].isBlue = false;
        squares[blueSq[0].id].isRed = true;
        squares[blueSq[0].id].clickable = false;
        console.log(squares);
      }

      if (
        squares.filter(sq => sq.isGreen).length === Math.round(size ** 2 / 2)
      ) {
        this.endGame(player);
        clearInterval(delay);
      } else if (
        squares.filter(sq => sq.isRed).length === Math.round(size ** 2 / 2)
      ) {
        this.endGame("Computer");
        clearInterval(delay);
      } else {
        const availableSq = squares.filter(sq => sq.available);

        if (availableSq.length) {
          const random = Math.floor(Math.random() * availableSq.length);
          const active = availableSq[random];
          squares[active.id].isBlue = true;
          squares[active.id].available = false;

          this.setState({
            squares
          });
        }
      }
    }, this.state.delay);
  };

  //Обработка начала игры

  startGame = () => {
    const { size, isEnd } = this.state;

    if (isEnd) {
      const reset = this.createSquare(size);

      this.setState({
        squares: reset,
        isEnd: false
      });
    }

    this.setState({ isStart: true });

    this.delay();
  };

  //Обработка ввода имени

  setName = e => {
    this.setState({ player: e.target.value });
  };

  render() {
    const {
      settings,
      mode,
      size,
      player,
      isEnd,
      isStart,
      squares,
      winners
    } = this.state;

    return (
      <div className="game">
        <div className="wrap">
          {settings && (
            <div className="game-settings">
              <GameSettings
                settings={settings}
                onChange={this.handleChangeMode}
                mode={mode}
              />
              <TextField
                label="You'r name?"
                className="input"
                onChange={this.setName}
                value={player}
              />
              <Button
                onClick={this.startGame}
                variant="contained"
                className="play-button"
                disabled={!mode || isStart || !player}
              >
                {isEnd ? "Play again!" : "Play"}
              </Button>
            </div>
          )}

          {squares && (
            <div className="game-field" style={{ maxWidth: `${45 * size}px` }}>
              {squares.map(item => {
                return (
                  <Square
                    key={item.id}
                    {...item}
                    onClick={this.handleClick}
                    started={isStart}
                  />
                );
              })}
            </div>
          )}
        </div>
        <Leaderboard winners={winners} />
      </div>
    );
  }
}

export default Game;
