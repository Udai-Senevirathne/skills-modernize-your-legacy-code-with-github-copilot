/**
 * Unit Tests for Student Account Management System
 * Based on Test Plan documented in docs/TESTPLAN.md
 * 
 * This test suite covers all 52 test cases from the COBOL application test plan
 */

const { DataProgram, Operations, MainProgram } = require('./index');

describe('Student Account Management System Tests', () => {
    
    // ========================================
    // 1. System Initialization & Menu Display
    // ========================================
    describe('1. System Initialization & Menu Display', () => {
        
        test('TC-001: Verify system starts with correct initial balance', () => {
            const dataProgram = new DataProgram();
            const balance = dataProgram.read();
            
            expect(balance).toBe(1000.00);
            expect(dataProgram.getFormattedBalance()).toBe('1000.00');
        });
        
        test('TC-002: Verify DataProgram initializes with $1,000.00', () => {
            const dataProgram = new DataProgram();
            
            expect(dataProgram.storageBalance).toBe(1000.00);
        });
        
        test('TC-003: MainProgram initializes correctly', () => {
            const mainProgram = new MainProgram();
            
            expect(mainProgram.continueFlag).toBe(true);
            expect(mainProgram.dataProgram).toBeInstanceOf(DataProgram);
            expect(mainProgram.operations).toBeInstanceOf(Operations);
        });
    });
    
    // ========================================
    // 2. View Balance Functionality
    // ========================================
    describe('2. View Balance Functionality', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            mockReadline = {};
            operations = new Operations(dataProgram, mockReadline);
            
            // Capture console.log output
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-004: View initial balance', () => {
            operations.viewBalance();
            
            expect(consoleOutput).toContain('Current balance: 1000.00');
        });
        
        test('TC-005: View balance after credit', () => {
            dataProgram.write(1500.00);
            operations.viewBalance();
            
            expect(consoleOutput).toContain('Current balance: 1500.00');
        });
        
        test('TC-006: View balance after debit', () => {
            dataProgram.write(700.00);
            operations.viewBalance();
            
            expect(consoleOutput).toContain('Current balance: 700.00');
        });
        
        test('TC-007: View balance multiple times does not change balance', () => {
            operations.viewBalance();
            operations.viewBalance();
            operations.viewBalance();
            
            const balance = dataProgram.read();
            expect(balance).toBe(1000.00);
            expect(consoleOutput.length).toBe(3);
            expect(consoleOutput[0]).toBe('Current balance: 1000.00');
            expect(consoleOutput[1]).toBe('Current balance: 1000.00');
            expect(consoleOutput[2]).toBe('Current balance: 1000.00');
        });
    });
    
    // ========================================
    // 3. Credit Account Functionality
    // ========================================
    describe('3. Credit Account Functionality', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-008: Credit account with valid amount ($500.00)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('500.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1500.00);
            expect(consoleOutput).toContain('Amount credited. New balance: 1500.00');
        });
        
        test('TC-009: Credit account with small amount ($0.01)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('0.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.01);
            expect(consoleOutput).toContain('Amount credited. New balance: 1000.01');
        });
        
        test('TC-010: Credit account with large amount ($50,000.00)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('50000.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(51000.00);
            expect(consoleOutput).toContain('Amount credited. New balance: 51000.00');
        });
        
        test('TC-011: Multiple consecutive credits', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('200.00');
                    else if (calls === 1) callback('300.00');
                    else if (calls === 2) callback('500.00');
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            await operations.creditAccount();
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(2000.00);
        });
        
        test('TC-012: Credit near maximum balance', async () => {
            dataProgram.write(999000.00);
            mockReadline = {
                question: (prompt, callback) => callback('900.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(999900.00);
            expect(consoleOutput).toContain('Amount credited. New balance: 999900.00');
        });
        
        test('TC-013: Credit to exactly maximum balance', async () => {
            dataProgram.write(999999.00);
            mockReadline = {
                question: (prompt, callback) => callback('0.99')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(999999.99);
            expect(consoleOutput).toContain('Amount credited. New balance: 999999.99');
        });
        
        test('TC-014: Credit exceeding maximum balance should be rejected', async () => {
            dataProgram.write(999000.00);
            mockReadline = {
                question: (prompt, callback) => callback('2000.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            // Balance should remain unchanged
            expect(dataProgram.read()).toBe(999000.00);
            expect(consoleOutput.some(msg => msg.includes('exceed maximum balance'))).toBe(true);
        });
        
        test('TC-015: Credit with decimal precision ($123.45)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('123.45')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1123.45);
            expect(consoleOutput).toContain('Amount credited. New balance: 1123.45');
        });
        
        test('TC-016: Credit with two decimal places ($99.99)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('99.99')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1099.99);
            expect(consoleOutput).toContain('Amount credited. New balance: 1099.99');
        });
    });
    
    // ========================================
    // 4. Debit Account Functionality - Successful Transactions
    // ========================================
    describe('4. Debit Account Functionality - Successful Transactions', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-017: Debit account with sufficient funds ($300.00)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('300.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(700.00);
            expect(consoleOutput).toContain('Amount debited. New balance: 700.00');
        });
        
        test('TC-018: Debit exact balance amount ($1,000.00)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('1000.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleOutput).toContain('Amount debited. New balance: 0.00');
        });
        
        test('TC-019: Debit small amount ($0.01)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('0.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(999.99);
            expect(consoleOutput).toContain('Amount debited. New balance: 999.99');
        });
        
        test('TC-020: Multiple consecutive debits', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('100.00');
                    else if (calls === 1) callback('200.00');
                    else if (calls === 2) callback('300.00');
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            await operations.debitAccount();
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(400.00);
        });
        
        test('TC-021: Debit with decimal precision ($123.45)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('123.45')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(876.55);
            expect(consoleOutput).toContain('Amount debited. New balance: 876.55');
        });
        
        test('TC-022: Debit after credit operations', async () => {
            // First credit $500
            dataProgram.write(1500.00);
            
            mockReadline = {
                question: (prompt, callback) => callback('800.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(700.00);
            expect(consoleOutput).toContain('Amount debited. New balance: 700.00');
        });
    });
    
    // ========================================
    // 5. Debit Account Functionality - Insufficient Funds
    // ========================================
    describe('5. Debit Account Functionality - Insufficient Funds', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-023: Debit amount exceeding balance ($1,500.00)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('1500.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleOutput).toContain('Insufficient funds for this debit.');
        });
        
        test('TC-024: Debit amount slightly over balance ($1,000.01)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('1000.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleOutput).toContain('Insufficient funds for this debit.');
        });
        
        test('TC-025: Debit large amount exceeding balance ($999,999.99)', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('999999.99')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleOutput).toContain('Insufficient funds for this debit.');
        });
        
        test('TC-026: Debit from zero balance', async () => {
            dataProgram.write(0.00);
            mockReadline = {
                question: (prompt, callback) => callback('0.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(0.00); // Balance unchanged
            expect(consoleOutput).toContain('Insufficient funds for this debit.');
        });
        
        test('TC-027: Failed debit does not affect balance', async () => {
            dataProgram.write(500.00);
            mockReadline = {
                question: (prompt, callback) => callback('1000.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            // Balance should remain unchanged
            expect(dataProgram.read()).toBe(500.00);
            
            // Verify balance is still usable for other operations
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 500.00');
        });
    });
    
    // ========================================
    // 6. Business Rules Validation
    // ========================================
    describe('6. Business Rules Validation', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-028: Verify no overdraft facility', async () => {
            dataProgram.write(100.00);
            mockReadline = {
                question: (prompt, callback) => callback('100.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(100.00);
            expect(consoleOutput).toContain('Insufficient funds for this debit.');
        });
        
        test('TC-029: Verify initial account balance is $1,000.00', () => {
            const newDataProgram = new DataProgram();
            expect(newDataProgram.read()).toBe(1000.00);
        });
        
        test('TC-030: Verify balance persistence in session', async () => {
            // Credit $500.00
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('500.00');
                    else if (calls === 1) callback('300.00');
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(1500.00);
            
            // Debit $300.00
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(1200.00);
        });
        
        test('TC-031: Verify credit has no minimum limit', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('0.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.01);
            expect(consoleOutput.some(msg => msg.includes('credited'))).toBe(true);
        });
        
        test('TC-032: Verify balance maximum limit', async () => {
            dataProgram.write(999999.98);
            mockReadline = {
                question: (prompt, callback) => callback('0.01')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(999999.99);
            expect(consoleOutput).toContain('Amount credited. New balance: 999999.99');
        });
    });
    
    // ========================================
    // 7. Data Integrity & Validation
    // ========================================
    describe('7. Data Integrity & Validation', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            mockReadline = {};
            operations = new Operations(dataProgram, mockReadline);
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-033: Read operation does not modify balance', () => {
            for (let i = 0; i < 10; i++) {
                operations.viewBalance();
            }
            
            expect(dataProgram.read()).toBe(1000.00);
        });
        
        test('TC-034: Write operation updates storage', async () => {
            // Credit $100.00
            mockReadline.question = (prompt, callback) => {
                const calls = mockReadline.calls || 0;
                mockReadline.calls = calls + 1;
                
                if (calls === 0) callback('100.00');
                else if (calls === 1) callback('50.00');
            };
            
            await operations.creditAccount();
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1100.00');
            
            // Debit $50.00
            await operations.debitAccount();
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1050.00');
        });
        
        test('TC-035: Balance format maintains decimals', async () => {
            mockReadline.question = (prompt, callback) => callback('0.50');
            
            await operations.creditAccount();
            operations.viewBalance();
            
            expect(consoleOutput).toContain('Current balance: 1000.50');
        });
        
        test('TC-036: Arithmetic precision test', async () => {
            mockReadline.question = (prompt, callback) => {
                const calls = mockReadline.calls || 0;
                mockReadline.calls = calls + 1;
                
                if (calls === 0) callback('123.45');
                else if (calls === 1) callback('67.89');
            };
            
            await operations.creditAccount();
            await operations.debitAccount();
            
            const balance = dataProgram.read();
            expect(balance).toBeCloseTo(1055.56, 2);
            expect(balance.toFixed(2)).toBe('1055.56');
        });
    });
    
    // ========================================
    // 8. Menu Navigation & User Input
    // ========================================
    describe('8. Menu Navigation & User Input', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-037: Execute TOTAL operation', async () => {
            mockReadline = {};
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.execute('TOTAL');
            
            expect(consoleOutput).toContain('Current balance: 1000.00');
        });
        
        test('TC-038: Execute CREDIT operation', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('500.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.execute('CREDIT');
            
            expect(dataProgram.read()).toBe(1500.00);
        });
        
        test('TC-039: Execute DEBIT operation', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('300.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.execute('DEBIT');
            
            expect(dataProgram.read()).toBe(700.00);
        });
        
        test('TC-040: Invalid operation type', async () => {
            mockReadline = {};
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.execute('INVALID');
            
            expect(consoleOutput).toContain('Invalid operation type');
        });
        
        test('TC-041: Invalid credit input - negative amount', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('-100.00')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleOutput.some(msg => msg.includes('Invalid amount'))).toBe(true);
        });
        
        test('TC-042: Invalid credit input - non-numeric', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('abc')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleOutput.some(msg => msg.includes('Invalid amount'))).toBe(true);
        });
        
        test('TC-043: Invalid debit input - zero amount', async () => {
            mockReadline = {
                question: (prompt, callback) => callback('0')
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleOutput.some(msg => msg.includes('Invalid amount'))).toBe(true);
        });
        
        test('TC-044: Recovery after invalid input', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('invalid');
                    else if (calls === 1) callback('500.00');
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            // First attempt - invalid input
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(1000.00);
            
            // Second attempt - valid input
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(1500.00);
        });
    });
    
    // ========================================
    // 9. Exit & Termination
    // ========================================
    describe('9. Exit & Termination', () => {
        let mainProgram;
        
        test('TC-045: Normal exit sets continueFlag to false', async () => {
            mainProgram = new MainProgram();
            
            await mainProgram.processChoice('4');
            
            expect(mainProgram.continueFlag).toBe(false);
        });
        
        test('TC-046: Exit immediately after start', async () => {
            mainProgram = new MainProgram();
            expect(mainProgram.dataProgram.read()).toBe(1000.00);
            
            await mainProgram.processChoice('4');
            
            expect(mainProgram.continueFlag).toBe(false);
        });
        
        test('TC-047: Exit after operations', async () => {
            mainProgram = new MainProgram();
            
            // Perform some operations
            mainProgram.dataProgram.write(1500.00);
            expect(mainProgram.dataProgram.read()).toBe(1500.00);
            
            // Exit
            await mainProgram.processChoice('4');
            
            expect(mainProgram.continueFlag).toBe(false);
        });
    });
    
    // ========================================
    // 10. End-to-End Scenarios
    // ========================================
    describe('10. End-to-End Scenarios', () => {
        let dataProgram;
        let mockReadline;
        let operations;
        let consoleOutput;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
            consoleOutput = [];
            jest.spyOn(console, 'log').mockImplementation((msg) => {
                consoleOutput.push(msg);
            });
        });
        
        afterEach(() => {
            console.log.mockRestore();
        });
        
        test('TC-048: Complete user session', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('500.00'); // Credit
                    else if (calls === 1) callback('300.00'); // Debit
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            // Start - balance: $1,000.00
            expect(dataProgram.read()).toBe(1000.00);
            
            // View balance
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1000.00');
            
            // Credit $500.00
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(1500.00);
            
            // View balance
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1500.00');
            
            // Debit $300.00
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(1200.00);
            
            // View balance
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1200.00');
        });
        
        test('TC-049: Mixed successful and failed operations', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('200.00');   // Credit - success
                    else if (calls === 1) callback('2000.00'); // Debit - fail
                    else if (calls === 2) callback('500.00');  // Debit - success
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            // Credit $200.00
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(1200.00);
            
            // Attempt debit $2,000.00 - should fail
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(1200.00); // Unchanged
            
            // Debit $500.00 - should succeed
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(700.00);
            
            // Final balance check
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 700.00');
        });
        
        test('TC-050: Reduce balance to zero and attempt operations', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('1000.00'); // Debit to zero
                    else if (calls === 1) callback('0.01');   // Debit fail
                    else if (calls === 2) callback('100.00'); // Credit success
                    else if (calls === 3) callback('50.00');  // Debit success
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            // Debit $1,000.00 - balance to zero
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(0.00);
            
            // Attempt debit $0.01 - should fail
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleOutput).toContain('Insufficient funds for this debit.');
            
            // Credit $100.00
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(100.00);
            
            // Debit $50.00
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(50.00);
        });
        
        test('TC-051: Rapid consecutive operations', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('100');
                    else if (calls === 1) callback('50');
                    else if (calls === 2) callback('200');
                    else if (calls === 3) callback('100');
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            await operations.creditAccount(); // +100 = 1100
            await operations.debitAccount();  // -50 = 1050
            await operations.creditAccount(); // +200 = 1250
            await operations.debitAccount();  // -100 = 1150
            
            expect(dataProgram.read()).toBe(1150.00);
            
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1150.00');
        });
        
        test('TC-052: Student typical usage pattern', async () => {
            mockReadline = {
                question: (prompt, callback) => {
                    const calls = mockReadline.calls || 0;
                    mockReadline.calls = calls + 1;
                    
                    if (calls === 0) callback('50');  // Purchase
                    else if (calls === 1) callback('30');  // Purchase
                    else if (calls === 2) callback('200'); // Allowance
                    else if (calls === 3) callback('100'); // Purchase
                }
            };
            operations = new Operations(dataProgram, mockReadline);
            
            // View balance
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1000.00');
            
            // Debit $50 (purchase)
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(950.00);
            
            // Debit $30 (purchase)
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(920.00);
            
            // Credit $200 (allowance)
            await operations.creditAccount();
            expect(dataProgram.read()).toBe(1120.00);
            
            // Debit $100 (purchase)
            await operations.debitAccount();
            expect(dataProgram.read()).toBe(1020.00);
            
            // View final balance
            operations.viewBalance();
            expect(consoleOutput).toContain('Current balance: 1020.00');
        });
    });
    
    // ========================================
    // Additional Edge Cases & Validation
    // ========================================
    describe('Additional Edge Cases & Validation', () => {
        let dataProgram;
        
        beforeEach(() => {
            dataProgram = new DataProgram();
        });
        
        test('Balance formatting always shows 2 decimal places', () => {
            dataProgram.write(100);
            expect(dataProgram.getFormattedBalance()).toBe('100.00');
            
            dataProgram.write(99.9);
            expect(dataProgram.getFormattedBalance()).toBe('99.90');
            
            dataProgram.write(1234.567);
            expect(dataProgram.getFormattedBalance()).toBe('1234.57');
        });
        
        test('Read method returns exact stored balance', () => {
            dataProgram.write(1234.56);
            expect(dataProgram.read()).toBe(1234.56);
            
            dataProgram.write(0.01);
            expect(dataProgram.read()).toBe(0.01);
        });
        
        test('Write method updates storage correctly', () => {
            dataProgram.write(500.00);
            expect(dataProgram.storageBalance).toBe(500.00);
            
            dataProgram.write(0.00);
            expect(dataProgram.storageBalance).toBe(0.00);
        });
        
        test('Multiple DataProgram instances are independent', () => {
            const dp1 = new DataProgram();
            const dp2 = new DataProgram();
            
            dp1.write(500.00);
            dp2.write(1500.00);
            
            expect(dp1.read()).toBe(500.00);
            expect(dp2.read()).toBe(1500.00);
        });
    });
});
