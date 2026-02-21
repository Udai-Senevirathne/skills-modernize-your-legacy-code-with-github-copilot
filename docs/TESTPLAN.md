# Test Plan - Student Account Management System

## Overview
This test plan covers all business logic and functionality of the Student Account Management System. It is designed to validate business requirements with stakeholders and serve as a blueprint for creating automated unit and integration tests in the Node.js migration.

## Test Environment
- **System Under Test:** COBOL Account Management System
- **Initial Balance:** $1,000.00
- **Balance Format:** PIC 9(6)V99 (Max: $999,999.99)

---

## Test Cases

### 1. System Initialization & Menu Display

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-001 | Verify system starts with correct initial balance | None | 1. Start the application<br/>2. Select option 1 (View Balance) | System displays: "Current balance: 1000.00" | | | Initial balance must be $1,000.00 |
| TC-002 | Verify main menu displays all options | None | 1. Start the application<br/>2. Observe menu display | Menu displays:<br/>- Account Management System title<br/>- 1. View Balance<br/>- 2. Credit Account<br/>- 3. Debit Account<br/>- 4. Exit<br/>- Prompt for choice (1-4) | | | Menu should render correctly |
| TC-003 | Verify menu loop continues after each operation | None | 1. Start application<br/>2. Select any option (1-3)<br/>3. Complete the operation | Menu displays again after operation completes | | | System should not exit unless option 4 is selected |

---

### 2. View Balance Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-004 | View initial balance | Application just started | 1. Select option 1 (View Balance) | Display shows: "Current balance: 1000.00" | | | |
| TC-005 | View balance after credit | Balance credited with $500.00 | 1. Credit $500.00<br/>2. Select option 1 (View Balance) | Display shows: "Current balance: 1500.00" | | | Balance should reflect previous transaction |
| TC-006 | View balance after debit | Balance debited with $300.00 | 1. Debit $300.00<br/>2. Select option 1 (View Balance) | Balance reflects debit correctly | | | Balance should decrease by debit amount |
| TC-007 | View balance multiple times | None | 1. Select option 1 three times consecutively | All three displays show same balance value | | | Balance should not change from viewing |

---

### 3. Credit Account Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-008 | Credit account with valid amount | Balance = $1,000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter amount: 500.00 | System displays:<br/>- "Amount credited. New balance: 1500.00"<br/>- Balance increases to $1,500.00 | | | Standard credit operation |
| TC-009 | Credit account with small amount | Balance = $1,000.00 | 1. Select option 2<br/>2. Enter amount: 0.01 | System displays:<br/>- "Amount credited. New balance: 1000.01" | | | System should accept minimum amounts |
| TC-010 | Credit account with large amount | Balance = $1,000.00 | 1. Select option 2<br/>2. Enter amount: 50000.00 | System displays:<br/>- "Amount credited. New balance: 51000.00" | | | System should handle large credits |
| TC-011 | Multiple consecutive credits | Balance = $1,000.00 | 1. Credit $200.00<br/>2. Credit $300.00<br/>3. Credit $500.00<br/>4. View balance | Final balance = $2,000.00 | | | Balance should accumulate all credits |
| TC-012 | Credit near maximum balance | Balance = $999,000.00 | 1. Select option 2<br/>2. Enter amount: 900.00 | System displays:<br/>- "Amount credited. New balance: 999900.00" | | | Should accept credit within limit |
| TC-013 | Credit to exactly maximum balance | Balance = $999,999.00 | 1. Select option 2<br/>2. Enter amount: 0.99 | System displays:<br/>- "Amount credited. New balance: 999999.99" | | | Should reach maximum balance |
| TC-014 | Credit exceeding maximum balance | Balance = $999,000.00 | 1. Select option 2<br/>2. Enter amount: 2000.00 | System behavior per PIC limitation (overflow or error) | | | Test boundary condition - may cause overflow |
| TC-015 | Credit with decimal precision | Balance = $1,000.00 | 1. Select option 2<br/>2. Enter amount: 123.45 | System displays:<br/>- "Amount credited. New balance: 1123.45" | | | Verify decimal handling |
| TC-016 | Credit with two decimal places | Balance = $1,000.00 | 1. Select option 2<br/>2. Enter amount: 99.99 | System displays:<br/>- "Amount credited. New balance: 1099.99" | | | Verify precision is maintained |

---

### 4. Debit Account Functionality - Successful Transactions

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-017 | Debit account with sufficient funds | Balance = $1,000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter amount: 300.00 | System displays:<br/>- "Amount debited. New balance: 700.00" | | | Standard debit operation |
| TC-018 | Debit exact balance amount | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1000.00 | System displays:<br/>- "Amount debited. New balance: 0.00" | | | Should allow debit of entire balance |
| TC-019 | Debit small amount | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 0.01 | System displays:<br/>- "Amount debited. New balance: 999.99" | | | Should handle minimum debit |
| TC-020 | Multiple consecutive debits | Balance = $1,000.00 | 1. Debit $100.00<br/>2. Debit $200.00<br/>3. Debit $300.00<br/>4. View balance | Final balance = $400.00 | | | Balance should decrease with each debit |
| TC-021 | Debit with decimal precision | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 123.45 | System displays:<br/>- "Amount debited. New balance: 876.55" | | | Verify decimal handling in debit |
| TC-022 | Debit after credit operations | Balance = $1,000.00 | 1. Credit $500.00 (balance: $1,500.00)<br/>2. Debit $800.00 | System displays:<br/>- "Amount debited. New balance: 700.00" | | | Mixed operations should work correctly |

