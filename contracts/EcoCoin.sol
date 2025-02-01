// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// EcoCoin Token Contract
contract EcoCoin is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("EcoCoin", "ECO")
        Ownable(initialOwner)
    {}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

// Main EcoCoin Marketplace Contract
contract EcoCoinMarketplace is ReentrancyGuard, Ownable {
    EcoCoin public ecoCoin;
    uint256 public constant VOTING_DURATION = 5 minutes;
    uint256 public constant REWARD_AMOUNT = 2; // 2 EcoCoins for correct voters
    uint256 public constant COINS_PER_CREDIT = 100000; // 1 Carbon Credit = 100,000 EcoCoins

    struct User {
        string name;
        string profilePhotoIpfsHash;
        uint256 totalClaimsSubmitted;
        uint256 successfulClaims;
        uint256 totalVotesCast;
        uint256 correctVotes;
        bool isRegistered;
        uint256 reputationScore; // Increases with successful claims and correct votes
    }
    
    struct Claim {
        uint256 id;
        address owner;
        string name;
        string photoIpfsHash;
        string claimType;
        uint256 expectedCoins;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool revealed;
        ClaimStatus status;
        mapping(address => bool) hasVoted;
        mapping(address => bool) votedFor;
    }
    
    struct ClaimView {
        uint256 id;
        address owner;
        string name;
        string photoIpfsHash;
        string claimType;
        uint256 expectedCoins;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool revealed;
        ClaimStatus status;
    }
    
    enum ClaimStatus { Pending, Approved, Rejected }
    
    mapping(uint256 => Claim) public claims;
    mapping(address => User) public users;
    mapping(address => uint256) public lastClaimTime;
    uint256 public claimCounter;
    
    event UserRegistered(address indexed userAddress, string name);
    event ClaimSubmitted(uint256 indexed claimId, address indexed owner, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 indexed claimId, address indexed voter);
    event ClaimResolved(uint256 indexed claimId, ClaimStatus status, uint256 forVotes, uint256 againstVotes);
    event RewardDistributed(uint256 indexed claimId, address indexed voter, uint256 amount);
    event ReputationUpdated(address indexed user, uint256 newScore);
    
    constructor(address _ecoCoin, address initialOwner) 
        Ownable(initialOwner)
    {
        ecoCoin = EcoCoin(_ecoCoin);
    }

    function registerUser(
        string memory _name,
        string memory _profilePhotoIpfsHash
    ) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            name: _name,
            profilePhotoIpfsHash: _profilePhotoIpfsHash,
            totalClaimsSubmitted: 0,
            successfulClaims: 0,
            totalVotesCast: 0,
            correctVotes: 0,
            isRegistered: true,
            reputationScore: 100 // Starting reputation score
        });
        
        emit UserRegistered(msg.sender, _name);
    }
    
    function submitClaim(
        string memory _name,
        string memory _photoIpfsHash,
        string memory _claimType,
        uint256 _expectedCoins
    ) external {
        require(users[msg.sender].isRegistered, "User not registered");
        require(block.timestamp >= lastClaimTime[msg.sender] + 1 days, "Can only submit one claim per day");
        require(_expectedCoins > 0, "Expected coins must be greater than 0");
        
        uint256 claimId = claimCounter++;
        Claim storage newClaim = claims[claimId];
        
        newClaim.id = claimId;
        newClaim.owner = msg.sender;
        newClaim.name = _name;
        newClaim.photoIpfsHash = _photoIpfsHash;
        newClaim.claimType = _claimType;
        newClaim.expectedCoins = _expectedCoins;
        newClaim.startTime = block.timestamp;
        newClaim.endTime = block.timestamp + VOTING_DURATION;
        newClaim.status = ClaimStatus.Pending;
        newClaim.revealed = false;
        
        users[msg.sender].totalClaimsSubmitted++;
        lastClaimTime[msg.sender] = block.timestamp;
        
        emit ClaimSubmitted(claimId, msg.sender, newClaim.startTime, newClaim.endTime);
    }
    
    function vote(uint256 _claimId, bool _voteFor) external {
        require(users[msg.sender].isRegistered, "User not registered");
        Claim storage claim = claims[_claimId];
        
        require(block.timestamp >= claim.startTime, "Voting has not started");
        require(block.timestamp < claim.endTime, "Voting has ended");
        require(!claim.hasVoted[msg.sender], "Already voted");
        require(claim.owner != msg.sender, "Cannot vote on own claim");
        
        claim.hasVoted[msg.sender] = true;
        claim.votedFor[msg.sender] = _voteFor;
        
        if (_voteFor) {
            claim.forVotes++;
        } else {
            claim.againstVotes++;
        }

        users[msg.sender].totalVotesCast++;
        
        emit VoteCast(_claimId, msg.sender);
    }
    
    function resolveClaim(uint256 _claimId) external {
        Claim storage claim = claims[_claimId];
        
        require(block.timestamp >= claim.endTime, "Voting period not ended");
        require(!claim.revealed, "Claim already resolved");
        require(claim.status == ClaimStatus.Pending, "Claim already resolved");
        
        claim.revealed = true;
        bool isApproved = claim.forVotes > claim.againstVotes;
        
        if (isApproved) {
            claim.status = ClaimStatus.Approved;
            users[claim.owner].successfulClaims++;
            ecoCoin.mint(claim.owner, claim.expectedCoins);
            updateReputation(claim.owner, true);
        } else {
            claim.status = ClaimStatus.Rejected;
            updateReputation(claim.owner, false);
        }
        
        emit ClaimResolved(_claimId, claim.status, claim.forVotes, claim.againstVotes);
        
        // Reward correct voters
        distributeRewards(_claimId);
    }
    
    function distributeRewards(uint256 _claimId) internal {
        Claim storage claim = claims[_claimId];
        bool majorityVotedFor = claim.forVotes > claim.againstVotes;
        
        for (uint256 i = claim.startTime; i < claim.endTime; i++) {
            address voter = address(uint160(i)); // This is a placeholder
            if (claim.hasVoted[voter]) {
                if (claim.votedFor[voter] == majorityVotedFor) {
                    users[voter].correctVotes++;
                    ecoCoin.mint(voter, REWARD_AMOUNT);
                    updateReputation(voter, true);
                    emit RewardDistributed(_claimId, voter, REWARD_AMOUNT);
                } else {
                    updateReputation(voter, false);
                }
            }
        }
    }

    function updateReputation(address _user, bool _positive) internal {
        User storage user = users[_user];
        
        if (_positive) {
            user.reputationScore = user.reputationScore + 5 > 1000 ? 
                1000 : user.reputationScore + 5;
        } else {
            user.reputationScore = user.reputationScore < 3 ? 
                0 : user.reputationScore - 3;
        }
        
        emit ReputationUpdated(_user, user.reputationScore);
    }
    
    // View functions
    function getUser(address _userAddress) external view returns (User memory) {
        return users[_userAddress];
    }

    function getClaimView(uint256 _claimId) external view returns (ClaimView memory) {
        Claim storage claim = claims[_claimId];
        return ClaimView({
            id: claim.id,
            owner: claim.owner,
            name: claim.name,
            photoIpfsHash: claim.photoIpfsHash,
            claimType: claim.claimType,
            expectedCoins: claim.expectedCoins,
            startTime: claim.startTime,
            endTime: claim.endTime,
            forVotes: claim.revealed ? claim.forVotes : 0,
            againstVotes: claim.revealed ? claim.againstVotes : 0,
            revealed: claim.revealed,
            status: claim.status
        });
    }
    
    function canVote(uint256 _claimId, address _voter) external view returns (bool) {
        Claim storage claim = claims[_claimId];
        return users[_voter].isRegistered &&
               !claim.hasVoted[_voter] && 
               claim.owner != _voter && 
               block.timestamp >= claim.startTime && 
               block.timestamp < claim.endTime;
    }
    
    function getTimeUntilNextClaim(address _user) external view returns (uint256) {
        if (block.timestamp < lastClaimTime[_user] + 1 days) {
            return (lastClaimTime[_user] + 1 days) - block.timestamp;
        }
        return 0;
    }
}