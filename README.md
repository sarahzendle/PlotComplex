# CSCI 4239 Final Project: PlotComplex

## A graphing calculator for complex functions

A WebGL application that renders visualizations of complex functions. The application takes user input for a function, which is parsed into an expression tree by the Math.js library. The tree is then translated into Reverse Polish Notation (RPN), allowing function information to be sent to shaders. In the shader, the RPN is parsed back into a mathematical function and evaluated. Color output is generated using hue to represent argument of the complex number, and lightness to represent magnitude.

In the sphere view, the complex plane is stereographically projected onto a sphere. This gives us a way to visualize the function's behavior at infinity. In the surface view, the magnitude of the function is represented by the height of the surface at that point, in addition to the lightness.

As of right now, the parser can handle the following operations:
    - addition/subtraction
    - multiplication/division
    - powers (i.e. z^n)
    - exponentials (i.e. e^z)
    - sin, cos, tan
In any combination. Input strings are fairly intuitive: if it would work in any other web equation parser, the parser will most likely be able to read it.

Some example input:

sin(z)      1/(z(z+0.5))     exp(z^2)     cos(1/z)       

(Note: rational and trig functions are by far the most fun to look at!)