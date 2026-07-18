/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'CARET'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export interface ParseError {
  message: string;
  position: number;
}

// AST Nodes
export type ASTNode =
  | { type: 'Number'; value: number }
  | { type: 'Identifier'; name: string }
  | { type: 'BinaryOp'; op: '+' | '-' | '*' | '/' | '^'; left: ASTNode; right: ASTNode }
  | { type: 'UnaryOp'; op: '+' | '-'; expr: ASTNode }
  | { type: 'FunctionCall'; name: 'sin' | 'cos' | 'tan' | 'sqrt'; arg: ASTNode };

export class MathParser {
  private tokens: Token[] = [];
  private current = 0;
  private input = '';

  constructor(input: string) {
    this.input = input;
    this.tokens = this.tokenize(input);
  }

  private tokenize(str: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < str.length) {
      const char = str[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers
      if (/\d/.test(char) || (char === '.' && i + 1 < str.length && /\d/.test(str[i + 1]))) {
        let numStr = '';
        const startPos = i;
        while (i < str.length && (/\d/.test(str[i]) || str[i] === '.')) {
          numStr += str[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: numStr, position: startPos });
        continue;
      }

      // Identifiers & standard variables
      if (/[a-zA-Z_]/.test(char)) {
        let idStr = '';
        const startPos = i;
        // Allow letters, numbers, and underscores in variable names (like theta_dot, r_dot, l0, m1)
        while (i < str.length && /[a-zA-Z0-9_]/.test(str[i])) {
          idStr += str[i];
          i++;
        }
        tokens.push({ type: 'IDENTIFIER', value: idStr, position: startPos });
        continue;
      }

      // Operators and Parentheses
      if (char === '+') {
        tokens.push({ type: 'PLUS', value: '+', position: i });
        i++;
        continue;
      }
      if (char === '-') {
        tokens.push({ type: 'MINUS', value: '-', position: i });
        i++;
        continue;
      }
      if (char === '*') {
        // Support ** for exponentiation
        if (i + 1 < str.length && str[i + 1] === '*') {
          tokens.push({ type: 'CARET', value: '**', position: i });
          i += 2;
        } else {
          tokens.push({ type: 'STAR', value: '*', position: i });
          i++;
        }
        continue;
      }
      if (char === '/') {
        tokens.push({ type: 'SLASH', value: '/', position: i });
        i++;
        continue;
      }
      if (char === '^') {
        tokens.push({ type: 'CARET', value: '^', position: i });
        i++;
        continue;
      }
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position: i });
        i++;
        continue;
      }
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position: i });
        i++;
        continue;
      }

      throw new Error(`Unexpected character '${char}' at index ${i}`);
    }

    tokens.push({ type: 'EOF', value: '', position: i });
    return tokens;
  }

  // Parser grammar entry
  public parse(): ASTNode {
    this.current = 0;
    const node = this.parseExpression();
    if (!this.isAtEnd()) {
      const remaining = this.peek();
      throw new Error(`Unexpected extra content starting at column ${remaining.position + 1}: "${remaining.value}"`);
    }
    return node;
  }

  // Expression -> Term ( ( "+" | "-" ) Term )*
  private parseExpression(): ASTNode {
    let left = this.parseTerm();

    while (this.match('PLUS', 'MINUS')) {
      const opToken = this.previous();
      const op = opToken.value as '+' | '-';
      const right = this.parseTerm();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  // Term -> Factor ( ( "*" | "/" ) Factor | IMPLICIT_MUL Factor )*
  private parseTerm(): ASTNode {
    let left = this.parseFactor();

    while (true) {
      if (this.match('STAR', 'SLASH')) {
        const opToken = this.previous();
        const op = opToken.value as '*' | '/';
        const right = this.parseFactor();
        left = { type: 'BinaryOp', op, left, right };
      } else if (this.canStartFactor()) {
        // Implicit multiplication
        const right = this.parseFactor();
        left = { type: 'BinaryOp', op: '*', left, right };
      } else {
        break;
      }
    }

    return left;
  }

  // Factor -> Base ( "^" Base )*
  private parseFactor(): ASTNode {
    let left = this.parseBase();

    while (this.match('CARET')) {
      const right = this.parseBase();
      left = { type: 'BinaryOp', op: '^', left, right };
    }

    return left;
  }

  // Base -> NUMBER | IDENTIFIER (with optional LPAREN for function calls) | "(" Expression ")" | UNARY_OP Base
  private parseBase(): ASTNode {
    if (this.match('MINUS', 'PLUS')) {
      const opToken = this.previous();
      const op = opToken.value as '+' | '-';
      const right = this.parseBase();
      return { type: 'UnaryOp', op, expr: right };
    }

    if (this.match('NUMBER')) {
      const token = this.previous();
      const val = parseFloat(token.value);
      if (isNaN(val)) {
        throw new Error(`Invalid number "${token.value}" at column ${token.position + 1}`);
      }
      return { type: 'Number', value: val };
    }

    if (this.match('IDENTIFIER')) {
      const token = this.previous();
      const name = token.value;

      // Check if it's a known math function
      if (['sin', 'cos', 'tan', 'sqrt'].includes(name)) {
        if (!this.match('LPAREN')) {
          throw new Error(`The mathematical function "${name}" must be followed by parentheses. Example: ${name}(theta) instead of ${name} ${this.peek().value || '...'}`);
        }
        const arg = this.parseExpression();
        this.consume('RPAREN', `Expected ")" after the argument of ${name}`);
        return { type: 'FunctionCall', name: name as 'sin' | 'cos' | 'tan' | 'sqrt', arg };
      }

      return { type: 'Identifier', name };
    }

    if (this.match('LPAREN')) {
      const startPos = this.previous().position;
      const expr = this.parseExpression();
      this.consume('RPAREN', `Mismatched parenthesis. Missing ")" for the opening "(" at column ${startPos + 1}`);
      return expr;
    }

    const token = this.peek();
    if (token.type === 'EOF') {
      throw new Error(`Unexpected end of formula where a value, variable, or parenthesis was expected.`);
    } else {
      throw new Error(`Unexpected token "${token.value}" at column ${token.position + 1}`);
    }
  }

  // Helper matching methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, errorMessage: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(errorMessage);
  }

  // Checks if the next token can start a factor (for implicit multiplication)
  private canStartFactor(): boolean {
    if (this.isAtEnd()) return false;
    const type = this.peek().type;
    return type === 'NUMBER' || type === 'IDENTIFIER' || type === 'LPAREN' || type === 'MINUS' || type === 'PLUS';
  }
}

