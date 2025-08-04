import type { Declaration, DeclarationsResponse, CreateDeclarationRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchDeclarations = async (
  page: number = 1,
  limit: number = 10
): Promise<DeclarationsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/declarations?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch declarations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching declarations:', error);
    throw error;
  }
};

export const createDeclaration = async (
  declarationData: CreateDeclarationRequest
): Promise<Declaration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/declarations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(declarationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create declaration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating declaration:', error);
    throw error;
  }
};