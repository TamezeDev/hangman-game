//Palabra secreta
const secretWord = { status: 0, hide: "" };
let letersUsed = [];
//tema seleccionado
let topicSelected;
const topics = ["Los Simpsons", "Pokémon", "Juego de tronos"];
//Nombre de usuario
let user = "";
//puntuaciones de jugadores
let score = 0;
let maxScore = 0;
//estado del modo individual para hacer el score
let singlePlayerStatus = false;
//Nivel de la partdida
let level = 0;
//Contador de intentos de conexiones a la API
let owncounter = 0;
//Estados de salud
let damageStatus = 0;
const health = [
  "./img/state0.jpg",
  "./img/state1.jpg",
  "./img/state2.jpg",
  "./img/state3.jpg",
  "./img/state4.jpg",
  "./img/state5.jpg",
  "./img/state6.jpg",
];
//Generando el abecedario
const createAlphabet = () => {
  let alphabet = [];
  for (i = 65; i <= 90; i++) {
    alphabet += String.fromCharCode(i);
  }
  return alphabet;
};
//Botón de instrucciones
const guideButtonChecker = () => {
  const guideButton = document.querySelector("[value=guide]");
  const img = document.querySelector("#change");
  guideButton.addEventListener("click", (ev) => {
    hideCopyright();
    img.src = "./img/guide.jpg";
    img.alt = "./imagen con la instrucciones del juego";
  });
};
//Botón de dos jugadores
const twoPlayersButtonChecker = () => {
  const twoPlayers = document.querySelector("[value=two-players]");
  const primarySection = document.querySelector("#primary");
  twoPlayers.addEventListener("click", (ev) => {
    hideCopyright();
    const main = document.querySelector("main");
    main.removeChild(primarySection);
    createSecretWord(
      `Bienvenido al modo para dos jugadores`,
      `Jugador 1 - Introduzca su código secreto`
    );
  });
};

//Botón de un jugador
const onePlayerButtonChecker = () => {
  const twoPlayers = document.querySelector("[value=one-player]");
  const primarySection = document.querySelector("#primary");
  twoPlayers.addEventListener("click", (ev) => {
    hideCopyright();
    const main = document.querySelector("main");
    main.removeChild(primarySection);
    chooseOptionGame(
      `Bienvenido al modo para un jugador`,
      `Introduzca su nombre`,
      `Selecciona la temática`
    );
  });
};

