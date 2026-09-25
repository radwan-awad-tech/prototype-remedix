import { secureService, HR, FINANCE, scopedRow } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_INTERVIEWS, MOCK_OFFERS } from '../mockData';
import { JobOpening, Candidate, Interview, Offer, JobOpeningStatus, CandidateStage, InterviewOutcome, OfferStatus, ApiResponse } from '../types';
import { employeeService } from './employeeService';
import { apiClient } from './apiClient';

// In-memory store for mock backend behavior
let jobOpenings = [...MOCK_JOB_OPENINGS];
let candidates = [...MOCK_CANDIDATES];
let interviews = [...MOCK_INTERVIEWS];
let offers = [...MOCK_OFFERS];

const rawService = {
  // Job Openings
  listJobOpenings: async (department?: string): Promise<ApiResponse<JobOpening[]>> => {
    let data = [...jobOpenings];
    if (department) {
      data = data.filter(jo => jo.department === department);
    }
    return apiClient.get(data);
  },

  updateJobOpeningStatus: async (id: string, status: JobOpeningStatus, reason?: string): Promise<ApiResponse<void>> => {
    const idx = jobOpenings.findIndex(jo => jo.id === id);
    if (idx > -1) {
      jobOpenings[idx] = { ...jobOpenings[idx], status };
      return apiClient.put(undefined, 500);
    }
    return apiClient.error('Job opening not found', 404);
  },

  createJobOpening: async (data: Partial<JobOpening>): Promise<ApiResponse<JobOpening>> => {
    const newOpening: JobOpening = {
      ...data,
      id: `JO-${Math.floor(Math.random() * 10000)}`,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      candidateCount: 0
    } as JobOpening;
    jobOpenings.push(newOpening);
    return apiClient.post(newOpening, 500);
  },

  // Candidates
  listCandidates: async (openingId?: string, department?: string): Promise<ApiResponse<Candidate[]>> => {
    let data = [...candidates];
    if (openingId) {
      data = data.filter(c => c.openingId === openingId);
    }
    if (department) {
      // Filter candidates by their opening's department
      data = data.filter(c => {
        const opening = jobOpenings.find(jo => jo.id === c.openingId);
        return opening?.department === department;
      });
    }
    return apiClient.get(data);
  },

  addCandidate: async (data: Partial<Candidate>): Promise<ApiResponse<Candidate>> => {
    const newCandidate: Candidate = {
      ...data,
      id: `CAND-${Math.floor(Math.random() * 10000)}`,
      stage: 'Applied',
      appliedAt: new Date().toISOString().split('T')[0],
      history: [{ stage: 'Applied', timestamp: new Date().toISOString().split('T')[0], note: 'Application received' }],
      attachments: data.attachments || [] // Ensure attachments array exists
    } as Candidate;
    candidates.push(newCandidate);
    return apiClient.post(newCandidate, 500);
  },

  updateCandidateStage: async (id: string, stage: CandidateStage, note?: string): Promise<ApiResponse<void>> => {
    const idx = candidates.findIndex(c => c.id === id);
    if (idx > -1) {
      const c = candidates[idx];
      candidates[idx] = {
        ...c,
        stage,
        updatedAt: new Date().toISOString(),
        history: [...c.history, { stage, timestamp: new Date().toISOString().split('T')[0], note }]
      };
      return apiClient.put(undefined, 500);
    }
    return apiClient.error('Candidate not found', 404);
  },

  // Interviews
  listInterviews: async (department?: string): Promise<ApiResponse<Interview[]>> => {
    let data = [...interviews];
    if (department) {
      data = data.filter(i => i.department === department);
    }
    return apiClient.get(data);
  },

  scheduleInterview: async (data: Partial<Interview>): Promise<ApiResponse<Interview>> => {
    const newInterview: Interview = {
      ...data,
      id: `INT-${Math.floor(Math.random() * 10000)}`,
      outcome: 'Pending'
    } as Interview;
    interviews.push(newInterview);
    return apiClient.post(newInterview, 500);
  },

  recordInterviewOutcome: async (id: string, outcome: InterviewOutcome, score: number, notes: string): Promise<ApiResponse<void>> => {
    const idx = interviews.findIndex(i => i.id === id);
    if (idx > -1) {
      interviews[idx] = { ...interviews[idx], outcome, score, notes };
      return apiClient.put(undefined, 500);
    }
    return apiClient.error('Interview not found', 404);
  },

  // Offers
  listOffers: async (department?: string): Promise<ApiResponse<Offer[]>> => {
    let data = [...offers];
    if (department) {
      data = data.filter(o => o.department === department);
    }
    return apiClient.get(data);
  },

  generateOffer: async (data: Partial<Offer>): Promise<ApiResponse<Offer>> => {
    const newOffer: Offer = {
      ...data,
      id: `OFF-${Math.floor(Math.random() * 10000)}`,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0]
    } as Offer;
    offers.push(newOffer);
    return apiClient.post(newOffer, 500);
  },

  updateOfferStatus: async (id: string, status: OfferStatus, note?: string): Promise<ApiResponse<void>> => {
    const idx = offers.findIndex(o => o.id === id);
    if (idx > -1) {
      offers[idx] = { ...offers[idx], status, notes: note ? `${offers[idx].notes}\n${note}` : offers[idx].notes };
      return apiClient.put(undefined, 500);
    }
    return apiClient.error('Offer not found', 404);
  },

  // Conversion
  convertCandidateToEmployee: async (candidateId: string, employeeData: any): Promise<ApiResponse<void>> => {
    const idx = candidates.findIndex(c => c.id === candidateId);
    if (idx > -1) {
      const candidate = candidates[idx];
      // Create employee record
      const response = await employeeService.createEmployee({
        firstName: candidate.name.split(' ')[0],
        lastName: candidate.name.split(' ').slice(1).join(' '),
        email: candidate.email,
        phone: candidate.phone,
        department: employeeData.department,
        position: employeeData.position,
        supervisorId: employeeData.supervisor,
        hireDate: employeeData.hireDate,
        role: employeeData.role,
        status: 'Active'
      });

      if (response.success) {
        // Mark candidate as hired
        candidates[idx] = { ...candidates[idx], stage: 'Hired' };
        return apiClient.put(undefined, 800);
      }
      return apiClient.error('Failed to create employee', 500);
    }
    return apiClient.error('Candidate not found', 404);
  }
};

export const recruitmentService = secureService('/recruitment', rawService, {
listJobOpenings: {}, listCandidates: {}, listInterviews: {}, listOffers: { roles: HR },
 createJobOpening: { roles: HR }, updateJobOpeningStatus: { roles: ['Senior Manager','HR Manager'] },
 addCandidate: { roles: HR }, updateCandidateStage: { roles: HR, validate: (u,id,stage) => stage !== 'Hired' && (['Senior Manager','HR Manager'].includes(u.role) || stage !== 'Offered') },
 scheduleInterview: { roles: HR }, recordInterviewOutcome: { roles: ['HR Manager','HR Officer','Department Head'], target: id => interviews.find(i => i.id === id) },
 generateOffer: { roles: HR }, updateOfferStatus: { roles: ['Senior Manager','HR Manager'] }, convertCandidateToEmployee: { roles: ['Senior Manager','HR Manager'] }
});
