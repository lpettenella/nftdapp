import Array "mo:base/Array";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieSet "mo:base/TrieSet";

import Nftservice "nftservice";
import Types "./types";

actor NftSale {

    type TokenInfo = Types.TokenInfo;
    type UserInfo = Types.UserInfo;
    //type NFToken = Nftservice.NFToken;

    public type Result = {
        #Ok: Nat;
        #Err: Errors;
    };

    public type Errors = {
        #Unauthorized;
        #TokenNotExist;
        #InvalidOperator;
        #NoSale
    };

    type Sale = {
        tokenId: Nat;
        price: Float;
        seller: Principal;
    };

    private var tokens = HashMap.HashMap<Nat, TokenInfo>(1, Nat.equal, Hash.hash);
    private var users = HashMap.HashMap<Principal, UserInfo>(1, Principal.equal, Principal.hash);
    private var sales = HashMap.HashMap<Nat, Sale>(1, Nat.equal, Hash.hash);

    private func _putsale(
        tokenId: Nat, price: Float, seller: Principal
    ) {
        let sale: Sale = {
            tokenId = tokenId;
            price = price;
            seller = seller;
        };
        sales.put(tokenId, sale);
    };

    public shared({ caller }) func sale(tokenId: Nat, price: Float) : async Result {

        let T = await Nftservice.NFToken;

        //check authentication
        let token = await T.getToken(tokenId);

        switch(token) {
            case(?token) {
                if (caller != token.owner)
                    return #Err(#Unauthorized);
            };
            case(null) { return #Err(#TokenNotExist); };
        };

        //check there are no sale for the token
        switch(sales.get(tokenId)) {
            case(?sale) { return #Err(#InvalidOperator); };
            case _ {
                return #Ok(1);
            };
        };
    };

    public shared({ caller }) func buy(tokenId: Nat) : async Result{

        let T  = await Nftservice.NFToken;

        //check if authenticated

        //check if there is a sale for the token
        switch(sales.get(tokenId)) {
            case (?sale) {
                if (sale.seller == caller)
                    return #Err(#Unauthorized);
            };
            case _ { return #Err(#TokenNotExist); };
        };

        //check if the caller icp are more than the token price

        //transfer the money to the token's owner

        //transfer the token from the owner to the caller
        await T.transfer(caller, tokenId);
    };

    public query func getSalesSize() : async Nat {
        return sales.size();
    }

}