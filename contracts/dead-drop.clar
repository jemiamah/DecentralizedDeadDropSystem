;; Decentralized Dead Drop System

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-claimed (err u102))
(define-constant err-unauthorized (err u103))

;; Data variables
(define-data-var next-drop-id uint u0)

;; Data maps
(define-map dead-drops
  uint
  {
    creator: principal,
    content: (string-utf8 1024),
    access-key: (buff 32),
    claimed: bool
  }
)

;; Public functions
(define-public (create-dead-drop (content (string-utf8 1024)) (access-key (buff 32)))
  (let
    (
      (drop-id (var-get next-drop-id))
    )
    (map-set dead-drops drop-id {
      creator: tx-sender,
      content: content,
      access-key: access-key,
      claimed: false
    })
    (var-set next-drop-id (+ drop-id u1))
    (ok drop-id)
  )
)

(define-public (claim-dead-drop (drop-id uint) (provided-key (buff 32)))
  (let
    (
      (drop (unwrap! (map-get? dead-drops drop-id) (err err-not-found)))
    )
    (asserts! (not (get claimed drop)) (err err-already-claimed))
    (asserts! (is-eq (get access-key drop) provided-key) (err err-unauthorized))
    (map-set dead-drops drop-id (merge drop { claimed: true }))
    (ok (get content drop))
  )
)

;; Read-only functions
(define-read-only (get-drop-info (drop-id uint))
  (match (map-get? dead-drops drop-id)
    drop (ok {
      creator: (get creator drop),
      claimed: (get claimed drop)
    })
    (err err-not-found)
  )
)

(define-read-only (get-total-drops)
  (ok (var-get next-drop-id))
)

