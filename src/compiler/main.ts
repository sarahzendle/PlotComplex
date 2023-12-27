import * as math from 'mathjs';
import { Vec2, complexAdd, complexArgument, complexConjugate, complexCos, complexCosh, complexDiv, complexExp, complexIm, complexLog, complexMagnitude, complexMul, complexNegate, complexPow, complexRe, complexSin, complexSinh, complexSqrt, complexSub, complexTan, complexTanh, toPolar } from './utils';

export function nodeToGLSL(node: math.MathNode, sheet: number): string {
  if (math.isOperatorNode(node)) {
    const operands = node.args.map((arg) => nodeToGLSL(arg, sheet));

    if (operands.length === 1) {
      const [a] = operands;

      switch (node.op) {
        case '-':
          return `complexNegate(${a})`;
        default:
          throw new Error(`Unsupported operator: '${node.op}'`);
      }
    }

    if (operands.length === 2) {
      const [a, b] = operands;

      switch (node.op) {
        case '+':
          return `complexAdd(${a}, ${b})`;
        case '-':
          return `complexSub(${a}, ${b})`;
        case '*':
          return `complexMul(${a}, ${b})`;
        case '/':
          return `complexDiv(${a}, ${b})`;
        case '^':
          return `complexPow(${a}, ${b})`;
        default:
          throw new Error(`Unsupported operator: '${node.op}'`);
      }
    }

    throw new Error('How did we get here? Operand with 0 arguments.');
  } else if (math.isConstantNode(node)) {
    // should toPolar be called here?
    return `vec2(${node.value}, 0.0)`;
  } else if (math.isSymbolNode(node)) {
    if (node.name === 'i') {
      // should toPolar be called here?
      return 'vec2(0.0, 1.0)';
    }

    if (node.name === 'z') {
      return `toPolar(vec2(position.x, position.y))`;
    }

    if (node.name === 'x') {
      return `toPolar(vec2(position.x, 0.0))`;
    }

    if (node.name === 'y') {
      return `toPolar(vec2(0.0, position.y))`;
    }

  } else if (math.isFunctionNode(node)) {
    const fnName = node.fn.name;
    const args = node.args.map((arg) => nodeToGLSL(arg, sheet));

    if (args.length === 1) {
      const [a] = args;

      switch (fnName) {
        case 'exp':
          return `complexExp(${a}, ${sheet.toFixed(1)})`;
        case 'sin':
          return `complexSin(${a}, ${sheet.toFixed(1)})`;
        case 'cos':
          return `complexCos(${a}, ${sheet.toFixed(1)})`;
        case 'tan':
          return `complexTan(${a}, ${sheet.toFixed(1)})`;
        case 'sinh':
          return `complexSinh(${a}, ${sheet.toFixed(1)})`;
        case 'cosh':
          return `complexCosh(${a}, ${sheet.toFixed(1)})`;
        case 'tanh':
          return `complexTanh(${a}, ${sheet.toFixed(1)})`;
        case 'sqrt':
          return `complexSqrt(${a}, ${sheet.toFixed(1)})`;
        case 'conj':
          return `complexConjugate(${a}, ${sheet.toFixed(1)})`;
        case 'mag':
          return `complexMagnitude(${a}, ${sheet.toFixed(1)})`;
        case 'arg':
          return `complexArgument(${a}, ${sheet.toFixed(1)})`;
        case 'log':
          return `complexLog(${a}, ${sheet.toFixed(1)})`;
        case 're':
          return `complexRe(${a}, ${sheet.toFixed(1)})`;
        case 'im':
          return `complexIm(${a}, ${sheet.toFixed(1)})`;
        default:
          throw new Error(`Function '${fnName}' is not supported`);
      }
    }

    throw new Error(
      `Function '${fnName}' is not supported or doesn't take those amount of arguments`,
    );
  } else if (math.isParenthesisNode(node)) {
    return `(${nodeToGLSL(node.content, sheet)})`;
  }

  throw new Error(`Unsupported node type: ${node.type}`);
}

