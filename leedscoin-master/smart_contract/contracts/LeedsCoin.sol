pragma solidity ^0.4.16;

contract owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}

interface tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external; }

contract LeedsCoin is owned {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    mapping (uint64 => uint256) public totalSupply;

    // This creates an array with all balances for each token
    mapping (address => mapping (uint64 => uint256)) public balanceOf;
    
    // Tracks the owner of each token
    mapping (uint64 => address) tokens;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint64 indexed token, uint256 value);
    
    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint64 indexed token, uint256 value);

    /**
     * Constructor function
     *
     * Initializes contract
     */
    constructor (
        string tokenName,
        string tokenSymbol
    ) public {
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
    }
    
    function register(uint64 token, address tokenOwner) public onlyOwner returns(bool success) {
        require(tokens[token] == 0);
        tokens[token] = tokenOwner;
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint64 _token, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check if the sender has enough
        require(balanceOf[_from][_token] >= _value);
        // Check for overflows
        require(balanceOf[_to][_token] + _value > balanceOf[_to][_token]);
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from][_token] + balanceOf[_to][_token];
        // Subtract from the sender
        balanceOf[_from][_token] -= _value;
        // Add the same to the recipient
        balanceOf[_to][_token] += _value;
        emit Transfer(_from, _to, _token, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from][_token] + balanceOf[_to][_token] == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _token The id of the token to transfer
     * @param _value the amount to send
     */
    function transfer(address _to, uint64 _token, uint256 _value, uint64 blockheight, bytes32 approval) public returns (bool success) {
        // TODO use correct parameters for signature validation
        require(verifyString("", 0, approval, approval, tokens[_token]));
        _transfer(msg.sender, _to, _token, _value);
        return true;
    }
    
    function verifyString(string message, uint8 v, bytes32 r, bytes32 s, address signer) public pure returns (bool success) {
        // TODO
        return true;
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _token the token to burn
     * @param _value the amount of token to burn
     */
    function burn(uint64 _token, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender][_token] >= _value);   // Check if the sender has enough
        balanceOf[msg.sender][_token] -= _value;            // Subtract from the sender
        totalSupply[_token] -= _value;                      // Updates totalSupply
        emit Burn(msg.sender, _token, _value);
        return true;
    }
    
    /// @notice Create `mintedAmount` tokens and send it to `target`
    /// @param target Address to receive the tokens
    /// @param token the token to mint
    /// @param mintedAmount the amount of tokens it will receive
    function mint(address target, uint64 token, uint256 mintedAmount) public {
        // Require minter to be token owner
        require(tokens[token] == msg.sender);
        balanceOf[target][token] += mintedAmount;
        totalSupply[token] += mintedAmount;
        emit Transfer(0, this, token, mintedAmount);
        emit Transfer(this, target, token, mintedAmount);
    }
}
