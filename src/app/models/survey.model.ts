export interface Survey {
    id: number;
    name: string;
    createdAt: Date;
    surveyTemplateForms: SurveyTemplateForm[];
}

export interface SurveyTemplateForm {
    id: number;
    surveyTemplateId: number;
    type: string;
    keyName: string;
    label: string;
    value;
    sequence: number;
}