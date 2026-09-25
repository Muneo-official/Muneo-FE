'use client';

import { create } from 'zustand';
import { type EstimateGenerateResponse } from '@/api/estimate';
import { trackEvent } from '@/lib/analytics';
import {
  BASIC_PROCESSES,
  type EstimateStep,
  type ProcessId,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type Step4Data,
} from '../_types';

const initialStep1: Step1Data = {
  region: null,
  spaceType: null,
  area: null,
  roomCount: null,
};

const initialStep2: Step2Data = {
  mode: 'full',
  selectedProcesses: BASIC_PROCESSES.map((p) => p.id),
};

const initialStep3: Step3Data = {
  buildingAge: null,
  elevator: null,
  floor: null,
  occupancy: null,
  truckAccess: null,
  constructionTiming: null,
};

const initialStep4: Step4Data = {};

const MIN_STEP: EstimateStep = 1;
const MAX_STEP: EstimateStep = 4;

interface EstimateStore {
  currentStep: EstimateStep;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  isGenerating: boolean;
  generateError: string | null;
  estimateResult: EstimateGenerateResponse | null;
  savedEstimateId: string | null;
  goToStep: (step: EstimateStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep1: (data: Partial<Step1Data>) => void;
  setStep2: (data: Partial<Step2Data>) => void;
  setStep3: (data: Partial<Step3Data>) => void;
  setStep4: <K extends keyof Step4Data>(processId: K, data: Partial<NonNullable<Step4Data[K]>>) => void;
  toggleProcess: (processId: ProcessId) => void;
  setGeneratingState: (isGenerating: boolean, error?: string | null) => void;
  setEstimateResult: (result: EstimateGenerateResponse | null) => void;
  setSavedEstimateId: (id: string | null) => void;
  reset: () => void;
}

export const useEstimateStore = create<EstimateStore>((set, get) => ({
  currentStep: MIN_STEP,
  step1: initialStep1,
  step2: initialStep2,
  step3: initialStep3,
  step4: initialStep4,
  isGenerating: false,
  generateError: null,
  estimateResult: null,
  savedEstimateId: null,

  goToStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < MAX_STEP) {
      trackEvent('estimate_step_complete', { step: currentStep });
      set({ currentStep: (currentStep + 1) as EstimateStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > MIN_STEP) {
      set({ currentStep: (currentStep - 1) as EstimateStep });
    }
  },

  setStep1: (data) => set((state) => ({ step1: { ...state.step1, ...data } })),

  setStep2: (data) => set((state) => ({ step2: { ...state.step2, ...data } })),

  setStep3: (data) => set((state) => ({ step3: { ...state.step3, ...data } })),

  setStep4: (processId, data) =>
    set((state) => ({
      step4: {
        ...state.step4,
        [processId]: { ...state.step4[processId], ...data },
      },
    })),

  toggleProcess: (processId) =>
    set((state) => {
      const { selectedProcesses } = state.step2;
      const next = selectedProcesses.includes(processId)
        ? selectedProcesses.filter((id) => id !== processId)
        : [...selectedProcesses, processId];
      return { step2: { ...state.step2, selectedProcesses: next } };
    }),

  setGeneratingState: (isGenerating, error = null) => set({ isGenerating, generateError: error }),

  setEstimateResult: (result) => set({ estimateResult: result }),

  setSavedEstimateId: (id) => set({ savedEstimateId: id }),

  reset: () =>
    set({
      currentStep: MIN_STEP,
      step1: initialStep1,
      step2: initialStep2,
      step3: initialStep3,
      step4: initialStep4,
      isGenerating: false,
      generateError: null,
      estimateResult: null,
      savedEstimateId: null,
    }),
}));
