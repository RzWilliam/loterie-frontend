import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LoterieABI from "./Loterie.json";
import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [loterie, setLoterie] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [gagnant, setGagnant] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => setAccount(accounts[0]));
      const loterieInstance = new web3.eth.Contract(
        LoterieABI.abi,
        "0xc5C01818024aa3062178249485A72961E6a90307"
      );
      setLoterie(loterieInstance);
    }
  }, []);

  const participer = async () => {
    try {
      await loterie.methods.participer().send({
        from: account,
        value: web3.utils.toWei("0.001", "ether"),
      });
      await recupererParticipants();
    } catch (error) {
      console.error("Erreur lors de la participation :", error);
    }
  };

  const lancerTirage = async () => {
    try {
      const receipt = await loterie.methods
        .lancerTirage()
        .send({ from: account });

      // Vérifier que la transaction a été confirmée avec succès
      console.log("Tirage exécuté avec succès, receipt : ", receipt);
      await recupererGagnant();
    } catch (error) {
      console.error("Erreur lors du lancement du tirage :", error);
    }
  };

  const recupererParticipants = async () => {
    try {
      const liste = await loterie.methods.recupererParticipants().call();
      setParticipants(liste);
    } catch (error) {
      console.error("Erreur lors de la récupération des participants :", error);
    }
  };

  console.log(participants, account);

  const recupererGagnant = async () => {
    try {
      const gagnant = await loterie.methods.recupererGagnant().call();
      setGagnant(gagnant);
    } catch (error) {
      console.error("Erreur lors de la récupération du gagnant :", error);
    }
  };

  useEffect(() => {
    if (loterie) {
      recupererParticipants();
      recupererGagnant();
    }
  }, [loterie]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Loterie Blockchain</h1>
      <p className="mb-4">Compte connecté : {account}</p>
      <div className="flex gap-4">
        <button
          onClick={participer}
          className={`bg-blue-500 px-6 py-2 rounded transition-all ${
            participants &&
            account &&
            participants
              .map((p) => p.toLowerCase())
              .includes(account.toLowerCase())
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-blue-700"
          }`}
          disabled={
            participants &&
            account &&
            participants
              .map((p) => p.toLowerCase())
              .includes(account.toLowerCase())
          }
        >
          Participer
        </button>
        {account && account === "0x1a0c73074db0a56c6cb17046b339bacaf9ef68b6" && (
          <button
            onClick={lancerTirage}
            className={`px-6 py-2 rounded bg-red-500 transition-all ${
              participants.length < 2
                ? "cursor-not-allowed opacity-50"
                : " hover:bg-red-700"
            }`}
            disabled={participants.length < 2}
          >
            Lancer le Tirage
          </button>
        )}
      </div>
      <h2 className="text-2xl font-semibold mt-8">Participants</h2>
      <ul className="bg-gray-800 p-4 mt-4 rounded text-center">
        {participants.length > 0 ? (
          participants.map((participant, index) => (
            <li key={index} className="border-b border-gray-700 py-2">
              {participant}
            </li>
          ))
        ) : (
          <p>Aucun participant pour l'instant</p>
        )}
      </ul>
      <h2 className="text-2xl font-semibold mt-8">Gagnant</h2>
      <p className="bg-gray-800 p-4 mt-4 rounded text-center">
        {gagnant !== "0x0000000000000000000000000000000000000000"
          ? gagnant
          : "Pas encore de gagnant"}
      </p>
    </div>
  );
};

export default App;
