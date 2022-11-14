import { type NextPage } from "next";
import Head from "next/head";
import getTriviaFromAPI from "./api/getTriviaFromAPI";
import { useState } from "react";
import Image from "next/image";
import getCatFromAPI from "./api/getCatFromAPI";

//TODO: fix prisma database to saved cats
//TODO: display saved cats nicely when "your cats" button is presseds
//TODO: find another way to change border depending on rarity
//TODO: add weighted list with breeds/borders and prices

const Home: NextPage = () => {
  const [question, setQuestion] = useState("...Loading...");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [firstTry, setFirstTry] = useState(true);
  const [score, setPlayerScore] = useState(0);
  const [savedCats, setSavedCats] = useState(0);
  const [prices, setPrices] = useState([0]);
  const [savedCatPics, setSavedCatPic] = useState([{}]);
  const [inLootMenu, setInLootMenu] = useState(false);
  const [listOfCats, setListOfCats] = useState([""]);
  const [cats, setCats] = useState(Object);
  const [hint, setHint] = useState("");
  const [breeds, setBreeds] = useState([""]);
  const [price, setPrice] = useState(0);
  const [hasBreed, setBreed] = useState(false);
  const [isLegendary, setLegendary] = useState(true);
  const [isRussian, setRussian] = useState(false);
  const [isMaineCoon, setMaineCoon] = useState(false);
  const [isSomali, setSomali] = useState(false);
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
        setInLootMenu(true);
        setHint("Purrfect! please pick one");
        increaseScore(5);
        clearInput();
        loadNextQuestion();
      }
    }
  };

  const goBackToTrivia = () => {
    setHint("");
    setInLootMenu(false);
    loadNextCats();
  };

  const loadNextQuestion = async () => {
    const trivia = await getTriviaFromAPI();
    setQuestion(trivia[0].question);
    setCorrectAnswer(trivia[0].answer);
  };

  const loadNextCats = async () => {
    setListOfCats(catsOfThisRound);
    setPrice(0);

    const cats = await getCatFromAPI();
    setCats(cats);
    for (let i = 0; i < cats.length; i++) {
      pricesOfThisRound[i] = Math.floor(Math.random() * 10) + 2;
      catsOfThisRound[i] = JSON.stringify(cats[i].url ?? "");
      catsOfThisRound[i] = catsOfThisRound[i]?.replaceAll('"', "") ?? "";
    }
    setPrices(pricesOfThisRound);
  };

  const increaseScore = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      setPlayerScore((score) => score + 1);
    }
  };

  const decreaseScore = (amount: number) => {
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

  const buyCat = (index: number) => {
    if (prices[index] && prices ? prices : [0, 0, 0]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (prices[index]! > score) {
        alert("You can't afford that cat, purr-haps you can sell one");
        return;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    decreaseScore(prices[index]!);
    setSavedCatPic(cats[index]);
    setSavedCats((savedCats) => savedCats + 1);
    goBackToTrivia();
  };

  const checkForBreed = (index: number) => {
    if (cats[index].breeds.length > 0) {
      if (cats[index].breeds[0].name) {
        console.log(JSON.stringify("BREED:" + cats[index].breeds[0].name));
        const name:string = cats[index].breeds[0].name;
        if(name.includes("x")){
          pricesOfThisRound[index] = 100;
          setLegendary(true);
        }
        if(name.includes("Russ")){
          setRussian(true);
        }
        if(name.includes("Main")){
          setMaineCoon(true);
        }
        if(name.includes("Soma")){
          setSomali(true);
        }
        setBreeds(cats[index].breeds[0].name);
        setBreed(true);
      }
    } else {
      setLegendary(false);
      setMaineCoon(false);
      setSomali(false);
      setRussian(false);
      setBreeds([""]);
      setBreed(false);
    }
  };



  const showYourSavedCats = () => {
    console.log("You have saved", savedCats + "cats");
    console.log(savedCatPics);
    setPlayerScore(20);
  };

  const displayCatInfo = (index: number) => {
    checkForBreed(index);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setPrice(prices[index]!);
  };

  const hideCatInfo = () => {
    setBreeds([""]);
    setPrice(0);
  };

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
            {score <= 5 ? (
              <button
                onClick={loadNextCats}
                className="full absolute top-0 rounded bg-blue_dark px-2 py-4 text-4xl text-white"
              >
                Skip
              </button>
            ) : null}
            <>
              <p className="px-96 text-4xl font-extrabold text-blue_light">
                {hint}
              </p>
              <div className="flex flex-row">
                {listOfCats.map(function (value: string, index: number) {
                  return (
                    <div key={value}>
                      <Image
                        className="mx-20" 
                        src={value !== undefined && value ? value : ""}
                        alt={""}
                        width={300}
                        height={cats[index].height}
                        onClick={() => buyCat(index)}
                        onMouseOver={() => displayCatInfo(index)}
                        onMouseOut={() =>hideCatInfo()}
                      ></Image>
                    </div>
                  );
                })}
              </div>
            </>
          </div>
          <p className="absolute bottom-0 left-0 flex w-40 flex-row rounded-md bg-blue_light p-4 text-2xl text-white ">
            Purrency: {score}
          </p>
          <button  onClick={showYourSavedCats} className="absolute bottom-0 right-0 rounded-md bg-blue_light p-4 text-2xl text-white ">
            Your Cats: {savedCats}
          </button>
          {price > 0 ? (
            <div className={` ${isRussian ? "border-rare border-4" :null} ${isLegendary ? "border-legendary border-4" : null}
             ${isRussian ? "border-rare border-4" :null}relative ${isMaineCoon ? "border-uncommon" :null}  ${isSomali ? "border-rare":""} text-2xl font-extrabold text-blue_light`}>
              Price:{price}
              {isLegendary ? <div className=" relative right-0">LEGENDARY</div> : ""}
              <div className="relative text-xl">{hasBreed ?<div>
                 Breed: {breeds}</div> : null }</div>
            </div>
          ) : null}
         
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
            Purrency: {score}
          </p>
          <button
            onClick={showYourSavedCats}
            className="absolute bottom-0 right-0 flex w-40 flex-row rounded-md bg-blue_light p-4 text-2xl text-white "
          >
            Your Cats: {savedCats}
          </button>
        </main>
      )}
    </>
  );
};

export default Home;
