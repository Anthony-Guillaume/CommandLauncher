import { commands, ExtensionContext } from 'vscode';
import { showQuickPick } from './command/RunCommandQuickPick';
import { loadArgsToPick } from './config/JsonDecoder';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand("basic.runCommand", async () => showQuickPick(loadArgsToPick()))
	);
}
