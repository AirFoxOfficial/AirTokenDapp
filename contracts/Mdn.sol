pragma solidity ^0.4.10;

import "./Token.sol";

contract Mdn is Owned, SafeMath, Finalizable {

    Token public token;

    event TransferredToMdn(address indexed _from, address _to, uint256 indexed _value, bytes30 indexed mdn);

    event BoughtData(address indexed _from, uint256 _value, bytes30 indexed _mdn, bytes32 _uuid);

    function Mdn () {
    }

    function setToken(address _c) onlyOwner notFinalized {
        token = Token(_c);
    }

    function transferToMdn(uint256 _value, bytes30 _mdn) returns (bool) {
        require(_value > 0);

        if (token.transferFrom(msg.sender, this, _value)) {

            TransferredToMdn(msg.sender, this, _value, _mdn);
            return true;
        }
        return false;
    }

    function buyMdnData(uint256 _value, bytes30 _mdn, bytes32 _uuid) returns (bool) {
        require(_value > 0);

        if (token.transferFrom(msg.sender, this, _value)) {
            BoughtData(msg.sender, _value, _mdn, _uuid);
            return true;
        }
        return false;
    }

    function withdrawTokens(address _addr, address _to) external onlyOwner returns (bool) {
        IToken itoken = IToken(_addr);
        return itoken.transfer(_to, itoken.balanceOf(this));
    }

}
