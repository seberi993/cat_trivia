import { type NextPage } from "next";
import Head from "next/head";
import getTriviaFromAPI from "./api/getTriviaFromAPI";
import { useState } from "react";
import Image from "next/image";
import getCatFromAPI from "./api/getCatFromAPI";
import LoginPage from "./LoginPage";
import { sayMeow } from "say-meow";

//TODO: fix prisma database to saved cats
//TODO: display saved cats nicely when "your cats" button is presseds
//TODO: fix so that cats dont show until loaded fully

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
  const [isLoading, setLoading] = useState(false);
  const [hintVisibility, setHintVisibility] = useState(false);
  const [hintIndex, setHintIndex] = useState(1);

  const catsOfThisRound: string[] = [];
  const pricesOfThisRound: number[] = [];

  async function initializeData() {
    loadNextQuestion();
    loadNextCats();
    setFirstTry(false);
  }
  const showLoadingScreen = () => {
    setLoading(true);
  };

  const checkAnswer = () => {
    const userInput = document.getElementById(
      "fname"
    ) as HTMLInputElement | null;
    const value = userInput?.value;

    if (value != undefined && value != " ") {
      if (value.toLowerCase() === correctAnswer.toLowerCase()) {
        showLoadingScreen();
        setInLootMenu(true);
        increaseScore(10);
        clearInput();
        loadNextQuestion();
      }
    }
  };

  const goBackToTrivia = () => {
    setInLootMenu(false);
    loadNextCats();
  };

  const loadNextQuestion = async () => {
    const trivia = await getTriviaFromAPI();
    setQuestion(trivia[0].question);
    setCorrectAnswer(trivia[0].answer);
    setHint(trivia[0].answer);
    setHintIndex(1);
    setHintVisibility(false);
  };

  const setLegendaryPrice = () => {
    return Math.floor(Math.random() * 255) + 75;
  };
  const setEpicPrice = () => {
    return Math.floor(Math.random() * 110) + 50;
  };
  const setRarePrice = () => {
    return Math.floor(Math.random() * 50) + 15;
  };
  const setUncommonPrice = () => {
    return Math.floor(Math.random() * 30) + 10;
  };
  const setCommonPrice = () => {
    return Math.floor(Math.random() * 10) + 2;
  };

  const loadNextCats = async () => {
    setListOfCats(catsOfThisRound);
    setPrice(0);
    const cats = await getCatFromAPI();
    setCats(cats);

    for (let i = 0; i < cats.length; i++) {
      pricesOfThisRound[i] = setCommonPrice();
      console.log(cats[i].height);
      if (cats[i].breeds[0]) {
        pricesOfThisRound[i] = setRarePrice();
        if (JSON.stringify(cats[i].breeds[0].name).includes("x")) {
          pricesOfThisRound[i] = setEpicPrice();
          if (cats[i].url.includes(".gif") > 0) {
            pricesOfThisRound[i] = setLegendaryPrice();
          }
        }
        if (JSON.stringify(cats[i].breeds[0].name).includes("ambino")) {
        }
      } else {
        if (cats[i].url.includes(".gif") > 0) {
          pricesOfThisRound[i] = setRarePrice();
        }
        if (cats[i].height > 600) {
          pricesOfThisRound[i] = setUncommonPrice();
        }
      }
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
    if(amount < score){
      for (let i = 0; i < amount; i++) {
        setPlayerScore((score) => score - 1);
      }
    }else{
      alert("You are out of treats!");
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
    console.log(sayMeow("Meow"));
  };

  const buyCat = (index: number) => {
    if (prices[index] && prices ? prices : [0, 0, 0]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (prices[index]! > score) {
        alert("You can't afford that cat, purr-haps sell one");
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
        setBreed(true);
        const name: string = cats[index].breeds[0].name;
        setBreeds([name]);
        return true;
      } else {
        setBreed(false);
        setBreeds([""]);

        return false;
      }
    }
  };

  const showYourSavedCats = () => {
    console.log("You have saved", savedCats + "cats");
   
    console.log(savedCatPics);
    setPlayerScore((score) => score + 20);
  };

  const displayCatInfo = (index: number) => {
    checkForBreed(index);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setPrice(prices[index]!);
  };

  const hideCatInfo = () => {
    setBreeds([""]);
    setPrice(0);
    setBreed(false);
  };

  const setBorderDependingOnPrice = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (prices[index]! > 100) {
      return "border-legendary hover:border-8";
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (prices[index]! > 10 && prices[index]! <= 25) {
      return "border-uncommon ";
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (prices[index]! > 0 && prices[index]! <= 10) {
      return "border-white";
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (prices[index]! >= 25 && prices[index]! <= 40) {
      return "border-rare";
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (prices[index]! >= 40 && prices[index]! <= 100) {
      return "border-epic";
    }
  };
  const getNextHintLetter = () => {
    if (score > 0) {
      setHintVisibility(true);
      getNextLetterOfHint();
    } else {
      alert("You can't afford a hint, sell a cat");
      setHintVisibility(false);
    }
  };

  const getNextLetterOfHint = () => {
    if (hintIndex <= correctAnswer.length && score > hintIndex) {
      setHintIndex((hintIndex) => hintIndex + 1);
      const partOfHint = correctAnswer.substring(0,hintIndex);
      decreaseScore(hintIndex);
      setHint(partOfHint)

    }else{
      alert("You can't afford a hint, sell a cat");
    }
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
            {score <= 10 ? (
              <button
                onClick={loadNextCats}
                className="full absolute top-0 rounded bg-blue_dark px-2 py-4 text-4xl text-white"
              >
                Skip
              </button>
            ) : null}
            <>
              <div className="flex flex-row">
                {listOfCats.map(function (value: string, index: number) {
                  return (
                    <div key={value}>
                      <Image
                        className={`max-h-screen rounded-lg  border-4 hover:border-8  ${setBorderDependingOnPrice(
                          index
                        )}`}
                        src={value !== undefined && value ? value : ""}
                        alt={""}
                        width={300}
                        id="pic"
                        height={cats[index].height}
                        onClick={() => buyCat(index)}
                        onMouseOver={() => displayCatInfo(index)}
                        onMouseOut={() => hideCatInfo()}
                      ></Image>
                    </div>
                  );
                })}
              </div>
            </>
          </div>
          <p className="treats">Treats: {score}</p>
          <button onClick={showYourSavedCats} className="yourSavedCats">
            Your Cats: {savedCats}
          </button>
          {price > 0 ? <div className="price">Price:{price}</div> : null}
          {price > 100 ? <div className="legendaryPic">God-like</div> : null}
          {price < 100 && price >= 40 ? (
            <div className="epicPic">Epic</div>
          ) : null}
          {price >= 11 && price <= 25 ? (
            <div className="uncommonPic">Uncommon</div>
          ) : null}
          {price > 25 && price <= 40 ? (
            <div className="rarePic">Rare</div>
          ) : null}
          {price <= 10 && price > 0 ? (
            <div className="commonPic">Common</div>
          ) : null}
          {hasBreed ? <div className="breed">Breed:{breeds}</div> : null}
        </div>
      ) : (
        <main className=" grid min-h-screen place-items-center  bg-gradient-to-t from-background_dark to-background_bright">
          {firstTry ? (
            <div>
              <LoginPage />
              <button
                onClick={initializeData}
                className="rounded-full bg-blue_light px-16 py-8 text-4xl font-extrabold text-white hover:bg-blue_light"
              >
                Start
              </button>
            </div>
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
              <button
                onClick={getNextHintLetter}
                className="absolute top-0 right-80 rounded-full bg-blue_light py-2 px-4 font-bold text-white hover:bg-blue_dark"
              >
                Get Hint!
              </button>
              {hintVisibility ? (
                <p className=" user-select:none relative text-4xl text-white ">
                  {hint}
                </p>
              ) : null}
            </div>
          )}
          <p className="absolute bottom-0 left-0 rounded-md bg-blue_light p-4 text-2xl text-white ">
            Treats: {score}
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
