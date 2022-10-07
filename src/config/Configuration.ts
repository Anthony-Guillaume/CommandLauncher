import { workspace } from "vscode";

const baseSectionConfig = 'basic';
export const getConfiguration = () => workspace.getConfiguration(baseSectionConfig);

export const enum Section {
    'command' = 'command',
    'argsToPick' = 'argsToPick'
}

export interface PickCommand {
    name: string
}
