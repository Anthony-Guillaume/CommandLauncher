import { getConfiguration, PickCommand, Section } from "./Configuration";

export function loadArgsToPick(): string[] {
    return getConfiguration().get<string[]>(Section.argsToPick, []);
}

export function loadCommand(): PickCommand {
    return {
        name: getConfiguration().get<string>(Section.command, "")
    };
}
