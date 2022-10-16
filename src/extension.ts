import { commands, ExtensionContext, window } from 'vscode';
import { showQuickPick } from './command/CommandRunner';
import { Action } from './config/Configuration';
import { buildCommandTreeProvider } from './view/CommandTreeBuilder';

export function activate(context: ExtensionContext) {
	commands.registerCommand("launcher.onItemTreeSelected", (action: Action) => showQuickPick(action));

	context.subscriptions.push(
		window.registerTreeDataProvider('launcher', buildCommandTreeProvider())
	);
}
