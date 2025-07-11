export function generateExercise(grade, subject) {
  if (subject) {
    return generateExerciseBySubject(grade, subject);
  }
  
  const exerciseTypes = getExerciseTypesForGrade(grade);
  const randomType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
  
  switch (randomType) {
    case 'suma':
      return generateSumExercise(grade);
    case 'resta':
      return generateSubtractionExercise(grade);
    case 'multiplicacion':
      return generateMultiplicationExercise(grade);
    case 'division':
      return generateDivisionExercise(grade);
    case 'fracciones':
      return generateFractionExercise(grade);
    case 'decimales':
      return generateDecimalExercise(grade);
    case 'porcentajes':
      return generatePercentageExercise(grade);
    case 'problemas':
      return generateWordProblem(grade);
    case 'geometria':
      return generateGeometryExercise(grade);
    default:
      return generateSumExercise(grade);
  }
}

function generateExerciseBySubject(grade, subject) {
  switch (subject) {
    case 'matematicas':
      const mathTypes = ['suma', 'resta', 'multiplicacion', 'division', 'fracciones', 'decimales'];
      const randomMathType = mathTypes[Math.floor(Math.random() * mathTypes.length)];
      return generateExercise(grade);
    case 'geometria':
      return generateGeometryExercise(grade);
    case 'problemas':
      return generateWordProblem(grade);
    default:
      return generateExercise(grade);
  }
}

function getExerciseTypesForGrade(grade) {
  switch (grade) {
    case 4:
      return ['suma', 'resta', 'multiplicacion', 'division', 'geometria', 'problemas'];
    case 5:
      return ['suma', 'resta', 'multiplicacion', 'division', 'fracciones', 'decimales', 'geometria', 'problemas'];
    case 6:
      return ['multiplicacion', 'division', 'fracciones', 'decimales', 'porcentajes', 'geometria', 'problemas'];
    default:
      return ['suma', 'resta'];
  }
}

// Ejercicios de Geometría
function generateGeometryExercise(grade) {
  const geometryTypes = getGeometryTypesForGrade(grade);
  const randomType = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
  
  switch (randomType) {
    case 'perimetro':
      return generatePerimeterExercise(grade);
    case 'area':
      return generateAreaExercise(grade);
    case 'angulos':
      return generateAngleExercise(grade);
    case 'figuras':
      return generateShapeExercise(grade);
    default:
      return generatePerimeterExercise(grade);
  }
}

function getGeometryTypesForGrade(grade) {
  switch (grade) {
    case 4:
      return ['perimetro', 'figuras'];
    case 5:
      return ['perimetro', 'area', 'figuras'];
    case 6:
      return ['perimetro', 'area', 'angulos', 'figuras'];
    default:
      return ['figuras'];
  }
}

function generatePerimeterExercise(grade) {
  if (grade === 4) {
    const lado = Math.floor(Math.random() * 8) + 3;
    return {
      type: 'Perímetro de Cuadrado',
      subject: 'geometria',
      problem: `Un cuadrado tiene lados de ${lado} cm cada uno.`,
      question: `¿Cuál es el perímetro del cuadrado?`,
      answer: lado * 4,
      explanation: `Perímetro = 4 × ${lado} = ${lado * 4} cm`
    };
  } else {
    const largo = Math.floor(Math.random() * 10) + 5;
    const ancho = Math.floor(Math.random() * 8) + 3;
    return {
      type: 'Perímetro de Rectángulo',
      subject: 'geometria',
      problem: `Un rectángulo tiene ${largo} cm de largo y ${ancho} cm de ancho.`,
      question: `¿Cuál es el perímetro del rectángulo?`,
      answer: 2 * (largo + ancho),
      explanation: `Perímetro = 2 × (${largo} + ${ancho}) = 2 × ${largo + ancho} = ${2 * (largo + ancho)} cm`
    };
  }
}

function generateAreaExercise(grade) {
  if (grade === 5) {
    const lado = Math.floor(Math.random() * 8) + 3;
    return {
      type: 'Área de Cuadrado',
      subject: 'geometria',
      problem: `Un cuadrado tiene lados de ${lado} cm cada uno.`,
      question: `¿Cuál es el área del cuadrado?`,
      answer: lado * lado,
      explanation: `Área = ${lado} × ${lado} = ${lado * lado} cm²`
    };
  } else {
    const largo = Math.floor(Math.random() * 10) + 5;
    const ancho = Math.floor(Math.random() * 8) + 3;
    return {
      type: 'Área de Rectángulo',
      subject: 'geometria',
      problem: `Un rectángulo tiene ${largo} cm de largo y ${ancho} cm de ancho.`,
      question: `¿Cuál es el área del rectángulo?`,
      answer: largo * ancho,
      explanation: `Área = ${largo} × ${ancho} = ${largo * ancho} cm²`
    };
  }
}

