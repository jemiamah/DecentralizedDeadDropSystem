# Decentralized Dead Drop System

## Overview
A secure, decentralized dead drop system implemented on the Stacks blockchain that enables users to create and claim encrypted messages in a trustless manner.

## Features
- Create encrypted dead drops with access keys
- Secure message claiming mechanism
- One-time-only message retrieval
- Transparent drop status tracking
- UTF-8 message support up to 1024 characters

## Smart Contract Functions

### Create Dead Drop
```clarity
(create-dead-drop (content (string-utf8 1024)) (access-key (buff 32)))
```
Creates a new dead drop with encrypted content and an access key.
- Parameters:
    - `content`: UTF-8 encoded message (max 1024 chars)
    - `access-key`: 32-byte buffer for access control
- Returns: Drop ID on success

### Claim Dead Drop
```clarity
(claim-dead-drop (drop-id uint) (provided-key (buff 32)))
```
Claims a dead drop using the correct access key.
- Parameters:
    - `drop-id`: Unique identifier of the drop
    - `provided-key`: Access key to claim the message
- Returns: Message content on success

### Read-Only Functions
- `get-drop-info`: Retrieve drop metadata
- `get-total-drops`: Get total number of drops created

## Error Codes
- `err-owner-only (u100)`: Unauthorized owner action
- `err-not-found (u101)`: Drop doesn't exist
- `err-already-claimed (u102)`: Drop already claimed
- `err-unauthorized (u103)`: Invalid access key

## Data Structures

### Dead Drop Map
```clarity
{
  creator: principal,
  content: (string-utf8 1024),
  access-key: (buff 32),
  claimed: bool
}
```

## Security Considerations
- One-time message retrieval
- Cryptographic access control
- No message storage in clear text
- Immutable drop history

## Usage Example
```clarity
;; Create a dead drop
(contract-call? .dead-drop create-dead-drop "Secret message" 0x...)

;; Claim a dead drop
(contract-call? .dead-drop claim-dead-drop u1 0x...)

;; Check drop status
(contract-call? .dead-drop get-drop-info u1)
```

## Requirements
- Stacks blockchain compatibility
- Support for UTF-8 encoding
- 32-byte key generation capability

## Testing
- Unit tests provided in test suite
- Mock network implementation available
- Test vectors for key generation

## Future Improvements
- Timed message expiry
- Multiple recipient support
- Message encryption standards
- Front-end integration

## License
[Insert License Information]

## Contributing
[Insert Contribution Guidelines]
