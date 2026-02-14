import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const languageOptions = ['English', 'Amharic', 'French', 'Arabic', 'Swahili', 'Somali', 'Tigrinya', 'Oromo'];

export default function StepLanguagesModes() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [languageInput, setLanguageInput] = useState('');
  const languages = watch('languages') || [];
  const consultationModes = watch('consultationModes') || [];

  const addLanguage = () => {
    if (languageInput.trim() && !languages.includes(languageInput.trim())) {
      setValue('languages', [...languages, languageInput.trim()]);
      setLanguageInput('');
    }
  };

  const removeLanguage = (item: string) => {
    setValue('languages', languages.filter((i: string) => i !== item));
  };

  const toggleMode = (mode: 'chat' | 'audio' | 'video') => {
    const newModes = consultationModes.includes(mode)
      ? consultationModes.filter((m: string) => m !== mode)
      : [...consultationModes, mode];
    setValue('consultationModes', newModes);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Languages & Consultation</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Languages you speak</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            list="languages"
            className="flex-1 px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., English"
          />
          <datalist id="languages">
            {languageOptions.map((lang) => <option key={lang} value={lang} />)}
          </datalist>
          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {languages.map((lang: string) => (
            <span key={lang} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {lang}
              <button type="button" onClick={() => removeLanguage(lang)} className="ml-2 text-green-600 hover:text-green-800">
                <FaTimes size={12} />
              </button>
            </span>
          ))}
        </div>
        {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation modes</label>
        <div className="flex space-x-4">
          {(['chat', 'audio', 'video'] as const).map((mode) => (
            <label key={mode} className="flex items-center">
              <input
                type="checkbox"
                checked={consultationModes.includes(mode)}
                onChange={() => toggleMode(mode)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{mode}</span>
            </label>
          ))}
        </div>
        {errors.consultationModes && <p className="mt-1 text-sm text-red-600">{errors.consultationModes.message as string}</p>}
      </div>

      <Input
        label="Hourly Rate (optional, in ETB or USD)"
        type="number"
        {...register('hourlyRate', { valueAsNumber: true })}
        error={errors.hourlyRate?.message as string}
        placeholder="e.g., 500"
        min={0}
      />
      <p className="text-xs text-gray-500">Leave blank if you offer free consultation.</p>
    </div>
  );
}