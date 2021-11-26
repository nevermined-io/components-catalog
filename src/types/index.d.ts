import { MetaDataFormDTO } from "../utils/mapFormDataToMetaData";

type FormInformation = {
    label: string;
    id: string | keyof MetaDataFormDTO;
    type: 'select' | 'text' | 'textarea' | 'number' | 'checkbox' | 'radio' | 'file';
    rows?: number;
    cols?: number;
    min?: number;
    max?: number;
    step?: number;
    multiple?: boolean;
    mimeType?: string;
};

export { FormInformation }
