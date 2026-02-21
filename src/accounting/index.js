/**
 * Student Account Management System
 * Converted from COBOL legacy application
 * 
 * This application maintains the original business logic:
 * - Initial balance: $1,000.00
 * - No overdraft protection
 * - Credit/Debit operations with validation
 * - Balance inquiry
 */

const readline = require('readline');

/**
 * DataProgram - Data Persistence Layer
 * Equivalent to data.cob
 * Manages the storage and retrieval of account balance
 */
class DataProgram {
    constructor() {
        // Initialize storage balance to $1,000.00 (initial student account balance)
        this.storageBalance = 1000.00;
    }

    /**
     * Read operation - Returns current stored balance
     * @returns {number} Current balance
     */
    read() {
        return this.storageBalance;
    }

    /**
     * Write operation - Updates the stored balance
     * @param {number} balance - New balance to store
     */
    write(balance) {
        this.storageBalance = balance;
    }

    /**
     * Get formatted balance with 2 decimal places
     * @returns {string} Formatted balance
     */
    getFormattedBalance() {
        return this.storageBalance.toFixed(2);
    }
}

/**
 * Operations - Business Logic Layer
 * Equivalent to operations.cob
 * Implements core business operations: view balance, credit, and debit
 */
class Operations {
    constructor(dataProgram, readline) {
        this.dataProgram = dataProgram;
        this.readline = readline;
    }

    /**
     * View Balance Operation (TOTAL)
     * Displays current account balance
     */
    viewBalance() {
        const balance = this.dataProgram.read();
        console.log(`Current balance: ${balance.toFixed(2)}`);
    }

    /**
     * Credit Account Operation
     * Adds amount to the account balance
     * @returns {Promise<void>}
     */
    async creditAccount() {
        return new Promise((resolve) => {
            this.readline.question('Enter credit amount: ', (input) => {
                const amount = parseFloat(input);
                
                if (isNaN(amount) || amount <= 0) {
                    console.log('Invalid amount. Please enter a positive number.');
                    resolve();
                    return;
                }

                // Read current balance
                const currentBalance = this.dataProgram.read();
                
                // Add credit amount
                const newBalance = currentBalance + amount;
                
                // Check if new balance exceeds maximum (999,999.99)
                if (newBalance > 999999.99) {
                    console.log('Error: Credit would exceed maximum balance of $999,999.99');
                    resolve();
                    return;
                }
                
                // Write updated balance
                this.dataProgram.write(newBalance);
                
                console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
                resolve();
            });
        });
    }

    /**
     * Debit Account Operation
     * Subtracts amount from account balance with insufficient funds check
     * @returns {Promise<void>}
     */
    async debitAccount() {
        return new Promise((resolve) => {
            this.readline.question('Enter debit amount: ', (input) => {
                const amount = parseFloat(input);
                
                if (isNaN(amount) || amount <= 0) {
                    console.log('Invalid amount. Please enter a positive number.');
                    resolve();
                    return;
                }

                // Read current balance
                const currentBalance = this.dataProgram.read();
                
                // Check for sufficient funds (no overdraft protection)
                if (currentBalance >= amount) {
                    // Subtract debit amount
                    const newBalance = currentBalance - amount;
                    
                    // Write updated balance
                    this.dataProgram.write(newBalance);
                    
                    console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
                } else {
                    // Insufficient funds - reject transaction
                    console.log('Insufficient funds for this debit.');
                }
                
                resolve();
            });
        });
    }

    /**
     * Execute operation based on type
     * @param {string} operationType - Type of operation (TOTAL, CREDIT, DEBIT)
     * @returns {Promise<void>}
     */
    async execute(operationType) {
        switch (operationType) {
            case 'TOTAL':
                this.viewBalance();
                return Promise.resolve();
            case 'CREDIT':
                return this.creditAccount();
            case 'DEBIT':
                return this.debitAccount();
            default:
                console.log('Invalid operation type');
                return Promise.resolve();
        }
    }
}

/**
 * MainProgram - User Interface and Menu Controller
 * Equivalent to main.cob
 * Manages the main program loop and user interaction
 */
class MainProgram {
    constructor() {
        this.continueFlag = true;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.dataProgram = new DataProgram();
        this.operations = new Operations(this.dataProgram, this.rl);
    }

    /**
     * Display the main menu
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Process user menu choice
     * @param {string} choice - User's menu selection
     * @returns {Promise<void>}
     */
    async processChoice(choice) {
        const userChoice = parseInt(choice);

        switch (userChoice) {
            case 1:
                await this.operations.execute('TOTAL');
                break;
            case 2:
                await this.operations.execute('CREDIT');
                break;
            case 3:
                await this.operations.execute('DEBIT');
                break;
            case 4:
                this.continueFlag = false;
                break;
            default:
                console.log('Invalid choice, please select 1-4.');
                break;
        }
    }

    /**
     * Main program loop
     * Displays menu and processes user choices until exit
     */
    async run() {
        console.log('\nWelcome to the Student Account Management System\n');

        while (this.continueFlag) {
            this.displayMenu();
            
            const choice = await new Promise((resolve) => {
                this.rl.question('Enter your choice (1-4): ', resolve);
            });

            await this.processChoice(choice);
            console.log(); // Add blank line for readability
        }

        console.log('Exiting the program. Goodbye!');
        this.rl.close();
    }
}

/**
 * Application Entry Point
 */
if (require.main === module) {
    const app = new MainProgram();
    app.run().catch((error) => {
        console.error('An error occurred:', error);
        process.exit(1);
    });
}

// Export for testing
module.exports = {
    DataProgram,
    Operations,
    MainProgram
};