function generateAngleExercise(grade) {
  const angles = [30, 45, 60, 90, 120, 135, 150];
  const angle1 = angles[Math.floor(Math.random() * angles.length)];
  const angle2 = 180 - angle1;
  
  return {
    type: 'Ángulos Complementarios',
    subject: 'geometria',
    problem: `Dos ángulos son complementarios. Uno de ellos mide ${angle1}°.`,
    question: `¿Cuánto mide el otro ángulo?`,
    answer: angle2,
    explanation: `Ángulos complementarios suman 180°: 180° - ${angle1}° = ${angle2}°`
  };
}

function generateShapeExercise(grade) {
  const shapes = [
    { name: 'triángulo', sides: 3 },
    { name: 'cuadrado', sides: 4 },
    { name: 'pentágono', sides: 5 },
    { name: 'hexágono', sides: 6 }
  ];
  
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  return {
    type: 'Identificar Figuras',
    subject: 'geometria',
    problem: `¿Cuántos lados tiene un ${shape.name}?`,
    question: `Número de lados:`,
    answer: shape.sides,
    explanation: `Un ${shape.name} tiene ${shape.sides} lados`
  };
}

// Mantener las funciones existentes de matemáticas
function generateSumExercise(grade) {
  const max = grade === 4 ? 100 : grade === 5 ? 500 : 1000;
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  
  return {
    type: 'Suma',
    subject: 'matematicas',
    question: `${a} + ${b} = ?`,
    answer: a + b,
    explanation: `${a} + ${b} = ${a + b}`
  };
}

function generateSubtractionExercise(grade) {
  const max = grade === 4 ? 100 : grade === 5 ? 500 : 1000;
  const a = Math.floor(Math.random() * max) + 50;
  const b = Math.floor(Math.random() * (a - 1)) + 1;
  
  return {
    type: 'Resta',
    subject: 'matematicas',
    question: `${a} - ${b} = ?`,
    answer: a - b,
    explanation: `${a} - ${b} = ${a - b}`
  };
}

function generateMultiplicationExercise(grade) {
  const maxA = grade === 4 ? 12 : grade === 5 ? 25 : 50;
  const maxB = grade === 4 ? 12 : grade === 5 ? 20 : 30;
  
  const a = Math.floor(Math.random() * maxA) + 1;
  const b = Math.floor(Math.random() * maxB) + 1;
  
  return {
    type: 'Multiplicación',
    subject: 'matematicas',
    question: `${a} × ${b} = ?`,
    answer: a * b,
    explanation: `${a} × ${b} = ${a * b}`
  };
}

function generateDivisionExercise(grade) {
  const maxResult = grade === 4 ? 12 : grade === 5 ? 25 : 50;
  const result = Math.floor(Math.random() * maxResult) + 1;
  const divisor = Math.floor(Math.random() * 12) + 2;
  const dividend = result * divisor;
  
  return {
    type: 'División',
    subject: 'matematicas',
    question: `${dividend} ÷ ${divisor} = ?`,
    answer: result,
    explanation: `${dividend} ÷ ${divisor} = ${result}`
  };
}

function generateFractionExercise(grade) {
  if (grade === 4) {
    const numerator = Math.floor(Math.random() * 8) + 1;
    const denominator = Math.floor(Math.random() * 8) + 2;
    
    return {
      type: 'Fracciones Simples',
      subject: 'matematicas',
      question: `¿Cuánto es ${numerator}/${denominator} en decimal?`,
      answer: Math.round((numerator / denominator) * 100) / 100,
      explanation: `${numerator} ÷ ${denominator} = ${Math.round((numerator / denominator) * 100) / 100}`
    };
  } else {
    const denominator = Math.floor(Math.random() * 8) + 2;
    const num1 = Math.floor(Math.random() * (denominator - 1)) + 1;
    const num2 = Math.floor(Math.random() * (denominator - num1)) + 1;
    
    return {
      type: 'Suma de Fracciones',
      subject: 'matematicas',
      question: `${num1}/${denominator} + ${num2}/${denominator} = ?`,
      answer: Math.round(((num1 + num2) / denominator) * 100) / 100,
      explanation: `${num1}/${denominator} + ${num2}/${denominator} = ${num1 + num2}/${denominator} = ${Math.round(((num1 + num2) / denominator) * 100) / 100}`
    };
  }
}

