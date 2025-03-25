import T4AForm from "./components/T4AForm";
import T4ASummary from "./components/T4ASummary";
import T619Form from "./components/T619Form";
import { T4ASlipData, T4ASummaryData } from "./types/T4A.types";
import T619Data from "./types/T619.types";

interface FormPageProps {
  activeFormIdentifier: string;
  setActiveFormIdentifier: React.Dispatch<React.SetStateAction<string>>;
  t619FormData: T619Data;
  setT619FormData: React.Dispatch<React.SetStateAction<T619Data | null>>;
  t4aSlips: T4ASlipData[];
  setT4aSlips: React.Dispatch<React.SetStateAction<T4ASlipData[] | null>>;
  t4aSummary: T4ASummaryData;
  setT4aSummary: React.Dispatch<React.SetStateAction<T4ASummaryData | null>>;
  generateXML: () => void;
}

export default function FormPage(
  {
    activeFormIdentifier,
    setActiveFormIdentifier,
    t619FormData,
    setT619FormData,
    t4aSlips,
    setT4aSlips,
    t4aSummary,
    setT4aSummary,
    generateXML,
  }: FormPageProps
) {
  return (
    <>
      <div className="progress-bar">
        <div className="step-container">
          <button
            className={(activeFormIdentifier === 'T619' ? 'selected' : '') + " step"}
            type="button"
            onClick={() => setActiveFormIdentifier('T619')}
          >
            1
          </button>
          <p className="step-label">T619 transmitter information</p>
        </div>
        <div className="step-container">
          <button
            className={(activeFormIdentifier === 'T4A' ? 'selected' : '') + " step"}
            type="button"
            onClick={() => setActiveFormIdentifier('T4A')}
          >
            2
          </button>
          <p className="step-label">T4A information</p>
        </div>
        <div className="step-container">
          <button
            className={(activeFormIdentifier === 'T4ASummary' ? 'selected' : '') + " step"}
            type="button"
            onClick={() => setActiveFormIdentifier('T4ASummary')}
          >
            3
          </button>
          <p className="step-label">Summary</p>
        </div>
      </div>
      {activeFormIdentifier === 'T619' && (
        <T619Form
          formData={t619FormData}
          setFormData={setT619FormData}
          nextStep={() => setActiveFormIdentifier('T4A')}
        />
      )}
      {activeFormIdentifier === 'T4A' && (
        <T4AForm
          slips={t4aSlips}
          setSlips={setT4aSlips}
          nextStep={() => setActiveFormIdentifier('T4ASummary')}
        />
      )}
      {activeFormIdentifier === 'T4ASummary' && (
        <T4ASummary
          slips={t4aSlips}
          summaryData={t4aSummary}
          setSummaryData={setT4aSummary}
          generateXML={generateXML}
        />
      )}
    </>
  );
}
