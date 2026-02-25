import { TaskStep } from './types';

// Mock breakdown that simulates AI decomposition for MVP
export function generateMockBreakdown(taskDescription: string): TaskStep[] {
  const templates: Record<string, TaskStep[]> = {};

  // Generic breakdown logic based on task description length/complexity
  const words = taskDescription.trim().split(/\s+/);
  const isComplex = words.length > 5;

  const genericSteps = [
    { title: "Preparar el espacio de trabajo", description: "Abrí las herramientas que necesitás y cerrá distracciones", duration: 5 },
    { title: "Reunir la información necesaria", description: "Buscá los documentos, datos o referencias que vas a usar", duration: 10 },
    { title: "Definir el resultado esperado", description: "Escribí en una oración qué es 'terminado' para esta tarea", duration: 5 },
    { title: "Hacer el primer borrador o avance", description: "Empezá con lo más básico sin buscar perfección", duration: 15 },
    { title: "Revisar y ajustar lo hecho", description: "Releé lo que hiciste y hacé correcciones necesarias", duration: 10 },
    { title: "Completar los detalles finales", description: "Agregá lo que falta y pulí el resultado", duration: 10 },
  ];

  const complexExtra = [
    { title: "Organizar las secciones o partes", description: "Dividí el trabajo en bloques claros antes de avanzar", duration: 10 },
    { title: "Validar con el objetivo original", description: "Compará lo que hiciste con lo que necesitabas lograr", duration: 5 },
  ];

  const steps = isComplex
    ? [...genericSteps.slice(0, 3), complexExtra[0], ...genericSteps.slice(3), complexExtra[1]]
    : genericSteps;

  return steps.map((step, index) => ({
    id: `step-${Date.now()}-${index}`,
    stepNumber: index + 1,
    title: step.title,
    description: step.description,
    estimatedDurationMinutes: step.duration,
    completed: false,
  }));
}
