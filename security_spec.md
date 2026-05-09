# Security Specification for MUBUSLINK AI

## Data Invariants
1. Users can only read and write their own profile records.
2. Global stats can only be updated by the server (admin) but read by any authenticated user for the dashboard.
3. Stripe-related collections are strictly restricted to the owner of the customer record.
4. Maintenance logs are for admin eyes only.
5. Mail documents are used as a queue and should not be readable by regular users.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing**: User A attempts to write to `/users/userB`.
2. **Privilege Escalation**: User attempts to set `role: 'admin'` in their own user profile.
3. **Ghost Field Injection**: User attempts to update a profile with a field `isVerified: true` that doesn't exist in schema.
4. **ID Poisoning**: User attempts to create a document with a 2KB junk string as an ID.
5. **State Shortcutting**: User attempts to update a subscription status directly without server verification.
6. **Orphaned Writes**: User attempts to create a workspace member mapping for a non-existent user.
7. **Resource Exhaustion**: User attempts to write a 1MB string into a "name" field.
8. **PII Leak**: Authenticated User A attempts to 'get' User B's private customer data.
9. **Relational Bypass**: User attempts to read a Website project where they are not a member of the parent Workspace.
10. **Terminal State Lock**: User attempts to modify a 'completed' status translation.
11. **Type Mismatch**: User attempts to write an object into a field expected to be a string.
12. **Blanket Query Scraping**: User attempts to list all users via `collection('users').get()`.

## Test Runner Logic
The `firestore.rules.test.ts` will verify that all the above payloads return PERMISSION_DENIED.
