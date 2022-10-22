import { QuickPickItem, Terminal, window } from "vscode";
import { Action, Input, PromptString, PickString } from "../config/Configuration";

export class CommandRunner {
    actions: Map<Action, string> = new Map<Action, string>();
    terminals: Map<Action, Terminal> = new Map<Action, Terminal>();

    constructor() {
        window.onDidCloseTerminal(terminal => {
            const actionsToDelete: Action[] = [];
            this.terminals.forEach((value, key) => {
                if (value === terminal) {
                    actionsToDelete.push(key);
                }
            });
            actionsToDelete.forEach(v => this.terminals.delete(v));
        });

    }

    async runActionWithLastArguments(action: Action) {
        const terminalCommand = this.actions.get(action);
        if (terminalCommand !== undefined) {
            this.executeCommand(terminalCommand, action);
        }
    }

    async showQuickPick(action: Action) {
        const terminalArgs: string[] = [];
        if (!action.arguments.length) {
            this.executeCommand(action.command, action);
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
            const terminalCommand = action.command + " " + finalArgs;
            this.executeCommand(terminalCommand, action);
        }
    }

    executeCommand(text: string, action: Action) {
        this.actions.set(action, text);
        const currentTerminal = this.terminals.get(action);
        if (currentTerminal !== undefined) {
            currentTerminal.sendText(text);
            return;
        }
        const terminal = window.createTerminal(action.label);
        this.terminals.set(action, terminal);
        terminal.sendText(text);
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
        return window.showInputBox({ prompt: arg.inputContext });
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
