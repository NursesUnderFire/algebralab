// Example phrases for the Math Vocabulary Translator.
// Each entry includes the phrase, expected plain expression, LaTeX, difficulty, and tags.

const examplePhrases = [
    // Elementary
    {
        phrase: "the sum of 5 and 3",
        plain: "5 + 3",
        latex: "5 + 3",
        difficulty: "elementary",
        tags: ["addition", "sum"]
    },
    {
        phrase: "difference of 10 and 4",
        plain: "10 - 4",
        latex: "10 - 4",
        difficulty: "elementary",
        tags: ["subtraction", "difference"]
    },
    {
        phrase: "product of 6 and 7",
        plain: "6 * 7",
        latex: "6 \\cdot 7",
        difficulty: "elementary",
        tags: ["multiplication", "product"]
    },
    {
        phrase: "quotient of 20 and 5",
        plain: "20 / 5",
        latex: "\\frac{20}{5}",
        difficulty: "elementary",
        tags: ["division", "quotient"]
    },
    {
        phrase: "total of 8, 9, and 2",
        plain: "8 + 9 + 2",
        latex: "8 + 9 + 2",
        difficulty: "elementary",
        tags: ["addition", "total"]
    },
    {
        phrase: "how many more is 12 than 7",
        plain: "12 - 7",
        latex: "12 - 7",
        difficulty: "elementary",
        tags: ["subtraction", "how many more"]
    },
    {
        phrase: "split 15 equally among 3",
        plain: "15 / 3",
        latex: "\\frac{15}{3}",
        difficulty: "elementary",
        tags: ["division", "split", "each"]
    },
    {
        phrase: "half of 20",
        plain: "20 / 2",
        latex: "\\frac{20}{2}",
        difficulty: "elementary",
        tags: ["fraction", "half"]
    },
    {
        phrase: "one third of 30",
        plain: "30 / 3",
        latex: "\\frac{30}{3}",
        difficulty: "elementary",
        tags: ["fraction", "third"]
    },
    {
        phrase: "double 8",
        plain: "2 * 8",
        latex: "2 \\cdot 8",
        difficulty: "elementary",
        tags: ["multiplication", "double"]
    },

    // Middle school
    {
        phrase: "three times a number x",
        plain: "3 * x",
        latex: "3x",
        difficulty: "middle",
        tags: ["multiplication", "variable"]
    },
    {
        phrase: "x increased by 5",
        plain: "x + 5",
        latex: "x + 5",
        difficulty: "middle",
        tags: ["addition", "increased"]
    },
    {
        phrase: "y decreased by 3",
        plain: "y - 3",
        latex: "y - 3",
        difficulty: "middle",
        tags: ["subtraction", "decreased"]
    },
    {
        phrase: "the sum of a number and 9",
        plain: "x + 9",
        latex: "x + 9",
        difficulty: "middle",
        tags: ["addition", "sum", "variable"]
    },
    {
        phrase: "the difference of a number and 4",
        plain: "x - 4",
        latex: "x - 4",
        difficulty: "middle",
        tags: ["subtraction", "difference", "variable"]
    },
    {
        phrase: "product of 2 and a number",
        plain: "2 * x",
        latex: "2x",
        difficulty: "middle",
        tags: ["multiplication", "product", "variable"]
    },
    {
        phrase: "quotient of a number and 6",
        plain: "x / 6",
        latex: "\\frac{x}{6}",
        difficulty: "middle",
        tags: ["division", "quotient", "variable"]
    },
    {
        phrase: "twice a number plus 7",
        plain: "2*x + 7",
        latex: "2x + 7",
        difficulty: "middle",
        tags: ["multiplication", "addition"]
    },
    {
        phrase: "five less than a number",
        plain: "x - 5",
        latex: "x - 5",
        difficulty: "middle",
        tags: ["subtraction", "less than", "reversal"]
    },
    {
        phrase: "ten more than a number",
        plain: "x + 10",
        latex: "x + 10",
        difficulty: "middle",
        tags: ["addition", "more than", "reversal"]
    },

    // Algebra I
    {
        phrase: "twice x increased by 5",
        plain: "2*x + 5",
        latex: "2x + 5",
        difficulty: "algebra1",
        tags: ["multiplication", "addition", "more than"]
    },
    {
        phrase: "three less than twice y",
        plain: "2*y - 3",
        latex: "2y - 3",
        difficulty: "algebra1",
        tags: ["multiplication", "subtraction", "less than", "reversal"]
    },
    {
        phrase: "the square of x",
        plain: "x^2",
        latex: "x^{2}",
        difficulty: "algebra1",
        tags: ["exponent", "square"]
    },
    {
        phrase: "the cube of t",
        plain: "t^3",
        latex: "t^{3}",
        difficulty: "algebra1",
        tags: ["exponent", "cube"]
    },
    {
        phrase: "square root of 16",
        plain: "sqrt(16)",
        latex: "\\sqrt{16}",
        difficulty: "algebra1",
        tags: ["root", "square root"]
    },
    {
        phrase: "x is at least 10",
        plain: "x >= 10",
        latex: "x \\geq 10",
        difficulty: "algebra1",
        tags: ["inequality", "at least"]
    },
    {
        phrase: "y is at most 20",
        plain: "y <= 20",
        latex: "y \\leq 20",
        difficulty: "algebra1",
        tags: ["inequality", "at most"]
    },
    {
        phrase: "no more than 15",
        plain: "<= 15",
        latex: "\\leq 15",
        difficulty: "algebra1",
        tags: ["inequality", "no more than"]
    },
    {
        phrase: "no less than 8",
        plain: ">= 8",
        latex: "\\geq 8",
        difficulty: "algebra1",
        tags: ["inequality", "no less than"]
    },
    {
        phrase: "consecutive integers",
        plain: "x, x+1, x+2",
        latex: "x,\\,x+1,\\,x+2",
        difficulty: "algebra1",
        tags: ["integers", "consecutive"]
    },

    // Algebra II
    {
        phrase: "x increased by a factor of 3",
        plain: "3 * x",
        latex: "3x",
        difficulty: "algebra2",
        tags: ["multiplication", "factor"]
    },
    {
        phrase: "the square of the sum of x and 2",
        plain: "(x + 2)^2",
        latex: "(x+2)^{2}",
        difficulty: "algebra2",
        tags: ["addition", "exponent", "parentheses"]
    },
    {
        phrase: "the sum of the squares of a and b",
        plain: "a^2 + b^2",
        latex: "a^{2} + b^{2}",
        difficulty: "algebra2",
        tags: ["exponent", "addition"]
    },
    {
        phrase: "ratio of x to y",
        plain: "x : y",
        latex: "x : y",
        difficulty: "algebra2",
        tags: ["ratio"]
    },
    {
        phrase: "x is 20% of y",
        plain: "x = 0.2 * y",
        latex: "x = 0.2 y",
        difficulty: "algebra2",
        tags: ["percent", "multiplication"]
    },
    {
        phrase: "solve for y in terms of x",
        plain: "y = ...",
        latex: "y = \\dots",
        difficulty: "algebra2",
        tags: ["solve", "in terms of"]
    },
    {
        phrase: "the product of two consecutive integers",
        plain: "x * (x+1)",
        latex: "x (x+1)",
        difficulty: "algebra2",
        tags: ["multiplication", "consecutive"]
    },
    {
        phrase: "absolute value of x",
        plain: "|x|",
        latex: "|x|",
        difficulty: "algebra2",
        tags: ["absolute value"]
    },
    {
        phrase: "log base 2 of 8",
        plain: "log_2(8)",
        latex: "\\log_{2} 8",
        difficulty: "algebra2",
        tags: ["logarithm"]
    },
    {
        phrase: "exponential growth with rate r",
        plain: "A * e^(r*t)",
        latex: "A e^{rt}",
        difficulty: "algebra2",
        tags: ["exponential", "growth"]
    },

    // Precalc / Functions
    {
        phrase: "f of x",
        plain: "f(x)",
        latex: "f(x)",
        difficulty: "precalc",
        tags: ["function", "notation"]
    },
    {
        phrase: "g composed with f",
        plain: "g(f(x))",
        latex: "g \\circ f",
        difficulty: "precalc",
        tags: ["composition", "function"]
    },
    {
        phrase: "inverse of f",
        plain: "f^(-1)(x)",
        latex: "f^{-1}(x)",
        difficulty: "precalc",
        tags: ["inverse", "function"]
    },
    {
        phrase: "sine of theta",
        plain: "sin(theta)",
        latex: "\\sin \\theta",
        difficulty: "precalc",
        tags: ["trigonometry", "sine"]
    },
    {
        phrase: "cosine of 2 theta",
        plain: "cos(2*theta)",
        latex: "\\cos 2\\theta",
        difficulty: "precalc",
        tags: ["trigonometry", "cosine"]
    },
    {
        phrase: "arctan of x",
        plain: "arctan(x)",
        latex: "\\arctan x",
        difficulty: "precalc",
        tags: ["trigonometry", "inverse"]
    },
    {
        phrase: "nth term of an arithmetic sequence",
        plain: "a_n = a_1 + (n-1)*d",
        latex: "a_{n} = a_{1} + (n-1)d",
        difficulty: "precalc",
        tags: ["sequence", "arithmetic"]
    },
    {
        phrase: "sum from i=1 to n of i",
        plain: "sum_{i=1}^n i",
        latex: "\\sum_{i=1}^{n} i",
        difficulty: "precalc",
        tags: ["sigma", "summation"]
    },
    {
        phrase: "limit as x approaches 0 of sin(x)/x",
        plain: "lim_{x->0} sin(x)/x",
        latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x}",
        difficulty: "precalc",
        tags: ["limit", "trigonometry"]
    },
    {
        phrase: "domain of f(x) = sqrt(x)",
        plain: "x >= 0",
        latex: "x \\geq 0",
        difficulty: "precalc",
        tags: ["domain", "function"]
    },

    // Calculus
    {
        phrase: "derivative of f with respect to x",
        plain: "df/dx",
        latex: "\\frac{df}{dx}",
        difficulty: "calculus",
        tags: ["derivative", "calculus"]
    },
    {
        phrase: "second derivative of y",
        plain: "d^2y/dx^2",
        latex: "\\frac{d^{2}y}{dx^{2}}",
        difficulty: "calculus",
        tags: ["derivative", "second"]
    },
    {
        phrase: "integral of x^2 dx",
        plain: "∫ x^2 dx",
        latex: "\\int x^{2} \\, dx",
        difficulty: "calculus",
        tags: ["integral", "calculus"]
    },
    {
        phrase: "definite integral from 0 to 1 of x^2 dx",
        plain: "∫_0^1 x^2 dx",
        latex: "\\int_{0}^{1} x^{2} \\, dx",
        difficulty: "calculus",
        tags: ["integral", "definite"]
    },
    {
        phrase: "partial derivative of f with respect to x",
        plain: "∂f/∂x",
        latex: "\\frac{\\partial f}{\\partial x}",
        difficulty: "calculus",
        tags: ["partial derivative", "multivariable"]
    },
    {
        phrase: "gradient of f",
        plain: "∇f",
        latex: "\\nabla f",
        difficulty: "calculus",
        tags: ["gradient", "vector"]
    },
    {
        phrase: "divergence of vector field F",
        plain: "div F",
        latex: "\\nabla \\cdot \\mathbf{F}",
        difficulty: "calculus",
        tags: ["divergence", "vector calculus"]
    },
    {
        phrase: "curl of vector field F",
        plain: "curl F",
        latex: "\\nabla \\times \\mathbf{F}",
        difficulty: "calculus",
        tags: ["curl", "vector calculus"]
    },
    {
        phrase: "line integral of f along curve C",
        plain: "∫_C f ds",
        latex: "\\int_{C} f \\, ds",
        difficulty: "calculus",
        tags: ["line integral", "vector calculus"]
    },
    {
        phrase: "area under the curve y = f(x)",
        plain: "∫ f(x) dx",
        latex: "\\int f(x) \\, dx",
        difficulty: "calculus",
        tags: ["area", "integral"]
    },

    // Statistics & Probability
    {
        phrase: "mean of x1, x2, ..., xn",
        plain: "(x1 + x2 + ... + xn) / n",
        latex: "\\frac{x_1 + x_2 + \\dots + x_n}{n}",
        difficulty: "stats",
        tags: ["mean", "average"]
    },
    {
        phrase: "standard deviation of data",
        plain: "sqrt( variance )",
        latex: "\\sigma = \\sqrt{\\text{variance}}",
        difficulty: "stats",
        tags: ["standard deviation", "variance"]
    },
    {
        phrase: "probability of event A",
        plain: "P(A)",
        latex: "P(A)",
        difficulty: "stats",
        tags: ["probability", "notation"]
    },
    {
        phrase: "conditional probability of A given B",
        plain: "P(A|B)",
        latex: "P(A \\mid B)",
        difficulty: "stats",
        tags: ["conditional probability", "notation"]
    },
    {
        phrase: "expected value of X",
        plain: "E[X]",
        latex: "\\mathbb{E}[X]",
        difficulty: "stats",
        tags: ["expected value", "notation"]
    },
    {
        phrase: "variance of X",
        plain: "Var(X)",
        latex: "\\operatorname{Var}(X)",
        difficulty: "stats",
        tags: ["variance", "notation"]
    },
    {
        phrase: "normal distribution with mean mu and sd sigma",
        plain: "N(mu, sigma^2)",
        latex: "\\mathcal{N}(\\mu,\\sigma^{2})",
        difficulty: "stats",
        tags: ["normal distribution", "notation"]
    },
    {
        phrase: "correlation between X and Y",
        plain: "corr(X, Y)",
        latex: "\\rho_{XY}",
        difficulty: "stats",
        tags: ["correlation", "notation"]
    },
    {
        phrase: "regression line y = mx + b",
        plain: "y = m*x + b",
        latex: "y = mx + b",
        difficulty: "stats",
        tags: ["regression", "line"]
    },
    {
        phrase: "confidence interval for mean",
        plain: "mean ± margin",
        latex: "\\bar{x} \\pm \\text{margin}",
        difficulty: "stats",
        tags: ["confidence interval", "statistics"]
    }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { examplePhrases };
}