// Global evaluator function
export function evaluateAST(node: ASTNode, variables: Record<string, number>): number {
  switch (node.type) {
    case 'Number':
      return node.value;

    case 'Identifier': {
      const name = node.name;
      if (name === 'pi' || name === 'PI') {
        return Math.PI;
      }
      if (name === 'e' || name === 'E') {
        return Math.E;
      }
      if (name in variables) {
        return variables[name];
      }
      throw new Error(`Unknown variable/constant: "${name}". Check spelling or use allowed variables.`);
    }

    case 'UnaryOp': {
      const val = evaluateAST(node.expr, variables);
      return node.op === '-' ? -val : val;
    }

    case 'BinaryOp': {
      const leftVal = evaluateAST(node.left, variables);
      // Lazy evaluation of rightVal to prevent potential issues (though not strictly needed here)
      const rightVal = evaluateAST(node.right, variables);
      switch (node.op) {
        case '+': return leftVal + rightVal;
        case '-': return leftVal - rightVal;
        case '*': return leftVal * rightVal;
        case '/':
          if (rightVal === 0) {
            // Avoid division by zero issues in checking
            return leftVal / 1e-15;
          }
          return leftVal / rightVal;
        case '^':
          return Math.pow(leftVal, rightVal);
        default:
          throw new Error(`Unsupported binary operator: ${(node as any).op}`);
      }
    }

    case 'FunctionCall': {
      const argVal = evaluateAST(node.arg, variables);
      switch (node.name) {
        case 'sin': return Math.sin(argVal);
        case 'cos': return Math.cos(argVal);
        case 'tan': return Math.tan(argVal);
        case 'sqrt':
          if (argVal < 0) {
            // Avoid NaN in complex-valued sqrt during random evaluation
            return Math.sqrt(Math.abs(argVal));
          }
          return Math.sqrt(argVal);
        default:
          throw new Error(`Unsupported function`);
      }
    }
  }
}

