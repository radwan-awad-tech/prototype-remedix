import { secureService, HR } from './accessGuard';
import { MOCK_DOCUMENTS } from '../mockData';
import { Document, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let documents = [...MOCK_DOCUMENTS];

const rawService = {
  listDocuments: async (): Promise<ApiResponse<Document[]>> => {
    return apiClient.get([...documents]);
  },

  uploadDocument: async (data: Partial<Document>): Promise<ApiResponse<Document>> => {
    const newDoc = {
      ...data,
      id: `DOC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      uploadedAt: new Date().toISOString(),
    } as Document;
    documents.unshift(newDoc);
    return apiClient.post(newDoc, 500);
  },

  deleteDocument: async (id: string): Promise<ApiResponse<void>> => {
    const index = documents.findIndex(d => d.id === id);
    if (index !== -1) {
      documents.splice(index, 1);
    }
    return apiClient.delete(undefined, 500);
  }
};

// Legacy unscoped dashboard/report endpoints are retired; workspaceService is the authorized replacement.
export const documentService = secureService('/employees', rawService, {listDocuments: { roles: HR }, uploadDocument: { roles: HR }, deleteDocument: { roles: ['HR Manager'] }});
