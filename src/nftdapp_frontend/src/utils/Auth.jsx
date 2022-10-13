import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from "@dfinity/agent";
import { whoami, createActor as createWhoamiActor } from '../../../declarations/whoami';
import { nftservice, createActor as createNftActor } from '../../../declarations/nftservice';
import { sale, createActor as createSaleActor } from '../../../declarations/sale/index';
import { setMaxListeners } from 'process';

class Auth {
  client = null;
  nftservice = nftservice;
  sale = sale;
  principal = "";

  async init() {
    this.client = await AuthClient.create();
    const isAuth = await this.client.isAuthenticated();
    if (isAuth ) {
      this.principal = String(await this.client.getIdentity().getPrincipal());
      this.generateActors();
    }
    return isAuth;
  }

  warn() {
    console.log("Auth client not initialized.")
  }

  iiUrl() {
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = `http://localhost:8000/?canisterId=${process.env.II_CANISTER_ID}`;
    } else if (process.env.DFX_NETWORK === "ic") {
      iiUrl = `https://${process.env.II_CANISTER_ID}.ic0.app`;
    } else {
      iiUrl = `https://${process.env.II_CANISTER_ID}.dfinity.network`;
    }
    return iiUrl;
  }

  generateActors() {
    if (!this.client) return;
    const identity = this.client.getIdentity();
    this.nftservice = createNftActor('r7inp-6aaaa-aaaaa-aaabq-cai', { agentOptions: { identity } });
    this.sale = createSaleActor('qsgjb-riaaa-aaaaa-aaaga-cai', { agentOptions: { identity } });
    //this.whoami = createWhoamiActor('r7inp-6aaaa-aaaaa-aaabq-cai', { agentOptions: { identity } });
  }

  async login() {
    return new Promise((resolve, reject) => {
      if (!this.client) { 
        this.warn();
        reject("AuthClient not initialized");
      }
      this.client.login({
        onSuccess: async () => {
            this.generateActors();
            this.principal = String(await this.client.getIdentity().getPrincipal());
            resolve();
        },
        identityProvider: `http://localhost:8000/?canisterId=rrkah-fqaaa-aaaaa-aaaaq-cai`
      });
    });
  }

  async logout() {
    return new Promise((resolve, reject) => {
      if (!this.client) return this.warn();
      this.client.logout();
      resolve();
    })
  }

}

export const auth = new Auth();