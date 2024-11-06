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
            window.ethereum.request({ method: "eth_requestAccounts" })
                .then(accounts => setAccount(accounts[0]));
            const loterieInstance = new web3.eth.Contract(LoterieABI.abi, "0xD69aEA3D142335188248187824a0AB7D89D2c8E3");
            setLoterie(loterieInstance);
        }
    }, []);

    const participer = async () => {
        await loterie.methods.participer().send({
            from: account,
            value: web3.utils.toWei("0.001", "ether")
        });
    };

    const lancerTirage = async () => {
        await loterie.methods.lancerTirage().send({ from: account });
    };

    const recupererParticipants = async () => {
        const liste = await loterie.methods.recupererParticipants().call();
        setParticipants(liste);
    };

    const recupererGagnant = async () => {
        const gagnant = await loterie.methods.recupererGagnant().call();
        setGagnant(gagnant);
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
                <button onClick={participer} className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-700">
                    Participer
                </button>
                <button onClick={lancerTirage} className="bg-red-500 px-6 py-2 rounded hover:bg-red-700">
                    Lancer le Tirage
                </button>
            </div>
            <h2 className="text-2xl font-semibold mt-8">Participants</h2>
            <ul className="bg-gray-800 p-4 mt-4 rounded w-64 text-center">
                {participants.length > 0 ? participants.map((participant, index) => (
                    <li key={index} className="border-b border-gray-700 py-2">{participant}</li>
                )) : (
                    <p>Aucun participant pour l'instant</p>
                )}
            </ul>
            <h2 className="text-2xl font-semibold mt-8">Gagnant</h2>
            <p className="bg-gray-800 p-4 mt-4 rounded w-64 text-center">{gagnant || "Pas encore de gagnant"}</p>
        </div>
    );
};

export default App;
