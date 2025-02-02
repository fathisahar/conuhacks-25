import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { listenToCurrentCard } from "../firebase/firestore";
import WaitingArea from "../components/WaitingArea";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import GameCode from "../components/GameCode";
import splash from "./../assets/splash.svg";
import waitSplash from "./../assets/wait-splash.svg";

const JoinGame = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState<number>(-1); 
  const [deckId, setDeckId] = useState<string | null>(null);
  const storedGameId = Cookies.get("gameId");

  useEffect(() => {
    if (!storedGameId) return;

    const unsubscribe = listenToCurrentCard(
      storedGameId,
      (currentCardValue) => {
        setCurrentCard(currentCardValue);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [storedGameId]);

  useEffect(() => {
    if (storedGameId && currentCard === 0) {
      const gameRef = doc(db, "games", storedGameId);
      getDoc(gameRef)
        .then((docSnapshot) => {
          const gameData = docSnapshot.data();
          const deckIdFromGame = gameData?.deck; 
          setDeckId(deckIdFromGame);
        })
        .catch((error) => console.error("Error fetching deck ID:", error));
    }
  }, [currentCard, storedGameId]);

  useEffect(() => {
    if (deckId && currentCard === 0) {
      navigate(`/gameplay/${deckId}/${storedGameId}`);
    }
  }, [deckId, currentCard, storedGameId, navigate]);

  return (
    <div>
      <img
        src={splash}
        alt="Splash"
        className="absolute top-0 right-3 w-100 h-80 p-0 -z-1"
      />
      <img
        src={waitSplash}
        alt="Wait Splash"
        className="absolute bottom-0 left-4 w-70 h-70 p-0 -z-1"
      />
      <div className="flex flex-col items-center p-8 space-y-12 max-w-4xl mx-auto">
        <div className="flex flex-row justify-start w-full">
          <div className="">
            <GameCode textToCopy={storedGameId ?? ""}></GameCode>
          </div>
        </div>

        <div className="w-full">
          <div className="mb-5 w-100%">
            <WaitingArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGame;