function generateDecimalExercise(grade) {
  const a = Math.round((Math.random() * 50 + 1) * 100) / 100;
  const b = Math.round((Math.random() * 20 + 1) * 100) / 100;
  
  const operations = ['suma', 'resta'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  if (operation === 'suma') {
    return {
      type: 'Suma de Decimales',
      subject: 'matematicas',
      question: `${a} + ${b} = ?`,
      answer: Math.round((a + b) * 100) / 100,
      explanation: `${a} + ${b} = ${Math.round((a + b) * 100) / 100}`
    };
  } else {
    const larger = Math.max(a, b);
    const smaller = Math.min(a, b);
    return {
      type: 'Resta de Decimales',
      subject: 'matematicas',
      question: `${larger} - ${smaller} = ?`,
      answer: Math.round((larger - smaller) * 100) / 100,
      explanation: `${larger} - ${smaller} = ${Math.round((larger - smaller) * 100) / 100}`
    };
  }
}

function generatePercentageExercise(grade) {
  const percentage = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
  const number = Math.floor(Math.random() * 200) + 20;
  
  return {
    type: 'Porcentajes',
    subject: 'matematicas',
    question: `¿Cuánto es el ${percentage}% de ${number}?`,
    answer: (number * percentage) / 100,
    explanation: `${percentage}% de ${number} = (${percentage} × ${number}) ÷ 100 = ${(number * percentage) / 100}`
  };
}

function generateWordProblem(grade) {
  const problems = getWordProblemsForGrade(grade);
  return problems[Math.floor(Math.random() * problems.length)];
}

function getWordProblemsForGrade(grade) {
  if (grade === 4) {
    return [
      {
        type: 'Problema de Suma',
        subject: 'problemas',
        problem: 'En una granja hay 25 gallinas y 18 patos. ¿Cuántas aves hay en total?',
        question: '25 + 18 = ?',
        answer: 43,
        explanation: 'Sumamos las gallinas y los patos: 25 + 18 = 43 aves'
      },
      {
        type: 'Problema de Resta',
        subject: 'problemas',
        problem: 'Pedro tenía 50 canicas. Perdió 17 jugando. ¿Cuántas canicas le quedan?',
        question: '50 - 17 = ?',
        answer: 33,
        explanation: 'Restamos las canicas perdidas: 50 - 17 = 33 canicas'
      },
      {
        type: 'Problema de Multiplicación',
        subject: 'problemas',
        problem: 'En cada bolsa hay 6 dulces. Si compras 4 bolsas, ¿cuántos dulces tienes?',
        question: '6 × 4 = ?',
        answer: 24,
        explanation: 'Multiplicamos dulces por bolsa: 6 × 4 = 24 dulces'
      },
      {
        type: 'Problema de División',
        subject: 'problemas',
        problem: 'Ana tiene 24 stickers y los quiere repartir entre 6 amigos. ¿Cuántos stickers le toca a cada uno?',
        question: '24 ÷ 6 = ?',
        answer: 4,
        explanation: 'Dividimos los stickers entre los amigos: 24 ÷ 6 = 4 stickers cada uno'
      }
    ];
  } else if (grade === 5) {
    return [
      {
        type: 'Problema de Fracciones',
        subject: 'problemas',
        problem: 'María comió 2/8 de una pizza y su hermano comió 3/8. ¿Qué fracción comieron juntos?',
        question: '2/8 + 3/8 = ?',
        answer: 0.625,
        explanation: '2/8 + 3/8 = 5/8 = 0.625 de la pizza'
      },
      {
        type: 'Problema de Decimales',
        subject: 'problemas',
        problem: 'Luis compró un juguete por $15.75 y un libro por $8.50. ¿Cuánto gastó en total?',
        question: '15.75 + 8.50 = ?',
        answer: 24.25,
        explanation: 'Sumamos los precios: $15.75 + $8.50 = $24.25'
      },
      {
        type: 'Problema de Tiempo',
        subject: 'problemas',
        problem: 'Un partido de fútbol dura 90 minutos. Si han pasado 35 minutos, ¿cuántos minutos faltan?',
        question: '90 - 35 = ?',
        answer: 55,
        explanation: 'Restamos el tiempo transcurrido: 90 - 35 = 55 minutos'
      }
    ];
  } else {
    return [
      {
        type: 'Problema de Porcentajes',
        subject: 'problemas',
        problem: 'En una escuela de 200 estudiantes, el 30% practica deportes. ¿Cuántos estudiantes practican deportes?',
        question: '30% de 200 = ?',
        answer: 60,
        explanation: '30% de 200 = (30 × 200) ÷ 100 = 60 estudiantes'
      },
      {
        type: 'Problema de Proporciones',
        subject: 'problemas',
        problem: 'Si 4 libros cuestan $60, ¿cuánto cuestan 7 libros?',
        question: 'Si 4 libros = $60, entonces 7 libros = ?',
        answer: 105,
        explanation: 'Cada libro cuesta $60 ÷ 4 = $15. Entonces 7 libros cuestan 7 × $15 = $105'
      },
      {
        type: 'Problema de Velocidad',
        subject: 'problemas',
        problem: 'Un auto viaja a 60 km/h. ¿Qué distancia recorre en 3 horas?',
        question: '60 × 3 = ?',
        answer: 180,
        explanation: 'Distancia = velocidad × tiempo = 60 × 3 = 180 km'
      }
    ];
  }
}