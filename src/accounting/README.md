# Student Account Management System - Node.js Application

## Overview
This is a Node.js conversion of the legacy COBOL account management system. The application maintains all original business logic, data integrity, and menu options from the COBOL version.

## Architecture

The application follows the same three-layer architecture as the original COBOL system:

### DataProgram Class
- **Purpose:** Data persistence layer (equivalent to `data.cob`)
- **Responsibilities:**
  - Store and manage account balance
  - Provide read/write operations
  - Maintain initial balance of $1,000.00

### Operations Class
- **Purpose:** Business logic layer (equivalent to `operations.cob`)
- **Responsibilities:**
  - View balance (TOTAL operation)
  - Credit account (add funds)
  - Debit account (withdraw funds with insufficient funds check)
  - Validate all transactions

### MainProgram Class
- **Purpose:** User interface and control flow (equivalent to `main.cob`)
- **Responsibilities:**
  - Display interactive menu
  - Process user input
  - Coordinate operations
  - Control program loop

## Business Rules Preserved

All original COBOL business rules are maintained:

1. **Initial Balance:** $1,000.00 per student account
2. **No Overdraft:** Debit transactions are rejected if balance is insufficient
3. **Maximum Balance:** $999,999.99 (enforced on credit operations)
4. **Decimal Precision:** All amounts use 2 decimal places
5. **Balance Persistence:** Balance is maintained throughout the session
6. **Transaction Validation:** Failed transactions do not modify the balance

## Installation

```bash
# Navigate to the accounting directory
cd src/accounting

# Install dependencies
npm install
```

## Running the Application

### Option 1: Command Line
```bash
npm start
```

### Option 2: VS Code Debugger
1. Open VS Code
2. Press F5 or go to Run > Start Debugging
3. Select "Run Account Management System"

## Menu Options

The application provides the same menu as the COBOL version:

```
--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4):
```

### 1. View Balance
- Displays current account balance
- Does not modify the balance
- Format: "Current balance: XXXX.XX"

### 2. Credit Account
- Prompts for amount to credit (deposit)
- Adds amount to current balance
- Validates maximum balance limit
- Displays updated balance

### 3. Debit Account
- Prompts for amount to debit (withdraw)
- Checks for sufficient funds
- If sufficient: subtracts amount and displays new balance
- If insufficient: displays "Insufficient funds for this debit." and balance unchanged

### 4. Exit
- Closes the application gracefully
- Displays goodbye message

## Usage Example

```
Welcome to the Student Account Management System

--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 1
Current balance: 1000.00

Enter your choice (1-4): 2
Enter credit amount: 500.00
Amount credited. New balance: 1500.00

Enter your choice (1-4): 3
Enter debit amount: 2000.00
Insufficient funds for this debit.

Enter your choice (1-4): 3
Enter debit amount: 300.00
Amount debited. New balance: 1200.00

Enter your choice (1-4): 4
Exiting the program. Goodbye!
```

## Testing

Run the test suite (once tests are implemented):

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Structure

```javascript
// Data Layer
class DataProgram {
    read()      // Get current balance
    write()     // Update balance
}

// Business Logic Layer
class Operations {
    viewBalance()      // Display balance
    creditAccount()    // Add funds
    debitAccount()     // Withdraw funds
    execute()          // Route operations
}

// UI Layer
class MainProgram {
    displayMenu()      // Show menu options
    processChoice()    // Handle user selection
    run()             // Main program loop
}
```

## Key Differences from COBOL

1. **Async/Await:** Uses Promises for asynchronous user input
2. **Classes:** Object-oriented design vs procedural COBOL
3. **Error Handling:** More robust input validation
4. **Readline:** Node.js readline module for console input
5. **Decimal Handling:** JavaScript Number with `.toFixed(2)` for precision

## Data Flow

The application follows the same data flow as documented in [docs/README.md](../../docs/README.md):

```
User Input → MainProgram → Operations → DataProgram → Storage
                ↓               ↓           ↓
            Menu Loop    Business Logic   Read/Write
```

## Migration Notes

This Node.js version maintains 100% functional equivalence with the original COBOL application:

- ✅ Same initial balance ($1,000.00)
- ✅ Same menu structure and options
- ✅ Same business rules (no overdraft, balance limits)
- ✅ Same validation logic
- ✅ Same user experience
- ✅ Same data flow architecture

## Future Enhancements

Potential improvements beyond the COBOL baseline:

1. **Database Integration:** Replace in-memory storage with persistent database
2. **Multi-Account Support:** Handle multiple student accounts
3. **Transaction History:** Log all transactions with timestamps
4. **Authentication:** Add user login/security
5. **Web Interface:** Create REST API or web frontend
6. **Input Validation:** Enhanced error handling and input sanitization
7. **Unit Tests:** Comprehensive test coverage using Jest

## Dependencies

- **Node.js:** >= 14.0.0
- **readline:** Built-in (no installation needed)
- **jest:** ^29.7.0 (dev dependency for testing)

## License

MIT
