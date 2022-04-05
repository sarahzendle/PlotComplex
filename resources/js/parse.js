function parseEQ() {
    var eqn = math.parse(document.getElementById("eqn").value);
    if (eqn) {
        console.log(eqn);
        // Convert expression tree to ascii, to be displayed by MathJax
        var eqnStr = `\\[f(z) = ${eqn.toString()=="undefined"?"":eqn.toString()}\\]`;
        document.getElementById("eqn-pretty").innerHTML = eqnStr;
        MathJax.typeset(); // tell MathJax to check the page for new math to evaluate

        // save operations in array, to be sent as uniforms
        // divide(exp(z),mult(add(z,1),sub(z,2)))
        // divide exp z mult add z 1 sub z 2
        //   0     1  2  3    4  5 6  7  8 9
        // 0 divide waits for 2 vals
        // 1 exp waits for 1 vals
        // 2 exp gets val, evals and divide gets first val
        // 3 mult waits for 2 vals
        // 4 add waits for 2 vals
        // 5 add gets first val
        // 6 add gets second val, evals and mult gets first val
        // 7 sub waits for 2 vals
        // 8 sub gets first val
        // 9 sub gets first val, evals, mult gets second val, evals, divide gets second val, evals
        
        // REVERSE POLISH NOTATION
        // 2 z sub z 1 add mult

        // (for now) throw error if equation is not supported
    }
}