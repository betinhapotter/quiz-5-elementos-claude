// API Configuration for Next.js API routes

export const API_ENDPOINTS = {
  generatePlanner: '/api/generate-planner',
  saveResult: '/api/save-result',
  submitQuiz: '/api/submit-quiz',
  saveLead: '/api/save-lead',
};

// Helper function for API calls with error handling
export async function callAPI(endpoint: string, data: any) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}