/**
 * Checks if two mathematical expressions are algebraically equivalent by
 * evaluating both on multiple randomly chosen positive vectors of the variables involved.
 */
export interface CheckResult {
  correct: boolean;
  error?: string;
  userAST?: ASTNode;
}

export function verifyExpression(
  userExpr: string,
  targetExpr: string,
  allowedVars: string[]
): CheckResult {
  if (!userExpr.trim()) {
    return { correct: false, error: 'Please enter a formula.' };
  }

  let userNode: ASTNode;
  let targetNode: ASTNode;

  // 1. Parse user expression
  try {
    const parser = new MathParser(userExpr);
    userNode = parser.parse();
  } catch (err: any) {
    return { correct: false, error: err.message || 'Syntax error in your formula.' };
  }

  // 2. Parse target expression (should always be successful since we write them, but verify)
  try {
    const parser = new MathParser(targetExpr);
    targetNode = parser.parse();
  } catch (err: any) {
    return { correct: false, error: `Internal Error: Code target formula is invalid: ${err.message}` };
  }

  // 3. Verify they evaluate to the same values on 10 random sets of variable values.
  // We use positive values to avoid poles/log problems, negative bases for power, or divisions by zero.
  try {
    // Collect variables used in user's parsed AST
    const userVars = getVariablesInAST(userNode);
    // Ensure all variables typed are in the allowed coordinates/constants vector
    const allAllowed = [...allowedVars, 'pi', 'PI', 'e', 'E'];
    for (const v of userVars) {
      if (!allAllowed.includes(v)) {
        return {
          correct: false,
          error: `Variable "${v}" is not one of the allowed coordinates, parameters, or constants for this system.`
        };
      }
    }

    // Run tests
    const testCount = 10;
    const tolerance = 1e-5;

    for (let test = 0; test < testCount; test++) {
      const testVars: Record<string, number> = {};
      
      // Seed values for allowed variables
      for (const v of allowedVars) {
        // Generate random numbers between 1.0 and 5.0 to stay far from zero and keep trigonometric arguments active
        testVars[v] = 1.0 + Math.random() * 4.0;
      }

      // Special angle-friendly evaluation if we have trigonometric functions:
      // Keep angles within typical ranges to protect cos/sin
      if (testVars['theta'] !== undefined) {
        testVars['theta'] = Math.random() * Math.PI; // 0 to 180 degrees
      }
      if (testVars['phi'] !== undefined) {
        testVars['phi'] = Math.random() * Math.PI;
      }

      const userVal = evaluateAST(userNode, testVars);
      const targetVal = evaluateAST(targetNode, testVars);

      if (isNaN(userVal)) {
        return { correct: false, error: 'Formula evaluated to NaN (Not a Number) for physical inputs. Check coordinates or square roots.' };
      }
      if (!isFinite(userVal)) {
        return { correct: false, error: 'Formula evaluated to Infinity. Check for division by zero.' };
      }

      const diff = Math.abs(userVal - targetVal);
      const relativeDiff = targetVal === 0 ? diff : diff / Math.abs(targetVal);

      if (relativeDiff > tolerance && diff > tolerance) {
        return { correct: false, userAST: userNode };
      }
    }

    return { correct: true, userAST: userNode };
  } catch (err: any) {
    return { correct: false, error: err.message || 'Error occurred while validating your formula.' };
  }
}

// Helpers
function getVariablesInAST(node: ASTNode): string[] {
  const vars = new Set<string>();

  function traverse(n: ASTNode) {
    if (n.type === 'Identifier') {
      if (!['pi', 'PI', 'e', 'E'].includes(n.name)) {
        vars.add(n.name);
      }
    } else if (n.type === 'BinaryOp') {
      traverse(n.left);
      traverse(n.right);
    } else if (n.type === 'UnaryOp') {
      traverse(n.expr);
    } else if (n.type === 'FunctionCall') {
      traverse(n.arg);
    }
  }

  traverse(node);
  return Array.from(vars);
}
