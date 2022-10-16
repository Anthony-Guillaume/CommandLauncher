import { workspace } from "vscode";

const baseSectionConfig = 'basic';

export const enum Section {
    'command' = 'command',
    'actions' = 'actions'
}

export const getConfiguration = () => workspace.getConfiguration(baseSectionConfig);

export type CommandArgument = string[] | string;

export type InputType = 'string' | 'promptString' | 'pickString';
export type Input = string | PromptString | PickString;

export interface Action {
    command: string;
    arguments: Input[];
    label?: string;
    group?: string
}

export interface PromptString {
    type: 'PromptString';
    label: string
}

export interface PickString {
    type: 'PickString';
    options: string[]
}

export function fillType(input: Input) {
    if (typeof input === 'string') {
        return;
    } else {
        if ("label" in input) {
            input.type = 'PromptString';
        } else if ("options" in input) {
            input.type = 'PickString';
        }
    }
}