# Security Specification - J Content Factory

## 1. Data Invariants
- A portfolio item must have a valid title and category.
- Only registered admins can modify any data.
- Global site configuration is a singleton document at `/config/global`.
- Public users can only read content, never write.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthorized Write**: Non-logged in user trying to add to `/portfolio`.
2. **Identity Spoofing**: Logged in non-admin user trying to edit `/config/global`.
3. **Invalid Type**: Sending a boolean for `title`.
4. **Oversized String**: Sending 1MB of text for `description`.
5. **Shadow Fields**: Adding `isAdmin: true` to a portfolio item.
6. **Immutable field update**: Trying to change `createdAt` on an existing item.
7. **Malformed ID**: Using special characters in a custom doc ID.
8. **Missing Required Field**: Creating a portfolio item without an `imageUrl`.
9. **Invalid Category**: Setting category to something other than "Directing" or "Production".
10. **Admin Escalation**: Regular user trying to write to an (imaginary) `admins/` collection.
11. **PII Leak**: Attempting to read a sensitive user profile (if one existed).
12. **State Jumper**: Trying to set an invalid order number.

## 3. Test Runner (Draft)
The `firestore.rules` will be tested using standard security rules logic to ensure all the above fail.
