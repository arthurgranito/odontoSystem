import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface ObservacoesTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export const ObservacoesTextarea: React.FC<ObservacoesTextareaProps> = ({ value, onChange }) => (
  <div className="flex flex-col gap-2">
    <Label>Observações (Opcional)</Label>
    <Textarea
      placeholder="Observações (Opcional)"
      className="resize-none text-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
); 