---

### 5. Debit Account Functionality - Insufficient Funds

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-023 | Debit amount exceeding balance | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1500.00 | System displays:<br/>- "Insufficient funds for this debit."<br/>- Balance remains $1,000.00 | | | Critical: No overdraft allowed |
| TC-024 | Debit amount slightly over balance | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1000.01 | System displays:<br/>- "Insufficient funds for this debit."<br/>- Balance remains $1,000.00 | | | Boundary test - even $0.01 over should fail |
| TC-025 | Debit large amount exceeding balance | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 999999.99 | System displays:<br/>- "Insufficient funds for this debit."<br/>- Balance remains $1,000.00 | | | Should reject any amount over balance |
| TC-026 | Debit from zero balance | Balance = $0.00 | 1. Debit entire balance to $0.00<br/>2. Select option 3<br/>3. Enter amount: 0.01 | System displays:<br/>- "Insufficient funds for this debit."<br/>- Balance remains $0.00 | | | No overdraft from zero balance |
| TC-027 | Failed debit does not affect balance | Balance = $500.00 | 1. Attempt debit of $1,000.00<br/>2. View balance<br/>3. Attempt another operation | Balance remains $500.00 and is usable for other operations | | | Failed transaction should not corrupt balance |

---

### 6. Business Rules Validation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-028 | Verify no overdraft facility | Balance = $100.00 | 1. Attempt to debit $100.01 | Transaction rejected with insufficient funds message | | | Critical business rule |
| TC-029 | Verify initial account balance | New account | 1. Start application<br/>2. View balance | Balance is exactly $1,000.00 | | | All student accounts start with $1,000 |
| TC-030 | Verify balance persistence in session | Balance = $1,000.00 | 1. Credit $500.00<br/>2. View balance<br/>3. Debit $300.00<br/>4. View balance | Balance after step 2: $1,500.00<br/>Balance after step 4: $1,200.00 | | | Balance persists across operations |
| TC-031 | Verify credit has no minimum limit | Balance = $1,000.00 | 1. Credit $0.01 | Credit accepted | | | Any positive amount should be accepted |
| TC-032 | Verify balance maximum limit | Balance = $999,999.98 | 1. Credit $0.01<br/>2. View balance | Balance = $999,999.99 (maximum) | | | Test maximum balance constraint |

---

### 7. Data Integrity & Validation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-033 | Read operation does not modify balance | Balance = $1,000.00 | 1. View balance 10 times | Balance remains $1,000.00 after all views | | | Read-only operations must not change data |
| TC-034 | Write operation updates storage | Balance = $1,000.00 | 1. Credit $100.00<br/>2. View balance<br/>3. Debit $50.00<br/>4. View balance | Step 2 shows $1,100.00<br/>Step 4 shows $1,050.00 | | | Updates must persist to storage |
| TC-035 | Balance format maintains decimals | Balance = $1,000.00 | 1. Credit $0.50<br/>2. View balance | Display shows: "Current balance: 1000.50" | | | Two decimal places maintained |
| TC-036 | Arithmetic precision test | Balance = $1,000.00 | 1. Credit $123.45<br/>2. Debit $67.89<br/>3. View balance | Balance = $1,055.56 | | | Verify calculation accuracy |

---

### 8. Menu Navigation & User Input

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-037 | Select menu option 1 | Application running | 1. Enter choice: 1 | View Balance operation executes | | | |
| TC-038 | Select menu option 2 | Application running | 1. Enter choice: 2 | Credit Account operation executes | | | |
| TC-039 | Select menu option 3 | Application running | 1. Enter choice: 3 | Debit Account operation executes | | | |
| TC-040 | Select menu option 4 | Application running | 1. Enter choice: 4 | System displays "Exiting the program. Goodbye!" and terminates | | | |
| TC-041 | Invalid menu choice (out of range) | Application running | 1. Enter choice: 5 | System displays "Invalid choice, please select 1-4."<br/>Menu displays again | | | |
| TC-042 | Invalid menu choice (zero) | Application running | 1. Enter choice: 0 | System displays "Invalid choice, please select 1-4."<br/>Menu displays again | | | |
| TC-043 | Invalid menu choice (large number) | Application running | 1. Enter choice: 99 | System displays "Invalid choice, please select 1-4."<br/>Menu displays again | | | |
| TC-044 | Menu recovery after invalid input | Application running | 1. Enter invalid choice: 9<br/>2. Enter valid choice: 1 | Step 1: Error message displayed<br/>Step 2: View Balance executes normally | | | System should recover from errors |