//Elección de modo de juego 1 player
const chooseOptionGame = (intro, comment, topic) => {
  const main = document.querySelector("main");
  const div = document.createElement("div");
  div.setAttribute("class", "onePlayerMode");
  const h3 = document.createElement("h3");
  h3.innerText = intro;
  div.appendChild(h3);
  const p = document.createElement("p");
  p.innerHTML = comment;
  div.appendChild(p);
  const input = document.createElement("input");
  input.setAttribute("id", "userName");
  div.appendChild(input);
  const h4 = document.createElement("h4");
  h4.innerHTML = topic;
  div.appendChild(h4);
  const p2 = document.createElement("p");
  p2.setAttribute("id", "info");
  p2.innerText = ``;
  div.appendChild(p2);
  const p3 = document.createElement("p");
  p3.setAttribute("id", "info2");
  p2.innerText = ``;
  div.appendChild(p3);
  const section = document.createElement("section");
  section.setAttribute("id", "topics");
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.value = topic;
    button.innerText = topic;
    button.classList.add("option");
    section.appendChild(button);
    button.addEventListener("click", (ev) => {
      const isSelected = document.querySelector(".active");
      !isSelected
        ? button.classList.add("active")
        : (isSelected.classList.remove("active"),
          button.classList.add("active"));
      topicSelected = topics.indexOf(topic);
      topicChecker();
    });
  });
  div.appendChild(section);
  const startButton = document.createElement("button");
  startButton.innerText = `Comienza el juego`;
  div.appendChild(startButton);
  main.appendChild(div);
  startButton.addEventListener("click", (ev) => {
    checkerValues();
  });
}; //Comprobar campos correctos 1 player
const checkerValues = () => {
  const input = document.querySelector("#userName");
  if (!stringChecker(input.value) && input.value !== "") {
    invalidWordMessage(
      `El nombre no puede contener números ni caracteres especiales`
    );
    setTimeout(deleteInvalidWordMessage, 1500);
  } else if (input.value === "" || topicSelected === undefined) {
    invalidWordMessage(
      `Para jugar tienes que poner tu nombre y seleccionar un tema`
    );
    setTimeout(deleteInvalidWordMessage, 1500);
  } else if (secretWord.key !== undefined) {
    const userNameData = document.querySelector("#userName");
    user = userNameData.value.toUpperCase();
    const onePlayerDiv = document.querySelector(".onePlayerMode");
    const main = document.querySelector("main");
    main.removeChild(onePlayerDiv);
    onePlayerGame();
  } else {
    invalidWordMessage(`Generando partida...`);
    setTimeout(deleteInvalidWordMessage, 1000);
    setTimeout(checkerValues, 1000);
  }
};
//comprobar campos para siguiente nivel
const checkerForNextLevel = () => {
  if (secretWord.key !== undefined) {
    onePlayerGame();
    console.log(secretWord.key);
  } else {
    invalidWordMessage(`Generando partida...`);
    setTimeout(deleteInvalidWordMessage, 1000);
    setTimeout(checkerForNextLevel, 1000);
  }
};
//Comprobar  y cargar tema elegido
const topicChecker = () => {
  switch (topicSelected) {
    case 0:
      {
        getRandomName(
          `https://thesimpsonsapi.com/api/characters/${getRandomNum(500)}`
        );
      }
      break;
    case 1:
      {
        getRandomName(`https://pokeapi.co/api/v2/pokemon/${getRandomNum(151)}`);
      }
      break;
    case 2: {
      getTronesName();
    }
  }
};
//Generando la palabra secreta 2 players
const createSecretWord = (intro, comment) => {
  const main = document.querySelector("main");
  const div = document.createElement("div");
  div.setAttribute("class", "twoPlayersMode");
  const h3 = document.createElement("h3");
  h3.innerText = intro;
  div.appendChild(h3);
  const p = document.createElement("p");
  p.innerHTML = comment;
  div.appendChild(p);
  const input = document.createElement("input");
  input.setAttribute("id", "userWord");
  div.appendChild(input);
  const startButton = document.createElement("button");
  startButton.innerText = `Comienza el juego`;
  div.appendChild(startButton);
  main.appendChild(div);
  //comprueba si vale la palabra al pulsar el botón
  startButton.addEventListener("click", (ev) => {
    const input = document.querySelector("#userWord");
    input.value === ""
      ? (invalidWordMessage(`Para jugar debe introducir el código secreto`),
        setTimeout(deleteInvalidWordMessage, 1500))
      : !stringChecker(input.value)
      ? (invalidWordMessage(
          `La código secreto no puede contener números ni caracteres especiales`
        ),
        setTimeout(deleteInvalidWordMessage, 1500))
      : startGame();
  });
  //comprueba si vale la palabra al pulsar enter
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      input.value === ""
        ? (invalidWordMessage(`Para jugar debe introducir el código secreto`),
          setTimeout(deleteInvalidWordMessage, 1500))
        : !stringChecker(input.value)
        ? (invalidWordMessage(
            `La código secreto no puede contener números ni caracteres especiales`
          ),
          setTimeout(deleteInvalidWordMessage, 1500))
        : startGame();
    }
  });
};
//One player Game
const onePlayerGame = () => {
  singlePlayerStatus = true;
  createHeaderGame(`PUNTUACIÓN:  ${score} PUNTOS`);
  levelUpdate();
  createBoxGame();
  leterChecker();
};
//Modo 2 jugadores
const twoPlayersGame = () => {
  singlePlayerStatus = false;
  createHeaderGame(`Turno del jugador 2 para adivinar el código`);
  createBoxGame();
  leterChecker();
};

//creamos función para conseguir un número al azar dentro del margen estipulado
let getRandomNum = (num) => {
  let random = Math.random() * num;
  return random.toFixed(0);
};
//Función para conseguir una palabra secreta aleatoria de tonos
async function getTronesName() {
  try {
    let randomCharacter = `https://thronesapi.com/api/v2/Characters/`;
    const response = await fetch(randomCharacter);
    const data = await response.json();
    secretWord.key = data[getRandomNum(52)].fullName.toUpperCase();
  } catch (error) {
    console.log("No se han podido recibir los datos", error);
    invalidWordMessage(`No han podido recibir los datos del tema seleccionado`);
    setTimeout(deleteInvalidWordMessage, 1000);
    if (owncounter < 5) {
      setTimeout(getTronesName(), 1000);
      owncounter++;
    } else {
      topicSelected = getRandomNum(2);
      console.log("No se han podido recibir los datos", error);
      invalidWordMessage(`Cambiando al tema de ${topics[topicSelected]}`);
      setTimeout(deleteInvalidWordMessage, 1000);
      owncounter = 0;
    }
  }
}
//Función para conseguir una palabra secreta aleatoria de los simpsons o pokémon
async function getRandomName(url) {
  try {
    let randomCharacter = url;
    const response = await fetch(randomCharacter);
    const data = await response.json();
    data.name.includes("'") ||
    data.name.includes("-") ||
    data.name.includes("(")
      ? getRandomName()
      : (secretWord.key = data.name.toUpperCase());
  } catch (error) {
    console.log("No se han podido recibir los datos", error);
    invalidWordMessage(
      `No han podido recibir los datos del tema seleccionado, reintentando conectar`
    );
    setTimeout(deleteInvalidWordMessage, 1000);
    if (owncounter < 5) {
      if (topicSelected === 0) {
        setTimeout(
          getRandomName(
            `https://thesimpsonsapi.com/api/characters/${getRandomNum(500)}`
          ),
          1000
        );
        owncounter++;
      } else if (topicSelected === 1) {
        setTimeout(
          getRandomName(
            `https://pokeapi.co/api/v2/pokemon/${getRandomNum(151)}`
          ),
          1000
        );
        owncounter++;
      } else {
        topicSelected = getRandomNum(2);
        console.log("No se han podido recibir los datos", error);
        invalidWordMessage(`Cambiando al tema de ${topics[topicSelected]}`);
        setTimeout(deleteInvalidWordMessage, 1000);
        owncounter = 0;
      }
    }
  }
}
//comprobar validez de palabras
const stringChecker = (word) => /^[a-zA-Z\s]+$/.test(word);
//Eliminador de parrafos
const deleteparagraph = () => {
  const p = document.querySelector(".info");
  p.innerHTML = ``;
};

