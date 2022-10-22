import { QuickPickItem, window } from "vscode";
import { Action, Input, PromptString, PickString } from "../config/Configuration";

export class CommandRunner {
    actions: Map<Action, string> = new Map<Action, string>();

    async runActionWithLastArguments(action: Action) {
        const terminalCommand = this.actions.get(action);
        if (terminalCommand !== undefined) {
            const terminal = window.createTerminal(action.label);
            terminal.sendText(terminalCommand);
        }
    }

    async showQuickPick(action: Action) {
        const terminalArgs: string[] = [];
        if (!action.arguments.length) {
            const terminal = window.createTerminal(action.label);
            const terminalCommand = action.command;
            this.actions.set(action, terminalCommand);
            terminal.sendText(action.command);
        } else {
            for (let index = 0; index < action.arguments.length; index++) {
                const input = action.arguments[index];
                let res = await this.handleArgument(input);
                if (res !== undefined && res.length) {
                    terminalArgs.push(res);
                }
            }
            const finalArgs = terminalArgs.reduce((previous: String, current: String) => {
                return previous + ' ' + current;
            });
            const terminal = window.createTerminal(action.label);
            const terminalCommand = action.command + " " + finalArgs;
            this.actions.set(action, terminalCommand);
            terminal.sendText(terminalCommand);
        }
    }

    async handleArgument(arg: Input): Promise<string | undefined> {
        if (typeof arg === 'string') {
            return arg;
        } else {
            switch (arg.type) {
                case 'PickString': return this.askUserToPickString(arg);
                case 'PromptString': return this.askUserToPromptString(arg);
                default: return undefined;
            }
        }

    }

    async askUserToPromptString(arg: PromptString): Promise<string | undefined> {
        return window.showInputBox();
    }

    async askUserToPickString(arg: PickString): Promise<string | undefined> {
        const quickPick = await this.createQuickPick(arg.options);
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

    async createQuickPick(labels: String[]): Promise<QuickPickItem[] | undefined> {
        const items = labels.map((v: String) => {
            return { label: v, picked: false } as QuickPickItem;
        });
        return window.showQuickPick(items, {
            canPickMany: true
        });
    }

}