---

### 9. Exit & Termination

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-045 | Normal exit from menu | Application running | 1. Select option 4 (Exit) | System displays "Exiting the program. Goodbye!"<br/>Application terminates cleanly | | | |
| TC-046 | Exit without performing operations | Application just started | 1. Select option 4 | Application exits successfully | | | Should allow immediate exit |
| TC-047 | Exit after multiple operations | Balance modified | 1. Perform several operations<br/>2. Select option 4 | Application exits successfully | | | Exit should work regardless of operations |

---

### 10. End-to-End Scenarios

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-048 | Complete user session | None | 1. Start application (balance: $1,000.00)<br/>2. View balance<br/>3. Credit $500.00<br/>4. View balance<br/>5. Debit $300.00<br/>6. View balance<br/>7. Exit | Step 2: $1,000.00<br/>Step 4: $1,500.00<br/>Step 6: $1,200.00<br/>Step 7: Clean exit | | | Full workflow test |
| TC-049 | Mixed successful and failed operations | Balance = $1,000.00 | 1. Credit $200.00 (success: $1,200.00)<br/>2. Debit $2,000.00 (fail: insufficient funds)<br/>3. Debit $500.00 (success: $700.00)<br/>4. View balance | Final balance: $700.00 | | | Failed operations should not affect subsequent operations |
| TC-050 | Reduce balance to zero and attempt operations | Balance = $1,000.00 | 1. Debit $1,000.00 (balance: $0.00)<br/>2. Attempt debit $0.01 (fail)<br/>3. Credit $100.00 (success: $100.00)<br/>4. Debit $50.00 (success: $50.00) | All operations behave as expected with zero balance | | | Test zero balance scenarios |
| TC-051 | Rapid consecutive operations | Balance = $1,000.00 | 1. Credit $100<br/>2. Debit $50<br/>3. Credit $200<br/>4. Debit $100<br/>5. View balance | Final balance: $1,150.00 | | | Test operation sequencing |
| TC-052 | Student typical usage pattern | Balance = $1,000.00 | 1. View balance<br/>2. Debit $50 (purchase)<br/>3. Debit $30 (purchase)<br/>4. Credit $200 (allowance)<br/>5. Debit $100 (purchase)<br/>6. View balance | Final balance: $1,020.00 | | | Simulate realistic student account usage |

---

## Test Execution Guidelines

### For Manual Testing:
1. **Preparation:** Compile and start the COBOL application fresh for each test case where initial state matters
2. **Execution:** Follow test steps exactly as written
3. **Recording:** Document actual results and any deviations from expected results
4. **Status:** Mark as Pass if actual matches expected, Fail otherwise

### For Automated Testing (Node.js Migration):
1. Each test case should be converted to a unit or integration test
2. Pre-conditions should be set up in test fixtures or beforeEach hooks
3. Test steps should be implemented as test code
4. Expected results should be assertions
5. Use test frameworks like Jest or Mocha

---

## Test Coverage Summary

| Category | Test Cases | Focus Area |
|----------|------------|------------|
| System Initialization | TC-001 to TC-003 | Startup and menu display |
| View Balance | TC-004 to TC-007 | Read operations |
| Credit Account | TC-008 to TC-016 | Deposit functionality |
| Debit Account (Success) | TC-017 to TC-022 | Withdrawal with funds |
| Debit Account (Failure) | TC-023 to TC-027 | Insufficient funds handling |
| Business Rules | TC-028 to TC-032 | Business logic validation |
| Data Integrity | TC-033 to TC-036 | Data persistence and accuracy |
| Menu Navigation | TC-037 to TC-044 | User interface |
| Exit/Termination | TC-045 to TC-047 | Application shutdown |
| End-to-End | TC-048 to TC-052 | Complete workflows |

**Total Test Cases:** 52

---

## Critical Test Cases for Stakeholder Review

The following test cases are critical for business validation:

- **TC-001:** Initial balance verification ($1,000.00)
- **TC-023:** No overdraft protection
- **TC-024:** Boundary test for insufficient funds
- **TC-028:** Verify no overdraft facility (business rule)
- **TC-029:** Verify initial account balance rule
- **TC-048:** Complete end-to-end workflow

---

## Notes for Node.js Migration

1. **Data Types:** Convert COBOL PIC 9(6)V99 to JavaScript Number or Decimal.js for precision
2. **Operation Codes:** Map COBOL operation strings ('TOTAL ', 'CREDIT', 'DEBIT ') to cleaner method names
3. **Error Handling:** Implement proper exception handling for invalid inputs
4. **Validation:** Add input validation that COBOL may not explicitly enforce
5. **Async Operations:** Consider async/await patterns if adding database persistence
6. **Test Framework:** Recommend Jest with test coverage requirements of 90%+

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Owner | | | |
| QA Lead | | | |
| Development Lead | | | |
| Product Manager | | | |