//Actualizar máxima puntuación
const maxScoreUpdate = () => {
  if (score > maxScore) {
    maxScore = score;
    const userRecord = document.querySelector("#user");
    const showMaxScore = document.querySelector("#score");
    userRecord.innerHTML = ` ${user}: `;
    showMaxScore.innerHTML = maxScore;
    paragraphUpdate(".info", `¡¡¡Has establecido un nuevo récord!!!`);
    localStorage.setItem("scoreRecord", maxScore);
    localStorage.setItem("nameRecord", userRecord.textContent);
  }
};

//Fin de partida
const finishGame = (title, comment) => {
  const divLeters = document.querySelector("#leters");
  divLeters.classList.add("hide");
  const game = document.querySelector("#game");
  const section = document.createElement("section");
  const h3 = document.createElement("h3");
  h3.innerText = title;
  section.appendChild(h3);
  const h4 = document.createElement("h4");
  h4.innerHTML = comment;
  section.appendChild(h4);
  const a = document.createElement("a");
  a.innerHTML = `Volver al inicio`;
  a.href = `./index.html`;
  section.appendChild(a);
  if (singlePlayerStatus && secretWord.hide === secretWord.key) {
    const continueButton = document.createElement("button");
    continueButton.setAttribute("id", "nextLevel");
    continueButton.innerHTML = "Siguiente nivel";
    section.appendChild(continueButton);
    continueButton.addEventListener("click", (ev) => {
      resetCounters();
      topicChecker();
      nextLevel();
    });
  }
  game.appendChild(section);
};

//Actualizar y recibir datos de máximas puntuaciones locales
const maxScoreChecker = () => {
  const localDataScore = localStorage.getItem("scoreRecord");
  const localDataName = localStorage.getItem("nameRecord");
  const nameRecord = document.querySelector("#user");
  const viewMaxScore = document.querySelector("#score");
  if (localDataScore) {
    maxScore = localDataScore;
    nameRecord.innerHTML = localDataName;
    viewMaxScore.innerHTML = `${localDataScore}`;
  } else {
    nameRecord.innerHTML = `Developer:`;
    viewMaxScore.innerHTML = `${99999}`;
  }
};
//Generar siguiente nivel
const nextLevel = () => {
  const main = document.querySelector("main");
  const header = document.querySelector("#header");
  const game = document.querySelector("#game");
  main.removeChild(header);
  main.removeChild(game);
  if (secretWord.key !== undefined) {
    onePlayerGame();
  } else {
    invalidWordMessage(`Generando partida...`);
    setTimeout(deleteInvalidWordMessage, 1000);
    setTimeout(checkerForNextLevel, 1000);
  }
};
//Reseteador de contadores siguiente nivel
const resetCounters = () => {
  secretWord.key = undefined;
  secretWord.hide = "";
  letersUsed = [];
  damageStatus = 0;
};
//ocultar copyright
const hideCopyright = () => {
  const footer = document.querySelector("footer");
  footer.classList.add("hide");
};
//comprobador de victoria winner
const winnerchecker = () => {
  secretWord.hide === secretWord.key
    ? finishGame(`Enhorabuena`, `Acertaste el código`)
    : {};
};

