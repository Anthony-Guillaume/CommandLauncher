import { commands, ExtensionContext, window } from 'vscode';
import { showQuickPick } from './command/CommandRunner';
import { Action } from './config/Configuration';
import { buildCommandTreeProvider } from './view/CommandTreeBuilder';

export function activate(context: ExtensionContext) {
	const provider = buildCommandTreeProvider();
	context.subscriptions.push(
		window.registerTreeDataProvider('launcher', provider)
	);
	context.subscriptions.push(
		commands.registerCommand("launcher.onItemTreeSelected", (action: Action) => showQuickPick(action))
	);
	context.subscriptions.push(
		commands.registerCommand("commandLauncher.refresh", () => provider.refresh())
	);
}
