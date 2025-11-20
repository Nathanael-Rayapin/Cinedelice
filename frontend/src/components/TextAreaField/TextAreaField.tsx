import { useEffect, useRef } from "react";
import "./TextAreaField.scss";
// Propriétés du composant TextAreaField
interface ITextAreaFieldProps {
    value: string;
    onChange: (value: string) => void;
    options?: {
        placeholder?: string;
    }
}
// Composant TextAreaField pour les zones de texte avec auto-resize et puces
const TextAreaField = ({ value, onChange, options }: ITextAreaFieldProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        autoResize();
    }, [value]);

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };
    // Appel initial pour ajuster la taille
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val = e.target.value;

        // Si on commence à taper et qu'il n'y a pas de "•", on l'ajoute
        if (!value && val.length > 0 && !val.startsWith("• ")) {
            val = "• " + val;
        }

        // Détecte si l'utilisateur a ajouté une nouvelle ligne
        const isAddingNewLine = val.length > value.length && val.endsWith("\n");

        if (isAddingNewLine) {
            // Récupère la ligne juste avant le \n
            const lines = val.split("\n");
            const previousLine = lines[lines.length - 2] || "";

            // N'ajoute "• " que si la ligne précédente contient du texte (pas juste "•")
            if (previousLine.trim().length > 1) {
                val += "• ";
            }
        }

        onChange(val);
        autoResize();
    };

    return (
        <textarea
            ref={textareaRef}
            className="input"
            placeholder={options?.placeholder}
            value={value}
            onChange={handleChange}
        />
    );
}

export default TextAreaField;