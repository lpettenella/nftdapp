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

import Nftservice "canister:nftservice";
import Types "./types";

actor NftSale {

    type TokenInfo = Types.TokenInfo;
    type TokenInfoExt = Types.TokenInfoExt;
    type UserInfo = Types.UserInfo;

    public type Result<Ok, Err> = {#ok : Ok; #err : Err};

    public type MintResult = {
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

    private stable var salesEntries : [(Nat, Sale)] = [];
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

    public shared({ caller }) func sale(tokenId: Nat, price: Float) : async MintResult {

        //check authentication

        let token : Result<TokenInfoExt, Errors> = await Nftservice.getTokenInfo(tokenId);

        switch(token) {
            case(#ok(tokeninfo)) {
                if (caller != tokeninfo.owner)
                    return #Err(#Unauthorized);
            };
            case(#err(e)) {
                return #Err(#TokenNotExist);
            };
        };

        //check there are no sale for the token
        switch(sales.get(tokenId)) {
            case(?sale) { return #Err(#InvalidOperator); };
            case _ {
                _putsale(tokenId, price, caller);
                return #Ok(1);
            };
        };
    };

/*
    public shared({ caller }) func buy(tokenId: Nat) : async MintResult{

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
    };*/

    public query func getTokenPrice(tokenId: Nat) : async ?Float {
        switch(sales.get(tokenId)) {
            case(?sale) {
                return ?sale.price;
            };
            case _ {
                return null;
            }
        }
    };

    public query func getSalesSize() : async Nat {
        return sales.size();
    };

    // upgrade functions
    system func preupgrade() {
        salesEntries := Iter.toArray(sales.entries());
    };

    system func postupgrade() {
        type Sale = Types.Sale;

        sales := HashMap.fromIter<Nat, Sale>(salesEntries.vals(), 1, Nat.equal, Hash.hash);
        salesEntries := [];
    };

}