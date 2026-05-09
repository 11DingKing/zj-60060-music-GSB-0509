import React, { useState, useEffect } from "react";
import { Close, Save, Refresh, Play } from "./Icons";
import { useEqualizerStore } from "../stores/equalizerStore";
import { useUIStore } from "../stores/uiStore";

const EqualizerPanel: React.FC = () => {
  const {
    isEnabled,
    currentPresetId,
    currentFrequencies,
    presets,
    setEnabled,
    selectPreset,
    setFrequency,
    resetToFlat,
    saveCurrentAsPreset,
    deletePreset,
  } = useEqualizerStore();
  const { toggleEqualizerPanel } = useUIStore();

  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  const eqFrequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const eqLabels = [
    "32",
    "64",
    "125",
    "250",
    "500",
    "1K",
    "2K",
    "4K",
    "8K",
    "16K",
  ];

  const handleSliderChange = (index: number, value: number) => {
    setFrequency(index, value);
  };

  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return;
    await saveCurrentAsPreset(newPresetName.trim());
    setNewPresetName("");
    setIsSavingPreset(false);
  };

  const handleDeletePreset = async (presetId: string) => {
    await deletePreset(presetId);
  };

  const formatFreqLabel = (freq: number): string => {
    if (freq >= 1000) {
      return `${freq / 1000}K`;
    }
    return `${freq}`;
  };

  return (
    <div className="side-panel-content equalizer-panel">
      <div className="panel-header">
        <h3 className="panel-title">均衡器</h3>
        <button className="panel-close-btn" onClick={toggleEqualizerPanel}>
          <Close />
        </button>
      </div>

      <div className="equalizer-content">
        <div className="equalizer-toggle">
          <span className="equalizer-toggle-label">启用均衡器</span>
          <button
            className={`toggle-switch ${isEnabled ? "active" : ""}`}
            onClick={() => setEnabled(!isEnabled)}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>

        <div className="equalizer-presets">
          <div className="panel-subtitle">预设</div>
          <div className="preset-list">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className={`preset-item ${currentPresetId === preset.id ? "active" : ""}`}
                onClick={() => selectPreset(preset.id)}
              >
                <span className="preset-name">{preset.name}</span>
                {!preset.isDefault && (
                  <button
                    className="preset-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePreset(preset.id);
                    }}
                  >
                    <Close />
                  </button>
                )}
              </div>
            ))}
            <button
              className="preset-item add-preset"
              onClick={() => setIsSavingPreset(true)}
            >
              <Save />
              <span>保存为预设</span>
            </button>
          </div>
        </div>

        {isSavingPreset && (
          <div className="save-preset-dialog">
            <input
              type="text"
              className="save-preset-input"
              placeholder="预设名称"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSavePreset();
                if (e.key === "Escape") {
                  setIsSavingPreset(false);
                  setNewPresetName("");
                }
              }}
              autoFocus
            />
            <div className="save-preset-actions">
              <button
                className="save-preset-btn secondary"
                onClick={() => {
                  setIsSavingPreset(false);
                  setNewPresetName("");
                }}
              >
                取消
              </button>
              <button
                className="save-preset-btn primary"
                onClick={handleSavePreset}
              >
                保存
              </button>
            </div>
          </div>
        )}

        <div className="equalizer-sliders">
          <div className="panel-subtitle">频率调节</div>
          <div className="sliders-container">
            {eqLabels.map((label, index) => (
              <div key={index} className="slider-column">
                <div className="slider-value">
                  {currentFrequencies[index] > 0
                    ? `+${currentFrequencies[index]}`
                    : currentFrequencies[index]}
                </div>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    className="vertical-slider"
                    min="-12"
                    max="12"
                    step="1"
                    value={currentFrequencies[index] || 0}
                    onChange={(e) =>
                      handleSliderChange(index, Number(e.target.value))
                    }
                    disabled={!isEnabled}
                  />
                </div>
                <div className="slider-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="equalizer-actions">
          <button
            className="equalizer-reset-btn"
            onClick={resetToFlat}
            disabled={!isEnabled}
          >
            <Refresh />
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EqualizerPanel;