//Actualizador de palabra secreta
const secretWordUpdate = (updated) => {
  const h2 = document.querySelector("#hideWord");
  h2.innerText = updated;
};
//Actualizador de puntos
const scoreUpdate = () => {
  score += 100;
  const div = document.querySelector("#header");
  div.children[1].innerText = `PUNTUACIÓN:  ${score} PUNTOS`;
};
// Generador de niveles
const levelUpdate = () => {
  level += 1;
  const levels = document.querySelector("#level");
  levels.innerHTML = `Nivel: ${level}`;
};
//Actualizador de parrafos
const paragraphUpdate = (url, sentence) => {
  const p = document.querySelector(url);
  p.innerHTML = sentence;
};
//Has perdido
const loser = () => {
  paragraphUpdate(".info", `La código secreto es:`);
  secretWordUpdate(secretWord.key);
  finishGame(`Fin del juego`, `Te han ahorcado`);
  maxScoreUpdate();
};
//Borrar aviso de palabra no válida
const deleteInvalidWordMessage = () => {
  const temp = document.querySelector("#temp");
  temp.remove();
  secretWord.status = 0;
};
//Aviso de palabra no válida
const invalidWordMessage = (text) => {
  const main = document.querySelector("main");
  const p = document.createElement("p");
  p.setAttribute("id", "temp");
  p.innerHTML = text;
  main.appendChild(p);
  secretWord.status = 1;
};
//letra erronea ---> Actualizador de daños
const damageUpdate = (damage) => {
  const img = document.getElementById("health");
  damageStatus += 1;
  img.alt = `el jugador tiene el ${(
    (100 / (health.length - 1)) *
    damageStatus
  ).toFixed(0)}% de daño`;
  damageStatus <= 6 ? (img.src = health[damageStatus]) : {};
};
const startGame = () => {
  const input = document.querySelector("#userWord");
  secretWord.key = input.value.toUpperCase();
  const twoPlayersDiv = document.querySelector(".twoPlayersMode");
  const main = document.querySelector("main");
  main.removeChild(twoPlayersDiv);
  twoPlayersGame();
};

//Comprobar si una letra se ha usado
const leterUsedChecker = (letersBox, leterUsed) => {
  !letersBox.includes(leterUsed)
    ? letersBox.push(leterUsed)
    : paragraphUpdate(".info", `La letra ${leterUsed} ya ha sido introducida`);
};
//Comprobar si una letra intruducida es válida
const leterChecker = () => {
  const leterButtons = document.querySelectorAll(".leter");
  const header = document.querySelector("#header");
  leterButtons.forEach((leterButton) => {
    leterButton.addEventListener("click", (ev) => {
      deleteparagraph();
      leterUsedChecker(letersUsed, leterButton.value);
      let updateWord = "";
      for (i = 0; i < secretWord.key.length; i++) {
        secretWord.key[i] === leterButton.value
          ? (updateWord += leterButton.value)
          : (updateWord += secretWord.hide[i]);
      }
      if (secretWord.key.includes(leterButton.value) && singlePlayerStatus) {
        if (!secretWord.hide.includes(leterButton.value)) {
          scoreUpdate();
        }
      }
      updateWord === secretWord.hide ? damageUpdate(health) : {};
      damageStatus === 6
        ? loser()
        : ((secretWord.hide = updateWord),
          secretWordUpdate(secretWord.hide),
          winnerchecker());
    });
  });
};

//Generando la cabecera de juego
const createHeaderGame = (text) => {
  const main = document.querySelector("main");
  const div = document.createElement("div");
  div.setAttribute("id", "header");
  const h5 = document.createElement("h5");
  h5.setAttribute("id", "level");
  div.appendChild(h5);
  const h3 = document.createElement("h3");
  h3.innerText = text;
  div.appendChild(h3);
  //generando la palabra oculta
  const h2 = document.createElement("h2");
  h2.setAttribute("id", "hideWord");
  for (leter of secretWord.key) {
    leter !== " " ? (secretWord.hide += "_") : (secretWord.hide += " ");
  }
  h2.innerHTML = secretWord.hide;
  div.appendChild(h2);
  const p = document.createElement("p");
  p.setAttribute("class", "info");
  div.appendChild(p);
  main.appendChild(div);
};
//Generando el cajón de juego
const createBoxGame = () => {
  const main = document.querySelector("main");
  const section = document.createElement("section");
  section.setAttribute("id", "game");
  //salud del jugador
  const img = document.createElement("img");
  img.setAttribute("id", "health");
  img.src = health[damageStatus];
  img.alt = `el jugador tiene el ${
    (100 / (health.length - 1)) * damageStatus
  }% de daño`;
  section.appendChild(img);
  //letras para elegir
  const leterBox = document.createElement("div");
  leterBox.setAttribute("id", "leters");
  for (leter of createAlphabet()) {
    const button = document.createElement("button");
    button.value = leter;
    button.innerText = leter;
    button.classList.add("leter");
    leterBox.appendChild(button);
  }
  section.appendChild(leterBox);
  main.appendChild(section);
};

//MAIN CONTROL EL AHORCADO
maxScoreChecker();
guideButtonChecker();
onePlayerButtonChecker();
twoPlayersButtonChecker();
