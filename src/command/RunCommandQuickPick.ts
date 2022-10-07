import { window, QuickPickItem } from 'vscode';
import { loadCommand } from '../config/JsonDecoder';

export async function showQuickPick(labels: String[]): Promise<void> {
    const quickPick = await createQuickPick(labels);
    const pickedItems = quickPick ?? [];
    const pickedLabels = pickedItems.map(
        (item: QuickPickItem) => {
            return item.label;
        }
    );
    handlePickedLabels(pickedLabels);
}

async function createQuickPick(labels: String[]): Promise<QuickPickItem[] | undefined> {
    const items = labels.map((v: String) => {
        return { label: v, picked: false } as QuickPickItem;
    });
    return window.showQuickPick(items, {
        canPickMany: true
    });
}

function handlePickedLabels(labels: String[]): void {
    if (!labels.length) {
        window.showErrorMessage(`No parameter picked !`);
        return;
    }

    window.showInformationMessage(`Got: ${labels}`);
    const command = loadCommand();
    const terminal = window.createTerminal(command.name);
    const terminalCommand = command.name + ' ' + labels.reduce((previous: String, current: String) => {
        return previous + ' ' + current;
    });
    terminal.sendText(terminalCommand);
}
