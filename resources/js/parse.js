var eqnRPN = [];
var errStr = "";

function parseEQ() {
    var eqn = math.parse(document.getElementById("eqn").value);
    if (eqn) {
        console.log(eqn);
        // Convert expression tree to ascii, to be displayed by MathJax
        var eqnStr = `\\[f(z) = ${eqn.toString()=="undefined"?"":eqn.toString()}\\]`;
        document.getElementById("eqn-pretty").innerHTML = eqnStr;
        MathJax.typeset(); // tell MathJax to check the page for new math to evaluate
        // Clear error message div
        document.getElementById("error").innerHTML = "";
        // Clear equation array
        eqnRPN = [];
        errStr = "";

        // recursively read expression tree into Reverse Polish Notation
        function treeToRPN(node) {
            switch (node.type) {
                case 'OperatorNode':
                  // call function again on operator arguments
                  treeToRPN(node.args[0]);
                  treeToRPN(node.args[1]);
                  console.log(node.type, node.op)
                  // add operator to array
                  function setOp() {
                    if(node.op == "*") return MULT;
                    else if(node.op == "/") return DIV;
                    else if(node.op == "+") return ADD;
                    else if(node.op == "-") return SUB;
                    else if(node.op == "^") return POW;
                    else {
                        errStr += `ERROR: operation "${node.op}" not found<br>`;
                        return ERR;
                    }
                  }
                  eqnRPN.push(setOp());
                  break
                case 'ConstantNode':
                  console.log(node.type, node.value)
                  if (node.value >= ERR) {
                      // really big floats are reserved for functions and operators
                      errStr += `ERROR: ${node.value} is a reserved value<br>`;
                      eqnRPN.push(ERR);
                      break;
                  }
                  // add constant to RPN array
                  eqnRPN.push(node.value);
                  break
                case 'SymbolNode':
                  console.log(node.type, node.name)
                  if(node.name == "z") eqnRPN.push(Z);
                  else {
                      errStr += `ERROR: symbol ${node.name} not found<br>`;
                      eqnRPN.push(ERR);
                  }
                  break
                case 'ParenthesisNode':
                  console.log(node.type)
                  treeToRPN(node.content);
                  break
                case 'FunctionNode':
                  treeToRPN(node.args[0]);
                  console.log(node.type, node.fn.name)
                  function setFn() {
                    if(node.fn.name == "sin") return SIN;
                      else if(node.fn.name == "cos") return COS;
                      else if(node.fn.name == "tan") return TAN;
                      else if(node.fn.name == "sinh") return SINH;
                      else if(node.fn.name == "cosh") return COSH;
                      else if(node.fn.name == "exp") return EXP;
                      else {
                          errStr += `ERROR: function ${node.fn.name} not found<br>`;
                          return ERR;
                      }
                  }
                  eqnRPN.push(setFn());
                default:
                  console.log(node.type)
            }
        }
        treeToRPN(eqn);
        eqnRPN.push(END);
        console.log(eqnRPN);

        // (for now) throw error if equation is not supported
    }
}