import { Action } from "../config/Configuration";
import { loadActions } from "../config/JsonDecoder";
import { CommandTreeProvider, Item } from "./CommandTree";

export function buildCommandTreeProvider(): CommandTreeProvider {
    const actions = loadActions();
    const groups = findGroups(actions);
    const items = buildItems(groups);
    return new CommandTreeProvider(items);
}

function buildItems(groups: Map<string, Action[]>): Item[] {
    const items: Item[] = [];
    groups.forEach((v, k) => {
        const children = v.map(action => {
            const item: Item = new Item(buildLabel(action));
            item.command = {
                title: "",
                command: 'launcher.onItemTreeSelected',
                arguments: [action]
            };
            return item;
        });
        items.push(new Item(k, undefined, children));
    });
    return items;
}

function findGroups(actions: Action): Map<string, Action[]> {
    const groups = new Map<string, Action[]>();
    groups.set(actions.group!!, [actions]);
    return groups;
}

// function findGroups(actions: Action[]): Map<string, Action[]> {
//     const groups = new Map<string, Action[]>();
//     actions.forEach(v => {
//         if (groups.has(v.group)) {
//             groups.get(v.group)!!.push(v);
//         } else {
//             groups.set(v.group, [v]);
//         }
//     });
//     return groups;
// }

function buildLabel(action: Action) {
    if (action.label === undefined) {
        return action.command;
    }
    return action.label.length ? action.label : action.command;
}