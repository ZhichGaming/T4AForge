import access from "../utils/access";
import { FIELD_TITLES } from "../utils/FIELD_TITLES";

interface FormGroupProps {
  name: string;
  value: string | number | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
  tooltip?: string;
  children?: React.JSX.Element
}

export default function FormGroup({ name, value, onChange, maxLength, pattern, required, tooltip, children }: FormGroupProps ) {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        <span className="tooltip">
          <span className="field-title">{access(name, FIELD_TITLES)}</span>
          <span className="tooltiptext">
            {tooltip}
          </span>
        </span>
        {
          children || <input
            id={name}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            pattern={pattern}
            required={required}
          />
        }
      </label>
    </div>
  )
}
