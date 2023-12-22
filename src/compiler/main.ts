import * as math from 'mathjs';

function nodeToGLSL(node: math.MathNode): string {
  if (math.isOperatorNode(node)) {
    const operands = node.args.map((arg) => nodeToGLSL(arg));

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
    return `vec2(${node.value}, 0.0)`;
  } else if (math.isSymbolNode(node)) {
    if (node.name === 'i') {
      return 'vec2(0.0, 1.0)';
    }

    if (node.name === 'z') {
      return `vec2(position.x, position.y)`;
    }

    if (node.name === 'x') {
      return `vec2(position.x, 0.0)`;
    }

    if (node.name === 'y') {
      return `vec2(0.0, position.y)`;
    }

    console.log(node);
  } else if (math.isFunctionNode(node)) {
    const fnName = node.fn.name;
    const args = node.args.map((arg) => nodeToGLSL(arg));

    if (args.length === 1) {
      const [a] = args;

      switch (fnName) {
        case 'exp':
          return `complexExp(${a})`;
        case 'sin':
          return `complexSin(${a})`;
        case 'cos':
          return `complexCos(${a})`;
        case 'tan':
          return `complexTan(${a})`;
        case 'sinh':
          return `complexSinh(${a})`;
        case 'cosh':
          return `complexCosh(${a})`;
        case 'tanh':
          return `complexTanh(${a})`;
        case 'sqrt':
          return `complexSqrt(${a})`;
        case 'conj':
          return `complexConjugate(${a})`;
        case 'mag':
          return `complexMagnitude(${a})`;
        case 'arg':
          return `complexArgument(${a})`;
        case 'log':
          return `complexLog(${a})`;
        case 're':
          return `complexRe(${a})`;
        case 'im':
          return `complexIm(${a})`;
        default:
          throw new Error(`Function '${fnName}' is not supported`);
      }
    }

    throw new Error(
      `Function '${fnName}' is not supported or doesn't take those amount of arguments`,
    );
  } else if (math.isParenthesisNode(node)) {
    return `(${nodeToGLSL(node.content)})`;
  }

  throw new Error(`Unsupported node type: ${node.type}`);
}

export function parseFunction(fn: string): string {
  const fnNode = math.parse(fn);

  const glslCode = nodeToGLSL(fnNode);

  return glslCode;
}
