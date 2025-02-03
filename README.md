# asset-failure-plugin

Indexes the current [DataModel](https://create.roblox.com/docs/reference/engine/classes/DataModel) to find instances where its referenced assets failed to load. (E.g. `<Sound>.SoundId`)

The property list per class name are manually written in src/lib/indexDataModel.ts, if an instance or property is skipped, please create an issue.
