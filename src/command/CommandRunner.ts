import { QuickPickItem, window } from "vscode";
import { Action, Input, PromptString, PickString } from "../config/Configuration";

export async function showQuickPick(action: Action) {
    const terminalArgs: string[] = [];
    if (!action.arguments.length) {
        const terminal = window.createTerminal(action.label);
        terminal.sendText(action.command);
    } else {
        for (let index = 0; index < action.arguments.length; index++) {
            const input = action.arguments[index];
            let res = await handleArgument(input);
            if (res !== undefined && res.length) {
                terminalArgs.push(res);
            }
        }
        const finalArgs = terminalArgs.reduce((previous: String, current: String) => {
            return previous + ' ' + current;
        });
        const terminal = window.createTerminal(action.label);
        terminal.sendText(action.command + " " + finalArgs);
    }
}

async function handleArgument(arg: Input): Promise<string | undefined> {
    if (typeof arg === 'string') {
        return arg;
    } else {
        switch (arg.type) {
            case 'PickString': return askUserToPickString(arg);
            case 'PromptString': return askUserToPromptString(arg);
            default: return undefined;
        }
    }

}

async function askUserToPromptString(arg: PromptString): Promise<string | undefined> {
    return window.showInputBox();
}

async function askUserToPickString(arg: PickString): Promise<string | undefined> {
    const quickPick = await createQuickPick(arg.options);
    const pickedItems = quickPick ?? [];
    const pickedLabels = pickedItems.map(
        (item: QuickPickItem) => {
            return item.label;
        }
    );
    return pickedLabels.reduce((previous: String, current: String) => {
        return previous + ' ' + current;
    });
}

async function createQuickPick(labels: String[]): Promise<QuickPickItem[] | undefined> {
    const items = labels.map((v: String) => {
        return { label: v, picked: false } as QuickPickItem;
    });
    return window.showQuickPick(items, {
        canPickMany: true
    });
}
