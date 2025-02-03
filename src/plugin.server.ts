import Iris from '@rbxts/iris';

import App from 'app';

function init() {
  if (!plugin) return;

  const toolbar = plugin.CreateToolbar('Asset Failures');
  const id = 'asset-failure-plugin';
  const pluginGui = plugin.CreateDockWidgetPluginGui(
    id,
    new DockWidgetPluginGuiInfo(
      Enum.InitialDockState.Right,
      false,
      false,
      500,
      500,
      500,
      500,
    ),
  );
  pluginGui.Name = 'Asset Failures';
  pluginGui.Title = 'Asset Failures';

  Iris.UpdateGlobalConfig({
    UseScreenGUIs: false,
    WindowBorderSize: 0,
  });
  Iris.Init(pluginGui);
  Iris.Connect(() => App());

  const mainButton = toolbar.CreateButton(
    `${id}-main`,
    '',
    'rbxassetid://127098621699023',
    pluginGui.Title,
  );

  pluginGui.BindToClose(() => {
    pluginGui.Enabled = false;
    mainButton.SetActive(false);
  });

  mainButton.Click.Connect(() => {
    pluginGui.Enabled = !pluginGui.Enabled;
    mainButton.SetActive(pluginGui.Enabled);
  });
}

init();
