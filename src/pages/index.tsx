import { type NextPage } from "next";
import Head from "next/head";
import getTriviaFromAPI from "./api/getTriviaFromAPI";
import { useState } from "react";
import Image from "next/image";
import getCatFromAPI from "./api/getCatFromAPI";
//TODO: fix prices / score sync
//TODO: fix prisma database to saved cats
//TODO: display saved cats nicely when "your cats" button is pressed
const Home: NextPage = () => {
  const [question, setQuestion] = useState("...Loading...");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [firstTry, setFirstTry] = useState(true);
  const [score, setPlayerScore] = useState(0);
  const [savedCats, setSavedCats] = useState(0);
  const [prices, setPrices] = useState([0]);
  const [savedCatPics, setSavedCatPic]= useState([{}])

  const [inLootMenu, setInLootMenu] = useState(false);
  const [listOfCats, setListOfCats] = useState([""]);
  const [cats, setCats] = useState(Object);
  const [hint, setHint] = useState("");

  const catsOfThisRound: string[] = [];
  const pricesOfThisRound: number[] = [];

  async function initializeData() {
    loadNextQuestion();
    loadNextCats();
    setFirstTry(false);
  }

  const checkAnswer = () => {
    const userInput = document.getElementById(
      "fname"
    ) as HTMLInputElement | null;
    const value = userInput?.value;

    if (value != undefined && value != " ") {
      if (value.toLowerCase() === correctAnswer.toLowerCase()) {
        console.log("correct!");
        setInLootMenu(true);
        setHint("Good job! pick one");
        increaseScore(5);
        clearInput();
        loadNextQuestion();
      }
    }
  };

  const goBackToTrivia = () => {
    setHint("");
    decreaseScore(1);
    setInLootMenu(false);
    loadNextCats();
  };

  const loadNextQuestion = async () => {
    const trivia = await getTriviaFromAPI();
    setQuestion(trivia[0].question);
    setCorrectAnswer(trivia[0].answer);
  };

  const loadNextCats = async () => {
    const cats = await getCatFromAPI();
   
    setCats(cats);
    for (let i = 0; i < cats.length; i++) {
      pricesOfThisRound[i] = Math.floor(Math.random() * 5) + 1;
      catsOfThisRound[i] = JSON.stringify(cats[i].url ?? "");
      catsOfThisRound[i] = catsOfThisRound[i]?.replaceAll('"', "") ?? "";
      checkForGif(JSON.stringify(catsOfThisRound[i]),i);
    }
    setPrices(pricesOfThisRound);
    setListOfCats(catsOfThisRound);
  };

  const increaseScore = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      setPlayerScore((score) => score + 1);
    }
  };

  const decreaseScore = (amount: any) => {
    for (let i = 0; i < amount; i++) {
      setPlayerScore((score) => score - 1);
    }
  };

  const clearInput = () => {
    const textArea = document.getElementById(
      "fname"
    ) as HTMLInputElement | null;
    if (textArea != null) {
      textArea.value = "";
    }
  };

  const cheat = () => {
    const textArea = document.getElementById(
      "fname"
    ) as HTMLInputElement | null;
    if (textArea != null) {
      textArea.value = correctAnswer;
    }
  };
  const checkForGif = (str: string, index: number) => {
    if (str.includes(".gif")) {
      pricesOfThisRound[index] = Math.floor(Math.random() * 50) + 15;
      return "hover:border-epic border-4";
    } else {
      return "hover:border-uncommon border-2";
    }
  };

  const buyCat = (index: number) => {
    if (pricesOfThisRound[index] && pricesOfThisRound ? [index] : 0 > score) {
      alert("You can't afford that cat");
      console.log("price", pricesOfThisRound[index]);
      console.log("score", score);
      return;
    }
    console.log("You have ", score)
    console.log("you bought", cats[index]);
    decreaseScore(prices[index]);
    console.log("costed you",prices[index]);
    console.log("You have now", score)
    setSavedCatPic(cats[index]);
    setSavedCats((savedCats) => savedCats + 1);

    goBackToTrivia();

  };

  const checkForBreed = (index: number) => {
    if (cats[index].breeds > 0) {
      console.log(cats[index].breeds);
    }
  };

  const showYourSavedCats = () =>{
    console.log("You have saved",savedCats + "cats");
    console.log(savedCatPics);
  }

  return (
    <>
      <Head>
        <title>cats cats cats cats cats cats cats cats cats</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {inLootMenu ? (
        <div className="max-h-screen min-h-screen bg-gradient-to-t from-background_dark to-background_bright  ">
          <div>
            <>
              <p className="px-96 text-4xl font-extrabold text-blue_light">
                {hint}
              </p>

              <div className="flex flex-row">
                {listOfCats.map(function (value: string, index: number) {
                  return (
                    <div key={value}>
                      <Image
                        className={`${checkForBreed(index)}  ${checkForGif(
                          value,
                          index
                        )} mx-10`}
                        src={value !== undefined && value ? value : ""}
                        alt={""}
                        width={300}
                        height={cats[index].height}
                        onClick={() => buyCat(index)}
                      ></Image>
                      price:{prices[index]}
                    </div>
                  );
                })}
              </div>
            </>
          </div>
          <p className="absolute bottom-0 left-0 flex w-40 flex-row rounded-md bg-blue_light p-4 text-2xl text-white ">
            Cat treats: {score}
          </p>
          <button className="absolute bottom-0 right-0 flex w-40 flex-row rounded-md bg-blue_light p-4 text-2xl text-white ">
            Your Cats: {savedCats}
          </button>
        </div>
      ) : (
        <main className=" grid min-h-screen place-items-center  bg-gradient-to-t from-background_dark to-background_bright">
          {firstTry ? (
            <button
              onClick={initializeData}
              className="rounded-full bg-blue_dark  px-8 py-4 font-bold text-white hover:bg-blue_light"
            >
              Start
            </button>
          ) : (
            <div className=" top-20 grid text-2xl font-extrabold text-text_field ">
              {question}

              <textarea
                onKeyPress={checkAnswer}
                id="fname"
                className="w-120 static  grid resize-none rounded-lg  border-4 border-blue_light bg-blue_light text-2xl text-white hover:border-blue_dark"
              ></textarea>
              <button
                onClick={cheat}
                className=" absolute top-0 left-80 rounded-full bg-blue_light py-2 px-4 font-bold text-white hover:bg-blue_dark"
              >
                Cheat
              </button>
            </div>
          )}
          <p className="absolute bottom-0 left-0 rounded-md bg-blue_light p-4 text-2xl text-white ">
            Cat treats: {score}
          </p>
          <button onClick={showYourSavedCats}className="absolute bottom-0 right-0 flex w-40 flex-row rounded-md bg-blue_light p-4 text-2xl text-white ">
            Your Cats: {savedCats}
          </button>
        </main>
      )}
    </>
  );
};

export default Home;
