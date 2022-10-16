import { Command, Event, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";

export class CommandTreeProvider implements TreeDataProvider<Item> {

    data: Item[];

    constructor(items: Item[]) {
        this.data = items;
    }

    onDidChangeTreeData?: Event<Item | null | undefined> | undefined;

    getTreeItem(element: Item): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: Item | undefined): ProviderResult<Item[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}

export class Item extends TreeItem {
    children: Item[] | undefined;

    constructor(label: string, command?: Command, children?: Item[]) {
        super(
            label,
            children === undefined ? TreeItemCollapsibleState.None :
                TreeItemCollapsibleState.Expanded);
        this.children = children;
        this.command = command;
    }
}