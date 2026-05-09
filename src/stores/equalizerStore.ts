import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EqualizerPreset } from '../types';
import { 
  getAllEqualizerPresets, 
  addEqualizerPreset, 
  updateEqualizerPreset as updatePresetInDB,
  deleteEqualizerPreset as deletePresetFromDB,
  defaultEqualizerPresets,
} from '../lib/db';

const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

interface EqualizerState {
  isEnabled: boolean;
  currentPresetId: string;
  presets: EqualizerPreset[];
  currentFrequencies: number[];
  isInitialized: boolean;
  
  initialize: () => Promise<void>;
  setEnabled: (enabled: boolean) => void;
  selectPreset: (presetId: string) => void;
  setFrequency: (index: number, value: number) => void;
  setAllFrequencies: (frequencies: number[]) => void;
  resetToFlat: () => void;
  saveCurrentAsPreset: (name: string) => Promise<void>;
  updatePreset: (id: string, name: string, frequencies: number[]) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  getEQFrequencies: () => number[];
}

const flatFrequencies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useEqualizerStore = create<EqualizerState>()(
  persist(
    (set, get) => ({
      isEnabled: false,
      currentPresetId: 'default-flat',
      presets: [],
      currentFrequencies: [...flatFrequencies],
      isInitialized: false,
      
      initialize: async () => {
        if (get().isInitialized) return;
        
        const presets = await getAllEqualizerPresets();
        
        if (presets.length === 0) {
          for (const preset of defaultEqualizerPresets) {
            await addEqualizerPreset(preset);
          }
          set({ presets: [...defaultEqualizerPresets], isInitialized: true });
        } else {
          set({ presets, isInitialized: true });
        }
      },
      
      setEnabled: (enabled) => {
        set({ isEnabled: enabled });
      },
      
      selectPreset: (presetId) => {
        const { presets } = get();
        const preset = presets.find((p) => p.id === presetId);
        
        if (preset) {
          set({
            currentPresetId: presetId,
            currentFrequencies: [...preset.frequencies],
          });
        }
      },
      
      setFrequency: (index, value) => {
        set((state) => {
          const newFrequencies = [...state.currentFrequencies];
          newFrequencies[index] = Math.max(-12, Math.min(12, value));
          
          return {
            currentFrequencies: newFrequencies,
            currentPresetId: '',
          };
        });
      },
      
      setAllFrequencies: (frequencies) => {
        set({
          currentFrequencies: frequencies.map((f) => Math.max(-12, Math.min(12, f))),
          currentPresetId: '',
        });
      },
      
      resetToFlat: () => {
        set({
          currentFrequencies: [...flatFrequencies],
          currentPresetId: 'default-flat',
        });
      },
      
      saveCurrentAsPreset: async (name) => {
        const { currentFrequencies } = get();
        const preset: EqualizerPreset = {
          id: generateId(),
          name,
          isDefault: false,
          frequencies: [...currentFrequencies],
        };
        
        await addEqualizerPreset(preset);
        set((state) => ({
          presets: [...state.presets, preset],
          currentPresetId: preset.id,
        }));
      },
      
      updatePreset: async (id, name, frequencies) => {
        set((state) => {
          const presets = state.presets.map((p) => {
            if (p.id === id && !p.isDefault) {
              const updated = {
                ...p,
                name,
                frequencies: [...frequencies],
              };
              updatePresetInDB(updated);
              return updated;
            }
            return p;
          });
          
          const isCurrentPreset = state.currentPresetId === id;
          
          return {
            presets,
            currentFrequencies: isCurrentPreset ? [...frequencies] : state.currentFrequencies,
          };
        });
      },
      
      deletePreset: async (id) => {
        const { presets, currentPresetId } = get();
        const preset = presets.find((p) => p.id === id);
        
        if (!preset || preset.isDefault) return;
        
        await deletePresetFromDB(id);
        
        const newPresets = presets.filter((p) => p.id !== id);
        const isCurrentPreset = currentPresetId === id;
        
        set({
          presets: newPresets,
          currentPresetId: isCurrentPreset ? 'default-flat' : currentPresetId,
          currentFrequencies: isCurrentPreset ? [...flatFrequencies] : get().currentFrequencies,
        });
      },
      
      getEQFrequencies: () => EQ_FREQUENCIES,
    }),
    {
      name: 'equalizer-store',
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        currentPresetId: state.currentPresetId,
        currentFrequencies: state.currentFrequencies,
      }),
    }
  )
);
