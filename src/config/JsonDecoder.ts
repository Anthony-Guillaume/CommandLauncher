import { Action, fillType, getConfiguration, Section } from "./Configuration";

export function loadActions(): Action {
    const actions = getConfiguration().get<Action>(Section.actions,
        {
            command: "",
            arguments: []
        }
    );
    console.log(JSON.stringify(actions));
    actions.arguments.forEach(v => fillType(v));
    fillUndefined(actions);
    return actions;
}

function fillUndefined(action: Action) {
    if (action.label === undefined) {
        action.label = action.command;
    }
    if (action.group === undefined) {
        action.group = "";
    }
}