export function nodeToJS(node: math.MathNode, sheet: number): (z: Vec2) => Vec2 {
  if (math.isOperatorNode(node)) {
    const operands = node.args.map((arg) => nodeToJS(arg, sheet));

    if (operands.length === 1) {
      const [a] = operands;

      switch (node.op) {
        case '-':
          return z => complexNegate(z, sheet);
        default:
          throw new Error(`Unsupported operator: '${node.op}'`);
      }
    }

    if (operands.length === 2) {
      const [a, b] = operands;

      switch (node.op) {
        case '+':
          return (z) => complexAdd(a(z), b(z), sheet);
        case '-':
          // return `complexSub(${a}, ${b})`;
          return (z) => complexSub(a(z), b(z), sheet);
        case '*':
          // return `complexMul(${a}, ${b})`;
          return (z) => complexMul(a(z), b(z), sheet);
        case '/':
          // return `complexDiv(${a}, ${b})`;
          return (z) => complexDiv(a(z), b(z), sheet);
        case '^':
          // return `complexPow(${a}, ${b})`;
          return (z) => complexPow(a(z), b(z), sheet);
        default:
          throw new Error(`Unsupported operator: '${node.op}'`);
      }
    }

    throw new Error('How did we get here? Operand with 0 arguments.');
  } else if (math.isConstantNode(node)) {
    // should toPolar be called here?
    return () => ({ x: node.value, y: 0 });
  } else if (math.isSymbolNode(node)) {
    if (node.name === 'i') {
      // should toPolar be called here?
      return () => ({ x: 0, y: 1 });
    }

    if (node.name === 'z') {
      return z => toPolar(z)
    }

    if (node.name === 'x') {
      return z => toPolar({ x: z.x, y: 0 });
    }

    if (node.name === 'y') {
      return z => toPolar({ x: 0, y: z.y });
    }

  } else if (math.isFunctionNode(node)) {
    const fnName = node.fn.name;
    const args = node.args.map((arg) => nodeToJS(arg, sheet));

    if (args.length === 1) {
      const [a] = args;

      switch (fnName) {
        case 'exp':
          // return `complexExp(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexExp(a(z), sheet);
        case 'sin':
          // return `complexSin(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexSin(a(z), sheet);
        case 'cos':
          // return `complexCos(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexCos(a(z), sheet);
        case 'tan':
          // return `complexTan(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexTan(a(z), sheet);
        case 'sinh':
          // return `complexSinh(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexSinh(a(z), sheet);
        case 'cosh':
          // return `complexCosh(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexCosh(a(z), sheet);
        case 'tanh':
          // return `complexTanh(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexTanh(a(z), sheet);
        case 'sqrt':
          // return `complexSqrt(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexSqrt(a(z), sheet);
        case 'conj':
          // return `complexConjugate(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexConjugate(a(z), sheet);
        case 'mag':
          // return `complexMagnitude(${a}, ${sheet.toFixed(1)})`;
          return (z) => toPolar({x: complexMagnitude(a(z), sheet), y: 0});
        case 'arg':
          // return `complexArgument(${a}, ${sheet.toFixed(1)})`;
          return (z) => toPolar({x: complexArgument(a(z), sheet), y: 0});
        case 'log':
          // return `complexLog(${a}, ${sheet.toFixed(1)})`;
          return (z) => complexLog(a(z), sheet);
        case 're':
          // return `complexRe(${a}, ${sheet.toFixed(1)})`;
          return (z) => toPolar({x: complexRe(a(z), sheet), y: 0});
        case 'im':
          // return `complexIm(${a}, ${sheet.toFixed(1)})`;
          return (z) => toPolar({x: complexIm(a(z), sheet), y: 0});
        default:
          throw new Error(`Function '${fnName}' is not supported`);
      }
    }

    throw new Error(
      `Function '${fnName}' is not supported or doesn't take those amount of arguments`,
    );
  } else if (math.isParenthesisNode(node)) {
    return z => z;
  }

  throw new Error(`Unsupported node type: ${node.type}`);
}

export function parseFunction(fn: string, sheet: number): string {
  const fnNode = math.parse(fn);

  const glslCode = nodeToGLSL(fnNode, sheet);

  return glslCode;
}
