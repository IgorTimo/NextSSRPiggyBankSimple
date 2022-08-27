import { ethers } from "ethers";
import { useState, useEffect } from "react";
import approvePiggyBank from "./contracts/approvePiggyBank";
import provider from "./contracts/provider";
import {useRouter} from "next/router"

const Index = ({ approver, desc, isApproved, owner }) => {
  const [currentAcount, setCurrentAccount] = useState();
  const router = useRouter();


  useEffect(() => {
    

  }, [currentAcount]);

  async function logIn() {
    const address = (await provider.send("eth_requestAccounts", []))[0];
    setCurrentAccount(address);
  }

  function logOut() {
    setCurrentAccount("");
  }

  const handleSetApproverClick = async () => {
    const signer = provider.getSigner();
    const approvePiggyBankWithSigner = approvePiggyBank.connect(signer);
    try {
        const tx = await approvePiggyBankWithSigner.setApprover();
        console.log("tx: ", tx);
        const resoponse = await tx.wait();
        console.log("resoponse: ", resoponse);
        router.reload();
    } catch (error) {
        console.error(error);
    }
    
  }

  return (
    <div style={{ textAlign: "center" }}>
      {currentAcount ? (
        <div>
          <h1>{currentAcount}</h1>
          <button onClick={logOut}>Log out</button>{" "}
        </div>
      ) : (
        <button onClick={logIn}>Log in Metamask</button>
      )}

      <div>
        <p>Approver: {approver}</p>
        <p>Description: {desc}</p>
        <p>{isApproved ? "Withdraw available" : "Withdraw not available"}</p>
        <p>Owner: {owner}</p>
      </div>
      <button onClick={handleSetApproverClick}>Set Approver</button>
    </div>
  );
};

export default Index;

export async function getServerSideProps(context) {


  try {
    const approver = await approvePiggyBank.approver();
    console.log(approver);

    const desc = await approvePiggyBank.desc();
    console.log(desc);

    const isApproved = await approvePiggyBank.isApproved();
    console.log(isApproved);

    const owner = await approvePiggyBank.owner();
    console.log(owner);
    return {
      props: { approver, desc, isApproved, owner },
    };
  } catch (err) {
    console.log(err);
  }

  return {
    props: { text: "hello mcs" },
  };
}
